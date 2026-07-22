import { useCallback, useEffect, useRef, useState } from 'react';
import type { RetellWebClient } from 'retell-client-js-sdk';
import type { Lang } from '../App';

export type VoiceState =
  | 'idle'
  | 'requesting-permission'
  | 'connecting'
  | 'listening'
  | 'speaking'
  | 'ended'
  | 'error';

export type VoiceError =
  | 'permission-denied'
  | 'permission-unavailable'
  | 'billing'
  | 'rate-limit'
  | 'configuration'
  | 'network'
  | 'provider'
  | 'unknown';

let activeCallOwner: symbol | null = null;

type TranscriptEntry = { role?: string; content?: string };

export function useRetellVoiceAgent(language: Lang) {
  const ownerRef = useRef(Symbol('retell-call'));
  const clientRef = useRef<RetellWebClient | null>(null);
  const busyRef = useRef(false);
  const mountedRef = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const maximumTimerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);
  const lastAttemptRef = useRef(0);
  const startedAtRef = useRef(0);
  const resetAfterStopRef = useRef(false);

  const [state, setState] = useState<VoiceState>('idle');
  const [error, setError] = useState<VoiceError | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const clearTimers = useCallback(() => {
    if (maximumTimerRef.current !== null) window.clearTimeout(maximumTimerRef.current);
    if (elapsedTimerRef.current !== null) window.clearInterval(elapsedTimerRef.current);
    maximumTimerRef.current = null;
    elapsedTimerRef.current = null;
  }, []);

  const releaseOwnership = useCallback(() => {
    if (activeCallOwner === ownerRef.current) activeCallOwner = null;
    busyRef.current = false;
    clearTimers();
  }, [clearTimers]);

  const stop = useCallback((reset = false) => {
    resetAfterStopRef.current = reset;
    abortRef.current?.abort();
    abortRef.current = null;
    try {
      clientRef.current?.stopCall();
    } catch {
      // The SDK may already have released the call after a provider-side end.
    }
    releaseOwnership();
    if (mountedRef.current) {
      setState(reset ? 'idle' : 'ended');
      if (reset) {
        setError(null);
        setElapsedSeconds(0);
        setTranscript([]);
      }
    }
  }, [releaseOwnership]);

  const ensureClient = useCallback(async () => {
    if (clientRef.current) return clientRef.current;
    const { RetellWebClient: RetellClient } = await import('retell-client-js-sdk');
    if (!mountedRef.current) return null;
    const client = new RetellClient();
    clientRef.current = client;

    const onCallStarted = () => {
      if (!mountedRef.current) return;
      startedAtRef.current = Date.now();
      setState('listening');
      setElapsedSeconds(0);
      elapsedTimerRef.current = window.setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }, 1_000);
      maximumTimerRef.current = window.setTimeout(() => stop(false), 5 * 60 * 1_000);
    };
    const onCallEnded = () => {
      const shouldReset = resetAfterStopRef.current;
      resetAfterStopRef.current = false;
      releaseOwnership();
      if (mountedRef.current) setState(shouldReset ? 'idle' : 'ended');
    };
    const onAgentStartTalking = () => mountedRef.current && setState('speaking');
    const onAgentStopTalking = () => mountedRef.current && setState('listening');
    const onUpdate = (payload: { transcript?: TranscriptEntry[] }) => {
      if (mountedRef.current && Array.isArray(payload?.transcript)) setTranscript(payload.transcript);
    };
    const onError = () => {
      releaseOwnership();
      if (mountedRef.current) {
        setError('provider');
        setState('error');
      }
      try { client.stopCall(); } catch { /* already stopped */ }
    };

    client.on('call_started', onCallStarted);
    client.on('call_ended', onCallEnded);
    client.on('agent_start_talking', onAgentStartTalking);
    client.on('agent_stop_talking', onAgentStopTalking);
    client.on('update', onUpdate);
    client.on('error', onError);

    return client;
  }, [releaseOwnership, stop]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      try { clientRef.current?.stopCall(); } catch { /* no active call */ }
      clientRef.current?.removeAllListeners();
      releaseOwnership();
      clientRef.current = null;
    };
  }, [releaseOwnership]);

  const previousLanguageRef = useRef(language);
  useEffect(() => {
    if (previousLanguageRef.current !== language) {
      previousLanguageRef.current = language;
      stop(true);
    }
  }, [language, stop]);

  const start = useCallback(async () => {
    const now = Date.now();
    if (busyRef.current || (activeCallOwner && activeCallOwner !== ownerRef.current)) return;
    if (now - lastAttemptRef.current < 2_000) return;

    lastAttemptRef.current = now;
    busyRef.current = true;
    activeCallOwner = ownerRef.current;
    setError(null);
    setElapsedSeconds(0);
    setTranscript([]);
    setState('requesting-permission');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('permission-unavailable');
        setState('error');
        releaseOwnership();
        return;
      }

      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionStream.getTracks().forEach((track) => track.stop());

      setState('connecting');
      const controller = new AbortController();
      abortRef.current = controller;
      const clientPromise = ensureClient();
      const response = await fetch('/api/retell/create-web-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
        cache: 'no-store',
        signal: controller.signal,
      });
      const body = await response.json().catch(() => ({})) as { access_token?: unknown; error?: unknown };

      if (!response.ok || typeof body.access_token !== 'string') {
        if (response.status === 402 || body.error === 'BILLING_UNAVAILABLE') setError('billing');
        else if (response.status === 429 || body.error === 'RATE_LIMITED') setError('rate-limit');
        else if (body.error === 'SERVICE_NOT_CONFIGURED') setError('configuration');
        else if (response.status >= 500) setError('provider');
        else setError('unknown');
        setState('error');
        releaseOwnership();
        return;
      }

      abortRef.current = null;
      const client = await clientPromise;
      if (!client) throw new Error('Retell client unavailable');
      await client.startCall({
        accessToken: body.access_token,
        emitRawAudioSamples: false,
      });
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      if (cause instanceof DOMException && (cause.name === 'NotAllowedError' || cause.name === 'SecurityError')) {
        setError('permission-denied');
      } else if (!navigator.onLine) {
        setError('network');
      } else {
        setError('provider');
      }
      setState('error');
      releaseOwnership();
    }
  }, [ensureClient, language, releaseOwnership]);

  const reset = useCallback(() => {
    setError(null);
    setElapsedSeconds(0);
    setTranscript([]);
    setState('idle');
  }, []);

  return { state, error, elapsedSeconds, transcript, start, stop, reset };
}
