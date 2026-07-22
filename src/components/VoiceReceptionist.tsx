import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Headphones, Mic, Phone, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useLang } from '../App';
import { useRetellVoiceAgent, type VoiceError, type VoiceState } from '../hooks/useRetellVoiceAgent';

const copy = {
  en: {
    ready: 'Ready', permission: 'Microphone permission', connecting: 'Connecting securely…',
    listening: 'Listening…', speaking: 'AI receptionist is speaking…', ended: 'Conversation ended', error: 'Unable to connect',
    intro: 'A real-time voice demonstration with the English Cambridge AI Receptionist.',
    disclosure: 'You are speaking with an AI, not a human.',
    privacy: 'You are about to speak with an AI receptionist. Your voice will be processed to provide the conversation. Please do not share passwords, payment information or sensitive personal data.',
    permissionHelp: 'Allow microphone access in your browser to begin the live conversation.',
    start: 'Start live conversation', end: 'End conversation', retry: 'Try again', contact: 'Book a consultation', transcript: 'Live transcript',
  },
  pl: {
    ready: 'Gotowa', permission: 'Dostęp do mikrofonu', connecting: 'Bezpieczne łączenie…',
    listening: 'Słucham…', speaking: 'Recepcjonistka AI mówi…', ended: 'Rozmowa zakończona', error: 'Nie udało się połączyć',
    intro: 'Rozmowa głosowa na żywo z Polską Recepcjonistką Cambridge AI.',
    disclosure: 'Rozmawiasz z AI, a nie z człowiekiem.',
    privacy: 'Za chwilę rozpoczniesz rozmowę z recepcjonistką AI. Twój głos będzie przetwarzany w celu prowadzenia rozmowy. Nie podawaj haseł, danych płatniczych ani poufnych danych osobowych.',
    permissionHelp: 'Zezwól przeglądarce na dostęp do mikrofonu, aby rozpocząć rozmowę.',
    start: 'Rozpocznij rozmowę na żywo', end: 'Zakończ rozmowę', retry: 'Spróbuj ponownie', contact: 'Umów konsultację', transcript: 'Transkrypcja na żywo',
  },
} as const;

