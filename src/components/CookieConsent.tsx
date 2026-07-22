import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Cookie, ShieldCheck, SlidersHorizontal, X } from 'lucide-react';
import { useLang } from '../App';

const COOKIE_NAME = 'cambridge_cookie_preferences';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

type CookiePreferences = {
  version: 1;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const copy = {
  en: {
    eyebrow: 'Privacy choices',
    title: 'Cookies, kept simple.',
    summary: 'We use one necessary first-party cookie to remember your choice. Optional analytics and marketing cookies stay off unless you allow them.',
    necessaryOnly: 'Necessary only',
    acceptAll: 'Accept optional',
    settings: 'Cookie settings',
    settingsTitle: 'Cookie settings',
    settingsIntro: 'Choose which optional cookie categories may be used. Your choice can be changed at any time from the footer.',
    necessary: 'Necessary',
    necessaryDescription: 'Required to remember your cookie preference and keep the site working as expected.',
    alwaysOn: 'Always on',
    analytics: 'Analytics',
    analyticsDescription: 'Would help us understand anonymous site usage. No analytics service is currently active.',
    marketing: 'Marketing',
    marketingDescription: 'Would support advertising measurement. No marketing service is currently active.',
    optional: 'Optional',
    currentUse: 'What is stored now',
    cookieName: 'Cookie',
    cookiePurpose: 'Purpose',
    cookieDuration: 'Duration',
    preferencePurpose: 'Remembers your cookie choice',
    sixMonths: '6 months',
    providerNote: 'The live voice demo has a separate microphone confirmation and does not start from this cookie choice.',
    save: 'Save choices',
    close: 'Close cookie settings',
  },
  pl: {
    eyebrow: 'Wybory prywatności',
    title: 'Cookies — prosto i jasno.',
    summary: 'Używamy jednego niezbędnego cookie własnego, aby zapamiętać Twój wybór. Opcjonalne cookies analityczne i marketingowe pozostają wyłączone, dopóki ich nie zaakceptujesz.',
    necessaryOnly: 'Tylko niezbędne',
    acceptAll: 'Akceptuj opcjonalne',
    settings: 'Ustawienia cookies',
    settingsTitle: 'Ustawienia cookies',
    settingsIntro: 'Wybierz dozwolone kategorie opcjonalnych cookies. Ustawienie możesz zmienić w dowolnej chwili w stopce strony.',
    necessary: 'Niezbędne',
    necessaryDescription: 'Służą do zapamiętania wyboru cookies i prawidłowego działania strony.',
    alwaysOn: 'Zawsze aktywne',
    analytics: 'Analityczne',
    analyticsDescription: 'Mogłyby pomóc nam anonimowo mierzyć korzystanie ze strony. Obecnie żadna usługa analityczna nie jest aktywna.',
    marketing: 'Marketingowe',
    marketingDescription: 'Mogłyby służyć do pomiaru reklam. Obecnie żadna usługa marketingowa nie jest aktywna.',
    optional: 'Opcjonalne',
    currentUse: 'Co zapisujemy obecnie',
    cookieName: 'Cookie',
    cookiePurpose: 'Cel',
    cookieDuration: 'Okres',
    preferencePurpose: 'Zapamiętuje Twój wybór cookies',
    sixMonths: '6 miesięcy',
    providerNote: 'Demo głosowe ma osobne potwierdzenie mikrofonu i nie uruchamia się na podstawie wyboru cookies.',
    save: 'Zapisz wybór',
    close: 'Zamknij ustawienia cookies',
  },
} as const;

function readPreferences(): CookiePreferences | null {
  if (typeof document === 'undefined') return null;
  const prefix = `${COOKIE_NAME}=`;
  const value = document.cookie.split('; ').find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<CookiePreferences>;
    if (parsed.version !== 1 || typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
    return parsed as CookiePreferences;
  } catch {
    return null;
  }
}

function writePreferences(preferences: CookiePreferences) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  window.localStorage.removeItem('cookie-consent');
  window.dispatchEvent(new CustomEvent('cookie-preferences-changed', { detail: preferences }));
}

