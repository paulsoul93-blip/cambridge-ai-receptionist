import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AudioLines, CalendarDays, Headphones, Mic, PhoneOff, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useLang } from '../App';
import { useRetellVoiceAgent, type VoiceError, type VoiceState } from '../hooks/useRetellVoiceAgent';

const copy = {
  en: {
    ready: 'Ready', permission: 'Microphone permission', connecting: 'Connecting securely…',
    listening: 'Listening…', speaking: 'Receptionist is speaking…', ended: 'Conversation ended', error: 'Unable to connect',
    liveLabel: 'AI voice · live',
    intro: 'Meet your AI receptionist.',
    introBody: 'A real-time voice demonstration in English. Keep browsing — this window stays out of your way.',
    disclosure: 'AI conversation',
    privacy: 'Your voice is processed by Retell AI to provide this conversation. Do not share passwords, payment details, health information or other sensitive data.',
    permissionHelp: 'Your browser is waiting for your microphone choice.',
    confirmStatus: 'Your permission',
    confirmTitle: 'Use your microphone?',
    confirmBody: 'We will ask the browser for microphone access only after you continue. It is used solely for this live AI conversation and stops when you end or close it.',
    browserHint: 'Next, choose “Allow” in the browser prompt — beside the address bar on desktop or on screen on mobile.',
    confirm: 'Continue',
    cancel: 'Cancel',
    start: 'Start live conversation', end: 'End conversation', retry: 'Try again', contact: 'Book a consultation', transcript: 'Live transcript',
    close: 'Close AI receptionist', open: 'Open AI receptionist', maxTime: '5 min maximum',
  },
  pl: {
    ready: 'Gotowa', permission: 'Dostęp do mikrofonu', connecting: 'Bezpieczne łączenie…',
    listening: 'Słucham…', speaking: 'Recepcjonistka mówi…', ended: 'Rozmowa zakończona', error: 'Nie udało się połączyć',
    liveLabel: 'Głos AI · na żywo',
    intro: 'Poznaj swoją recepcjonistkę AI.',
    introBody: 'Prawdziwa rozmowa głosowa po polsku. Możesz dalej przeglądać stronę — to okno nie blokuje witryny.',
    disclosure: 'Rozmowa z AI',
    privacy: 'Twój głos jest przetwarzany przez Retell AI w celu prowadzenia rozmowy. Nie podawaj haseł, danych płatniczych, informacji medycznych ani innych poufnych danych.',
    permissionHelp: 'Przeglądarka czeka na Twój wybór dotyczący mikrofonu.',
    confirmStatus: 'Twoja zgoda',
    confirmTitle: 'Użyć mikrofonu?',
    confirmBody: 'Dopiero po wybraniu „Kontynuuj” poprosimy przeglądarkę o dostęp do mikrofonu. Służy on wyłącznie tej rozmowie z AI i wyłącza się po jej zakończeniu lub zamknięciu.',
    browserHint: 'Następnie wybierz „Zezwól” w komunikacie przeglądarki — przy pasku adresu na komputerze lub na ekranie telefonu.',
    confirm: 'Kontynuuj',
    cancel: 'Anuluj',
    start: 'Rozpocznij rozmowę', end: 'Zakończ rozmowę', retry: 'Spróbuj ponownie', contact: 'Umów konsultację', transcript: 'Transkrypcja na żywo',
    close: 'Zamknij recepcjonistkę AI', open: 'Otwórz recepcjonistkę AI', maxTime: 'Maksymalnie 5 min',
  },
} as const;

function errorMessage(error: VoiceError | null, language: 'en' | 'pl') {
  const messages: Record<VoiceError, { en: string; pl: string }> = {
    'permission-denied': { en: 'Microphone access was blocked. Use the site controls beside the address bar, allow Microphone and try again.', pl: 'Dostęp do mikrofonu został zablokowany. Użyj ustawień strony przy pasku adresu, zezwól na Mikrofon i spróbuj ponownie.' },
    'permission-unavailable': { en: 'This browser cannot provide microphone access. Try current Safari, Chrome or Edge.', pl: 'Ta przeglądarka nie udostępnia mikrofonu. Użyj aktualnego Safari, Chrome lub Edge.' },
    billing: { en: 'The live demo is temporarily unavailable because its call allowance needs attention.', pl: 'Demo na żywo jest chwilowo niedostępne z powodu limitu rozliczeniowego.' },
    'rate-limit': { en: 'Too many connection attempts. Please wait a moment before trying again.', pl: 'Zbyt wiele prób połączenia. Odczekaj chwilę i spróbuj ponownie.' },
    configuration: { en: 'The live demo is being configured. Please use the consultation option.', pl: 'Demo na żywo jest konfigurowane. Skorzystaj z opcji konsultacji.' },
    network: { en: 'The network connection was lost. Check your connection and try again.', pl: 'Utracono połączenie z siecią. Sprawdź internet i spróbuj ponownie.' },
    provider: { en: 'The voice service did not connect. Please try again in a moment.', pl: 'Usługa głosowa nie połączyła się. Spróbuj ponownie za chwilę.' },
    unknown: { en: 'The live conversation could not be started. Please try again.', pl: 'Nie udało się rozpocząć rozmowy na żywo. Spróbuj ponownie.' },
  };
  return error ? messages[error][language] : '';
}