function errorMessage(error: VoiceError | null, language: 'en' | 'pl') {
  const messages: Record<VoiceError, { en: string; pl: string }> = {
    'permission-denied': { en: 'Microphone access was blocked. Enable it in your browser settings and try again.', pl: 'Dostęp do mikrofonu został zablokowany. Włącz go w ustawieniach przeglądarki i spróbuj ponownie.' },
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

export function VoiceReceptionist() {
  const { lang } = useLang();
  const t = copy[lang];
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const { state, error, elapsedSeconds, transcript, start, stop, reset } = useRetellVoiceAgent(lang);
  const active = state === 'listening' || state === 'speaking';
  const status = statusLabel(state, lang);
  const transcriptText = useMemo(
    () => transcript.filter((item) => item.content).map((item) => `${item.role === 'agent' ? 'AI' : lang === 'pl' ? 'Ty' : 'You'}: ${item.content}`).join('\n'),
    [lang, transcript],
  );

  useEffect(() => {
    const openPanel = () => setIsOpen(true);
    window.addEventListener('open-retell-demo', openPanel);
    return () => window.removeEventListener('open-retell-demo', openPanel);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('chat-open', isOpen);
    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  const close = () => {
    stop(true);
    setIsOpen(false);
  };

  const contact = () => {
    close();
    window.setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 0);
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            aria-label="Cambridge AI Receptionist"
            className="absolute bottom-16 md:bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-[390px] max-h-[78vh] overflow-y-auto rounded-3xl bg-white shadow-[0_30px_80px_rgba(0,31,63,0.28)] border border-brand-navy/10"
          >
            <header className="sticky top-0 z-10 bg-brand-navy px-5 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-brand-cyan text-brand-navy flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <h2 className="font-black text-sm tracking-wide truncate">Cambridge AI Receptionist</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${state === 'error' ? 'bg-red-400' : active ? 'bg-brand-cyan' : 'bg-white/50'}`} />
                    <span aria-live="polite" className="text-[10px] font-bold uppercase tracking-widest text-white/70">{status}</span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black">{lang.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button onClick={close} aria-label={lang === 'pl' ? 'Zamknij' : 'Close'} className="w-10 h-10 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan flex items-center justify-center"><X className="w-5 h-5" /></button>
            </header>

            <div className="p-6">
              {(state === 'idle' || state === 'requesting-permission' || state === 'connecting') && (
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 rounded-full bg-brand-gray flex items-center justify-center relative mb-5">
                    <Mic className="w-9 h-9 text-brand-navy" />
                    {state === 'connecting' && <motion.span className="absolute inset-0 rounded-full border-2 border-brand-cyan" animate={reduceMotion ? undefined : { scale: [1, 1.25], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} />}
                  </div>
                  <h3 className="font-display text-2xl font-black text-brand-navy mb-2">{state === 'idle' ? t.intro : status}</h3>
                  {state === 'requesting-permission' && <p className="text-sm text-brand-navy/60 mb-4">{t.permissionHelp}</p>}
                  {state === 'idle' && (
                    <div className="text-left rounded-2xl bg-brand-gray/60 border border-brand-navy/5 p-4 mb-5">
                      <p className="text-xs font-black text-brand-navy mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-brand-blue" />{t.disclosure}</p>
                      <p className="text-xs leading-relaxed text-brand-navy/65">{t.privacy}</p>
                    </div>
                  )}
                  {state === 'idle' && <button onClick={start} className="w-full min-h-12 rounded-xl bg-brand-navy text-white text-xs font-black uppercase tracking-widest hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/40 transition-colors">{t.start}</button>}
                </div>
              )}

              {active && (
                <div className="text-center">
                  <div className="flex justify-center items-center gap-1 h-20 mb-3" aria-hidden="true">
                    {[18, 34, 50, 66, 44, 28, 54, 38, 20].map((height, index) => (
                      <motion.span key={height + index} className="w-1.5 rounded-full bg-gradient-to-t from-brand-blue to-brand-cyan" animate={reduceMotion ? { height } : { height: [12, state === 'speaking' ? height : Math.max(16, height / 2), 12] }} transition={{ repeat: Infinity, duration: 0.8 + index * 0.05, delay: index * 0.04 }} />
                    ))}
                  </div>
                  <h3 aria-live="polite" className="font-display text-2xl font-black text-brand-navy">{status}</h3>
                  <p className="font-mono text-sm text-brand-navy/50 mt-1 mb-5">{formatTime(elapsedSeconds)} / 05:00</p>
                  {transcriptText && <details className="text-left rounded-xl bg-brand-gray/60 p-3 mb-4"><summary className="cursor-pointer text-xs font-black text-brand-navy">{t.transcript}</summary><p className="whitespace-pre-wrap mt-2 text-xs leading-relaxed text-brand-navy/65">{transcriptText}</p></details>}
                  <p className="text-[11px] text-brand-navy/55 mb-4">{t.disclosure}</p>
                  <button onClick={() => stop(false)} className="w-full min-h-12 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-widest hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-200">{t.end}</button>
                </div>
              )}

              {state === 'ended' && (
                <div className="text-center"><Phone className="w-11 h-11 text-brand-blue mx-auto mb-4" /><h3 className="font-display text-2xl font-black text-brand-navy mb-5">{t.ended}</h3><div className="grid gap-3"><button onClick={() => { reset(); void start(); }} className="min-h-12 rounded-xl bg-brand-navy text-white text-xs font-black uppercase tracking-widest">{t.retry}</button><button onClick={contact} className="min-h-12 rounded-xl border border-brand-navy/15 text-brand-navy text-xs font-black uppercase tracking-widest">{t.contact}</button></div></div>
              )}

              {state === 'error' && (
                <div role="alert" className="text-center"><div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto mb-4 flex items-center justify-center"><X className="w-6 h-6" /></div><h3 className="font-display text-2xl font-black text-brand-navy mb-2">{t.error}</h3><p className="text-sm leading-relaxed text-brand-navy/60 mb-5">{errorMessage(error, lang)}</p><div className="grid gap-3"><button onClick={() => { reset(); void start(); }} className="min-h-12 rounded-xl bg-brand-navy text-white text-xs font-black uppercase tracking-widest">{t.retry}</button><button onClick={contact} className="min-h-12 rounded-xl border border-brand-navy/15 text-brand-navy text-xs font-black uppercase tracking-widest">{t.contact}</button></div></div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={reduceMotion ? undefined : { scale: 1.07 }}
        whileTap={reduceMotion ? undefined : { scale: 0.95 }}
        onClick={() => isOpen ? close() : setIsOpen(true)}
        aria-label={lang === 'pl' ? 'Otwórz recepcjonistkę AI' : 'Open AI receptionist'}
        aria-expanded={isOpen}
        className="w-16 h-16 bg-brand-navy rounded-full shadow-[0_12px_30px_rgba(0,31,63,0.35)] flex items-center justify-center border border-brand-cyan/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/40"
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <Headphones className="text-white w-7 h-7" />}
      </motion.button>
    </div>
  );
}