export function CookieConsent() {
  const { lang } = useLang();
  const t = copy[lang];
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(() => readPreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setShowBanner(preferences === null);
  }, [preferences]);

  useEffect(() => {
    const openSettings = () => {
      const saved = readPreferences();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      setSettingsOpen(true);
      setShowBanner(false);
    };
    window.addEventListener('open-cookie-settings', openSettings);
    return () => window.removeEventListener('open-cookie-settings', openSettings);
  }, []);

  useEffect(() => {
    if (!settingsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
        setShowBanner(preferences === null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [preferences, settingsOpen]);

  const save = (nextAnalytics: boolean, nextMarketing: boolean) => {
    const next: CookiePreferences = {
      version: 1,
      analytics: nextAnalytics,
      marketing: nextMarketing,
      decidedAt: new Date().toISOString(),
    };
    writePreferences(next);
    setPreferences(next);
    setShowBanner(false);
    setSettingsOpen(false);
  };

  const openSettings = () => {
    setAnalytics(preferences?.analytics ?? false);
    setMarketing(preferences?.marketing ?? false);
    setSettingsOpen(true);
    setShowBanner(false);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
    setShowBanner(preferences === null);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.aside
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
            aria-label={t.settings}
            className="fixed inset-x-3 bottom-3 z-[220] mx-auto max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/15 bg-brand-navy/95 text-white shadow-[0_24px_80px_rgba(0,31,63,0.38)] backdrop-blur-2xl sm:inset-x-6 sm:bottom-6"
          >
            <div className="h-1 bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-gold" />
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
              <div className="flex gap-4 text-left">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/15 text-brand-cyan sm:flex">
                  <Cookie className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-brand-cyan">{t.eyebrow}</p>
                  <h2 className="font-display text-xl font-black tracking-tight sm:text-2xl">{t.title}</h2>
                  <p className="mt-2 max-w-2xl text-xs leading-relaxed text-white/70 sm:text-sm">{t.summary}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-w-[470px]">
                <button onClick={() => save(false, false)} className="min-h-12 rounded-xl border border-white/25 px-3 text-[10px] font-black uppercase tracking-wider text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35 sm:text-xs">
                  {t.necessaryOnly}
                </button>
                <button onClick={openSettings} className="min-h-12 rounded-xl border border-white/15 px-3 text-[10px] font-black uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35 sm:text-xs">
                  {t.settings}
                </button>
                <button onClick={() => save(true, true)} className="col-span-2 min-h-12 rounded-xl bg-brand-cyan px-3 text-[10px] font-black uppercase tracking-wider text-brand-navy transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:col-span-1 sm:text-xs">
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[260] flex items-end justify-center bg-brand-navy/45 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          >
            <motion.section
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
              className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-brand-navy/10 bg-white shadow-[0_30px_100px_rgba(0,31,63,0.35)]"
            >
              <header className="z-10 flex shrink-0 items-start justify-between gap-4 border-b border-brand-navy/8 bg-white px-5 py-5 sm:px-7">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-brand-blue">{t.eyebrow}</p>
                  <h2 id="cookie-settings-title" className="font-display text-2xl font-black text-brand-navy sm:text-3xl">{t.settingsTitle}</h2>
                </div>
                <button ref={closeButtonRef} onClick={closeSettings} aria-label={t.close} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gray text-brand-navy transition-colors hover:bg-brand-navy hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35">
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </header>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
                <p className="text-sm leading-relaxed text-brand-navy/65">{t.settingsIntro}</p>

                <div className="space-y-3">
                  <div className="flex items-start gap-4 rounded-2xl border border-brand-navy/8 bg-brand-gray/55 p-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><ShieldCheck className="h-5 w-5" aria-hidden="true" /></div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-black text-brand-navy">{t.necessary}</h3><span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-800">{t.alwaysOn}</span></div>
                      <p className="mt-1 text-xs leading-relaxed text-brand-navy/60">{t.necessaryDescription}</p>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-brand-navy/8 p-4 transition-colors hover:border-brand-cyan/55">
                    <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-brand-blue" />
                    <span className="flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="font-black text-brand-navy">{t.analytics}</span><span className="text-[9px] font-black uppercase tracking-wider text-brand-navy/45">{t.optional}</span></span><span className="mt-1 block text-xs leading-relaxed text-brand-navy/60">{t.analyticsDescription}</span></span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-brand-navy/8 p-4 transition-colors hover:border-brand-cyan/55">
                    <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-brand-blue" />
                    <span className="flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="font-black text-brand-navy">{t.marketing}</span><span className="text-[9px] font-black uppercase tracking-wider text-brand-navy/45">{t.optional}</span></span><span className="mt-1 block text-xs leading-relaxed text-brand-navy/60">{t.marketingDescription}</span></span>
                  </label>
                </div>

                <div className="rounded-2xl bg-brand-navy p-4 text-white sm:p-5">
                  <div className="mb-3 flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-brand-cyan" aria-hidden="true" /><h3 className="text-xs font-black uppercase tracking-widest">{t.currentUse}</h3></div>
                  <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-xs">
                    <dt className="text-white/55">{t.cookieName}</dt><dd className="break-all text-right font-mono text-[10px]">{COOKIE_NAME}</dd>
                    <dt className="text-white/55">{t.cookiePurpose}</dt><dd className="text-right">{t.preferencePurpose}</dd>
                    <dt className="text-white/55">{t.cookieDuration}</dt><dd className="text-right">{t.sixMonths}</dd>
                  </dl>
                  <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/60">{t.providerNote}</p>
                </div>

              </div>

              <footer className="grid shrink-0 gap-2 border-t border-brand-navy/8 bg-white px-5 py-4 sm:grid-cols-2 sm:px-7">
                <button onClick={() => save(false, false)} className="min-h-12 rounded-xl border border-brand-navy/20 px-4 text-xs font-black uppercase tracking-wider text-brand-navy transition-colors hover:bg-brand-gray focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35">{t.necessaryOnly}</button>
                <button onClick={() => save(analytics, marketing)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/35"><Check className="h-4 w-4" aria-hidden="true" />{t.save}</button>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