function statusLabel(state: VoiceState, language: 'en' | 'pl') {
  const t = copy[language];
  return ({
    idle: t.ready,
    'requesting-permission': t.permission,
    connecting: t.connecting,
    listening: t.listening,
    speaking: t.speaking,
    ended: t.ended,
    error: t.error,
  } as const)[state];
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

const waveform = [18, 32, 46, 28, 52, 36, 22];

export function VoiceReceptionist() {
  const { lang } = useLang();
  const t = copy[lang];
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [permissionConfirmation, setPermissionConfirmation] = useState(false);
  const { state, error, elapsedSeconds, transcript, start, stop, reset } = useRetellVoiceAgent(lang);
  const active = state === 'listening' || state === 'speaking';
  const status = permissionConfirmation ? t.confirmStatus : statusLabel(state, lang);
  const transcriptText = useMemo(
    () => transcript.filter((item) => item.content).map((item) => `${item.role === 'agent' ? 'AI' : lang === 'pl' ? 'Ty' : 'You'}: ${item.content}`).join('\n'),
    [lang, transcript],
  );

  const open = useCallback(() => {
    window.dispatchEvent(new CustomEvent('voice-panel-opened'));
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const openPanel = () => open();
    window.addEventListener('open-retell-demo', openPanel);
    return () => window.removeEventListener('open-retell-demo', openPanel);
  }, [open]);

  useEffect(() => {
    document.body.classList.toggle('chat-open', isOpen);
    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  useEffect(() => setPermissionConfirmation(false), [lang]);

  const requestStart = () => {
    reset();
    setPermissionConfirmation(true);
  };

  const confirmStart = () => {
    setPermissionConfirmation(false);
    void start();
  };

  const close = () => {
    setPermissionConfirmation(false);
    stop(true);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('voice-panel-closed'));
  };

  const contact = () => {
    close();
    window.setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 0);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[240] flex items-end gap-2.5 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.975, y: 12 }}
            role="dialog"
            aria-label="Cambridge AI Receptionist"
            className="pointer-events-auto absolute bottom-[4.25rem] right-0 flex max-h-[min(68dvh,570px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.5rem] border border-white/85 bg-white/88 text-brand-navy shadow-[0_24px_70px_rgba(0,31,63,0.24)] backdrop-blur-xl sm:bottom-[4.5rem] sm:w-[360px]"
          >
            <div className="h-px shrink-0 bg-gradient-to-r from-brand-blue via-brand-cyan to-transparent" />
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-navy/7 bg-white/52 px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-navy text-brand-cyan shadow-[0_8px_18px_rgba(0,31,63,0.16)]">
                  <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
                  <span className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${state === 'error' ? 'bg-red-500' : active ? 'bg-emerald-400' : 'bg-brand-cyan'}`} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-[13px] font-black tracking-[-0.015em]">Cambridge AI Receptionist</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span aria-live="polite" className="truncate text-[9px] font-extrabold uppercase tracking-[0.15em] text-brand-navy/50">{status}</span>
                    <span className="rounded-full border border-brand-blue/10 bg-brand-blue/6 px-1.5 py-0.5 text-[8px] font-black text-brand-blue">{lang.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button onClick={close} aria-label={t.close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-navy/7 bg-white/55 transition-colors hover:bg-brand-navy hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/25">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {permissionConfirmation && (
                <div role="group" aria-labelledby="microphone-consent-title">
                  <div className="mb-3.5 flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/12 text-brand-blue"><Mic className="h-5 w-5" aria-hidden="true" /></div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">{t.confirmStatus}</p>
                      <h3 id="microphone-consent-title" className="mt-1 font-display text-xl font-black tracking-[-0.035em]">{t.confirmTitle}</h3>
                    </div>
                  </div>
                  <p className="text-xs leading-[1.6] text-brand-navy/64">{t.confirmBody}</p>
                  <div className="mt-3 flex gap-2.5 rounded-2xl border border-brand-cyan/18 bg-brand-cyan/7 p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
                    <p className="text-[10px] leading-relaxed text-brand-navy/60">{t.privacy}</p>
                  </div>
                  <p className="mt-3 text-[10px] leading-relaxed text-brand-navy/48">{t.browserHint}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => setPermissionConfirmation(false)} className="min-h-11 rounded-xl border border-brand-navy/13 bg-white/55 px-3 text-[10px] font-extrabold uppercase tracking-[0.1em] transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/25">{t.cancel}</button>
                    <button onClick={confirmStart} className="min-h-11 rounded-xl bg-brand-navy px-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_8px_20px_rgba(0,31,63,0.16)] transition-colors hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/30">{t.confirm}</button>
                  </div>
                </div>
              )}

              {!permissionConfirmation && state === 'idle' && (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-navy text-brand-cyan"><AudioLines className="h-5 w-5" aria-hidden="true" /></div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-brand-blue">{t.disclosure}</p>
                      <h3 className="mt-1 font-display text-xl font-black tracking-[-0.035em]">{t.intro}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-[1.6] text-brand-navy/64">{t.introBody}</p>
                  <div className="mt-3 rounded-2xl border border-brand-navy/7 bg-brand-gray/62 p-3">
                    <p className="flex gap-2 text-[10px] leading-relaxed text-brand-navy/58"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" aria-hidden="true" />{t.privacy}</p>
                  </div>
                  <button onClick={requestStart} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(0,31,63,0.18)] transition-colors hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/30">
                    <Mic className="h-4 w-4" aria-hidden="true" />{t.start}
                  </button>
                  <p className="mt-2.5 text-center text-[9px] font-bold uppercase tracking-[0.15em] text-brand-navy/34">{t.maxTime}</p>
                </div>
              )}

              {!permissionConfirmation && (state === 'requesting-permission' || state === 'connecting') && (
                <div className="py-5 text-center">
                  <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-cyan/20 bg-brand-cyan/10 text-brand-blue">
                    <Mic className="h-6 w-6" aria-hidden="true" />
                    <motion.span className="absolute inset-0 rounded-full border border-brand-cyan/55" animate={reduceMotion ? undefined : { scale: [1, 1.25], opacity: [0.7, 0] }} transition={{ repeat: Infinity, duration: 1.35 }} />
                  </div>
                  <h3 aria-live="polite" className="font-display text-lg font-black">{status}</h3>
                  <p className="mx-auto mt-2 max-w-[260px] text-xs leading-relaxed text-brand-navy/55">{state === 'requesting-permission' ? t.permissionHelp : t.introBody}</p>
                </div>
              )}

              {active && (
                <div className="text-center">
                  <div className="mb-2 flex h-14 items-center justify-center gap-1" aria-hidden="true">
                    {waveform.map((height, index) => (
                      <motion.span key={height} className="w-1 rounded-full bg-gradient-to-t from-brand-blue to-brand-cyan" animate={reduceMotion ? { height: Math.min(height, 24) } : { height: [8, state === 'speaking' ? height : Math.max(12, height / 2), 8] }} transition={{ repeat: Infinity, duration: 0.78 + index * 0.05, delay: index * 0.035 }} />
                    ))}
                  </div>
                  <h3 aria-live="polite" className="font-display text-xl font-black tracking-[-0.03em]">{status}</h3>
                  <p className="mt-1 font-mono text-[11px] text-brand-navy/42">{formatTime(elapsedSeconds)} / 05:00</p>
                  {transcriptText && <details className="mt-3 rounded-xl border border-brand-navy/7 bg-brand-gray/58 p-3 text-left"><summary className="cursor-pointer text-[10px] font-extrabold uppercase tracking-[0.1em]">{t.transcript}</summary><p className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-brand-navy/60">{transcriptText}</p></details>}
                  <button onClick={() => stop(false)} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">
                    <PhoneOff className="h-4 w-4" aria-hidden="true" />{t.end}
                  </button>
                </div>
              )}

              {state === 'ended' && (
                <div className="py-2 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-cyan/12 text-brand-blue"><AudioLines className="h-5 w-5" aria-hidden="true" /></div>
                  <h3 className="font-display text-xl font-black">{t.ended}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={requestStart} className="min-h-11 rounded-xl bg-brand-navy px-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-white">{t.retry}</button>
                    <button onClick={contact} className="min-h-11 rounded-xl border border-brand-navy/13 px-3 text-[10px] font-extrabold uppercase tracking-[0.09em]">{t.contact}</button>
                  </div>
                </div>
              )}

              {state === 'error' && (
                <div role="alert" className="py-2 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600"><X className="h-5 w-5" aria-hidden="true" /></div>
                  <h3 className="font-display text-xl font-black">{t.error}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-navy/58">{errorMessage(error, lang)}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={requestStart} className="min-h-11 rounded-xl bg-brand-navy px-3 text-[10px] font-extrabold uppercase tracking-[0.09em] text-white">{t.retry}</button>
                    <button onClick={contact} className="min-h-11 rounded-xl border border-brand-navy/13 px-3 text-[10px] font-extrabold uppercase tracking-[0.09em]">{t.contact}</button>
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.span initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="pointer-events-none hidden rounded-full border border-white/80 bg-white/78 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-brand-navy/62 shadow-[0_8px_24px_rgba(0,31,63,0.12)] backdrop-blur-lg sm:block">
            {t.liveLabel}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        onClick={() => isOpen ? close() : open()}
        aria-label={isOpen ? t.close : t.open}
        aria-expanded={isOpen}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand-cyan/30 bg-brand-navy text-white shadow-[0_14px_34px_rgba(0,31,63,0.3)] focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35"
      >
        {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Headphones className="h-5 w-5" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
