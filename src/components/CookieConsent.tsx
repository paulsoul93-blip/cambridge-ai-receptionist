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
    eyebrow: 'Privacy, by design',
    title: 'Your choice. No surprises.',
    summary: 'We use one essential cookie to remember this choice. Optional cookies remain off unless you allow them.',
    necessaryOnly: 'Essential only',
    acceptAll: 'Allow optional',
    settings: 'Customise',
    settingsTitle: 'Privacy controls',
    settingsIntro: 'Optional categories are off by default. You can revisit this panel at any time from the footer.',
    necessary: 'Essential',
    necessaryDescription: 'Remembers your privacy choice and keeps the website working as expected.',
    alwaysOn: 'Always on',
    analytics: 'Analytics',
    analyticsDescription: 'Would help us understand anonymous website usage. No analytics service is currently active.',
    marketing: 'Marketing',
    marketingDescription: 'Would support advertising measurement. No marketing service is currently active.',
    optional: 'Optional',
    currentUse: 'Stored on this device',
    cookieName: 'Cookie',
    cookiePurpose: 'Purpose',
    cookieDuration: 'Duration',
    preferencePurpose: 'Remembers your choice',
    sixMonths: '6 months',
    providerNote: 'The live voice demo asks separately for microphone access and does not start because of this choice.',
    save: 'Save choices',
    close: 'Close privacy controls',
  },
  pl: {
    eyebrow: 'Prywatność w standardzie',
    title: 'Twój wybór. Bez niespodzianek.',
    summary: 'Używamy jednego niezbędnego cookie, aby zapamiętać ten wybór. Opcjonalne cookies pozostają wyłączone, dopóki ich nie zaakceptujesz.',
    necessaryOnly: 'Tylko niezbędne',
    acceptAll: 'Zezwól na opcjonalne',
    settings: 'Dostosuj',
    settingsTitle: 'Kontrola prywatności',
    settingsIntro: 'Kategorie opcjonalne są domyślnie wyłączone. Do tych ustawień możesz wrócić w dowolnej chwili ze stopki.',
    necessary: 'Niezbędne',
    necessaryDescription: 'Zapamiętuje wybór prywatności i zapewnia prawidłowe działanie strony.',
    alwaysOn: 'Zawsze aktywne',
    analytics: 'Analityczne',
    analyticsDescription: 'Pomogłyby anonimowo mierzyć korzystanie ze strony. Obecnie żadna usługa analityczna nie jest aktywna.',
    marketing: 'Marketingowe',
    marketingDescription: 'Służyłyby do pomiaru reklam. Obecnie żadna usługa marketingowa nie jest aktywna.',
    optional: 'Opcjonalne',
    currentUse: 'Zapisane na tym urządzeniu',
    cookieName: 'Cookie',
    cookiePurpose: 'Cel',
    cookieDuration: 'Okres',
    preferencePurpose: 'Zapamiętuje Twój wybór',
    sixMonths: '6 miesięcy',
    providerNote: 'Demo głosowe osobno prosi o dostęp do mikrofonu i nie uruchamia się na podstawie tego wyboru.',
    save: 'Zapisz wybór',
    close: 'Zamknij kontrolę prywatności',
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
  const [voicePanelOpen, setVoicePanelOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => setShowBanner(preferences === null), [preferences]);

  useEffect(() => {
    const openSettings = () => {
      const saved = readPreferences();
      setAnalytics(saved?.analytics ?? false);
      setMarketing(saved?.marketing ?? false);
      setSettingsOpen(true);
      setShowBanner(false);
    };
    const closeForVoicePanel = () => {
      setVoicePanelOpen(true);
      setSettingsOpen(false);
      setShowBanner(preferences === null);
    };
    const restoreAfterVoicePanel = () => setVoicePanelOpen(false);
    window.addEventListener('open-cookie-settings', openSettings);
    window.addEventListener('voice-panel-opened', closeForVoicePanel);
    window.addEventListener('voice-panel-closed', restoreAfterVoicePanel);
    return () => {
      window.removeEventListener('open-cookie-settings', openSettings);
      window.removeEventListener('voice-panel-opened', closeForVoicePanel);
      window.removeEventListener('voice-panel-closed', restoreAfterVoicePanel);
    };
  }, [preferences]);

  useEffect(() => {
    if (!settingsOpen) return;
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSettingsOpen(false);
        setShowBanner(preferences === null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
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
    <AnimatePresence>
      {showBanner && !settingsOpen && !voicePanelOpen && (
        <motion.aside
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
          aria-label={t.settings}
          className="cookie-surface fixed inset-x-3 bottom-3 z-[220] overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/82 text-brand-navy shadow-[0_20px_55px_rgba(0,31,63,0.18)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[420px]"
        >
          <div className="h-px bg-gradient-to-r from-brand-blue via-brand-cyan to-transparent" />
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-blue/10 bg-brand-navy text-brand-cyan shadow-sm">
                <Cookie className="h-[18px] w-[18px]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-brand-blue">{t.eyebrow}</p>
                <h2 className="mt-1 font-display text-[17px] font-black tracking-[-0.025em]">{t.title}</h2>
                <p className="mt-1.5 text-[11px] leading-[1.55] text-brand-navy/62 sm:text-xs">{t.summary}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => save(false, false)} className="min-h-11 rounded-xl border border-brand-navy/14 bg-white/65 px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:border-brand-blue/35 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/25 sm:text-[11px]">
                {t.necessaryOnly}
              </button>
              <button onClick={() => save(true, true)} className="min-h-11 rounded-xl bg-brand-navy px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_8px_20px_rgba(0,31,63,0.16)] transition-colors hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/30 sm:text-[11px]">
                {t.acceptAll}
              </button>
            </div>
            <button onClick={openSettings} className="mt-2.5 w-full rounded-lg py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-brand-navy/52 transition-colors hover:text-brand-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/30">
              {t.settings}
            </button>
          </div>
        </motion.aside>
      )}

      {settingsOpen && !voicePanelOpen && (
        <motion.section
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.985 }}
          role="dialog"
          aria-labelledby="cookie-settings-title"
          className="cookie-surface fixed inset-x-3 bottom-3 z-[260] flex max-h-[min(72dvh,620px)] flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/88 text-brand-navy shadow-[0_24px_70px_rgba(0,31,63,0.22)] backdrop-blur-xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[430px]"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-brand-navy/7 bg-white/55 px-4 py-4 sm:px-5">
            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-brand-blue">{t.eyebrow}</p>
              <h2 id="cookie-settings-title" className="mt-1 font-display text-xl font-black tracking-[-0.03em]">{t.settingsTitle}</h2>
            </div>
            <button ref={closeButtonRef} onClick={closeSettings} aria-label={t.close} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-navy/8 bg-white/65 transition-colors hover:bg-brand-navy hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/25">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
            <p className="text-xs leading-relaxed text-brand-navy/60">{t.settingsIntro}</p>

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-700/10 bg-emerald-50/70 p-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700"><ShieldCheck className="h-4 w-4" aria-hidden="true" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-extrabold">{t.necessary}</h3><span className="text-[8px] font-black uppercase tracking-wider text-emerald-800">{t.alwaysOn}</span></div>
                <p className="mt-1 text-[11px] leading-relaxed text-brand-navy/58">{t.necessaryDescription}</p>
              </div>
            </div>

            {([
              ['analytics', analytics, setAnalytics, t.analytics, t.analyticsDescription],
              ['marketing', marketing, setMarketing, t.marketing, t.marketingDescription],
            ] as const).map(([id, checked, setter, label, description]) => (
              <label key={id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-brand-navy/8 bg-white/45 p-3.5 transition-colors hover:border-brand-cyan/55">
                <input type="checkbox" checked={checked} onChange={(event) => setter(event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-brand-blue" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2"><span className="text-sm font-extrabold">{label}</span><span className="text-[8px] font-black uppercase tracking-wider text-brand-navy/42">{t.optional}</span></span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-brand-navy/58">{description}</span>
                </span>
              </label>
            ))}

            <div className="rounded-2xl bg-brand-navy p-3.5 text-white">
              <div className="mb-2.5 flex items-center gap-2"><SlidersHorizontal className="h-3.5 w-3.5 text-brand-cyan" aria-hidden="true" /><h3 className="text-[9px] font-black uppercase tracking-[0.16em]">{t.currentUse}</h3></div>
              <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 text-[10px]">
                <dt className="text-white/50">{t.cookieName}</dt><dd className="break-all text-right font-mono text-[9px]">{COOKIE_NAME}</dd>
                <dt className="text-white/50">{t.cookiePurpose}</dt><dd className="text-right">{t.preferencePurpose}</dd>
                <dt className="text-white/50">{t.cookieDuration}</dt><dd className="text-right">{t.sixMonths}</dd>
              </dl>
              <p className="mt-3 border-t border-white/10 pt-2.5 text-[10px] leading-relaxed text-white/55">{t.providerNote}</p>
            </div>
          </div>

          <footer className="grid shrink-0 grid-cols-2 gap-2 border-t border-brand-navy/7 bg-white/65 px-4 py-3.5 sm:px-5">
            <button onClick={() => save(false, false)} className="min-h-11 rounded-xl border border-brand-navy/14 px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/25">{t.necessaryOnly}</button>
            <button onClick={() => save(analytics, marketing)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-3 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white transition-colors hover:bg-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/30"><Check className="h-3.5 w-3.5" aria-hidden="true" />{t.save}</button>
          </footer>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
