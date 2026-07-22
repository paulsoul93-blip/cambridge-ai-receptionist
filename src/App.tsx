/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'motion/react';
import { 
  Phone,
  Zap, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  Menu,
  X,
  Activity,
  Play,
  Linkedin,
  Twitter
} from 'lucide-react';
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { CookieConsent } from './components/CookieConsent';
import { VoiceReceptionist } from './components/VoiceReceptionist';

export type Lang = 'en' | 'pl';
export const LangContext = createContext<{lang: Lang; setLang: (l: Lang) => void}>({ lang: 'en', setLang: () => {} });
export const useLang = () => useContext(LangContext);

export const contentDict = {
  en: {
    nav: {
      solutions: 'Solutions', features: 'Features', process: 'Process', about: 'About', contact: 'Contact', getStarted: 'Get Started'
    },
    hero: {
      tag: "The Perfect Employee",
      title1: "Your Phone Rings.",
      title2: "We Answer.",
      title3: "You Grow.",
      desc: "An AI Receptionist that literally books jobs while you sleep. Perfect for local services, clinics, and ambitious businesses that want to focus on the real work.",
      btn1: "Book Your Free Demo",
      btn2: "Watch Film",
      stat1: "Latency",
      stat2: "Intelligence",
      stat2sub: "Languages",
      chatState: "Online & Ready",
      chatDesc: "Test our AI in English"
    },
    prob: {
      title: "Stop Dropping What You're Doing",
      desc: "You're a professional. You shouldn't have to put down your tools or excuse yourself from a meeting just to book a client. Let the AI do the heavy lifting.",
      box1Title: "Without AI",
      box1Sub: "The Stressful Way",
      box1Lbl1: "Focus", box1Val1: "Constant interruptions",
      box1Lbl2: "Bookings", box1Val2: "Lost when you don't pick up",
      box1Lbl3: "Time Off", box1Val3: "Customers get angry when closed",
      box1Lbl4: "Cost", box1Val4: "Losing £500+ jobs to voicemail",
      box2Title: "With AI Receptionist",
      box2Sub: "Total Peace of Mind",
      box2Lbl1: "Focus", box2Val1: "You do the real work",
      box2Lbl2: "Bookings", box2Val2: "Done automatically, instantly",
      box2Lbl3: "Time Off", box2Val3: "AI books jobs while you sleep",
      box2Lbl4: "Cost", box2Val4: "Pays for itself with 1 job",
    },
    who: {
      tag: "Who Is This For?",
      title1: "Built for businesses",
      title2: "that hustle.",
      desc: "Our AI understands your specific trade. It talks to your customers exactly how you want it to.",
      c1t: "Home Services", c1d: "Plumbers, Electricians, Handymen", c1tt1: "Emergency Calls", c1tt2: "On-the-go Booking",
      c2t: "Beauty & Wellness", c2d: "Salons, Barbers, Med-Spas", c2tt1: "Fills Empty Slots", c2tt2: "Zero Interruptions",
      c3t: "Health & Clinics", c3d: "Dentists, Therapists, Private Practices", c3tt1: "Friendly Tone", c3tt2: "Instant Relief",
      c4t: "Local Business", c4d: "Garages, Real Estate, Retail", c4tt1: "Answers FAQs", c4tt2: "Always Open"
    },
    feat: {
      tag: "How It Helps You",
      title1: "It's like having your own assistant who never asks for a day off.",
      desc: "Designed for handymen, beauty salons, clinics, and any business that makes money through the phone.",
      f1t: "Books Appointments 24/7", f1d: "If someone calls at 11 PM or while you're busy fixing a boiler, the AI answers, checks your real calendar, and books them in.",
      f2t: "Answers Common Questions", f2d: "\"How much do you charge?\" \"Where are you located?\" The AI knows your business inside-out and gives perfect answers every time.",
      f3t: "Transfers Important Calls", f3d: "If it's an absolute emergency or a VIP client, the AI is smart enough to transfer the call straight to your mobile number.",
      f4t: "Follows Up via Text", f4d: "After the call ends, it automatically texts the customer a booking confirmation or a link to your website. Pure magic.",
      f5t: "Speaks Any Language", f5d: "It detects if a caller speaks Polish, Spanish, or Romanian and smoothly switches languages to ensure you never lose a client.",
      f6t: "Protects You from Spam", f6d: "Tired of marketing calls? The AI politely handles them and hangs up, ensuring your phone only buzzes for paying customers."
    },
    proc: {
      tag: "How We Set It Up",
      title1: "Four Simple Steps",
      s1t: "We Learn Your Business", s1d: "Tell us exactly how you want the phone answered, your pricing, and your rules.",
      s2t: "We Build It For You", s2d: "We link the AI to your existing calendar or booking system and give it a friendly, natural voice.",
      s3t: "You Test It Out", s3d: "You call the AI, pretend to be a difficult customer, and see how perfectly it handles it.",
      s4t: "Go Live & Relax", s4d: "Turn it on. It starts answering every missed call, taking messages, and booking jobs."
    },
    price: {
      tag: "Investment",
      title1: "One job booked.",
      title2: "Pays for itself.",
      desc: "Why lose an £800 plumbing job because you couldn't pick up the phone?",
      b1Title: "Starter", b1Sub: "For solo professionals", b1P: "£120", b1M: "mo", b1F: ["150 Minutes included", "Standard Voice", "Business hours only", "1 Calendar Integration"],
      b2Title: "Pro", b2Sub: "For busy local businesses", b2P: "£290", b2M: "mo", b2F: ["500 Minutes included", "Premium Cloned Voice", "24/7/365 Answering", "SMS Follow-ups", "Multi-Calendar Sync"],
      b3Title: "Enterprise", b3Sub: "For clinics & full agencies", b3P: "Custom", b3M: "", b3F: ["Unlimited Minutes", "Custom Logic Trees", "API Webhooks & CRM Sync", "Dedicated Account Manager"],
      mostPop: "Most Popular",
      bookBtn: "Book Demo First"
    },
    abt: {
      tag: "The Builder",
      title1: "Pawel Dusza",
      p1: "Hey there — I'm a local software builder who got tired of seeing great small businesses lose out on jobs simply because they were too busy to answer the phone.",
      p2: "Whether you're fixing a pipe, with a client at the salon, or driving the van, you shouldn't be penalized for doing your actual work. I realized AI receptionists are no longer a sci-fi concept—they're the perfect tool for local businesses.",
      p3: "That's why I started this. I build these assistants specifically for business owners who want to grow, without burning out.",
      btn: "Contact Pawel"
    },
    cta: {
      title1: "Stop Missing.",
      title2: "Start Booking.",
      desc: "Find out exactly how much time and money an AI receptionist will save your specific business.",
      btn1: "Book a Free Demo",
      btn2: "Call The AI Now"
    },
    bot: {
      title: "AI Concierge",
      status: "Active Now",
      placeholder: "Type a message...",
      listening: "Listening...",
      hub: "Connected to Cambridge Voice Hub",
      hub2: "(Retell AI enabled)"
    },
    foot: {
      tag: "Ready to automate your calls?",
      btn: "Book a Demo"
    }
  },
  pl: {
    nav: {
      solutions: 'Rozwiązania', features: 'Funkcje', process: 'Jak to działa', about: 'O twórcy', contact: 'Kontakt', getStarted: 'Zacznij'
    },
    hero: {
      tag: "Twój Nowy Pracownik",
      title1: "Telefon dzwoni.",
      title2: "My odbieramy.",
      title3: "Twój biznes rośnie.",
      desc: "Recepcjonistka AI, która obsługuje klientów i umawia wizyty, nawet gdy Ty śpisz. Stworzona dla usług lokalnych, klinik i ambitnych przedsiębiorców, którzy cenią swój czas.",
      btn1: "Odbierz Darmowe Demo",
      btn2: "Zobacz w Akcji",
      stat1: "Czas Reakcji",
      stat2: "Baza Językowa",
      stat2sub: "Języków",
      chatState: "Online i Gotowa",
      chatDesc: "Przetestuj na żywo"
    },
    prob: {
      title: "Przestań tracić czas na telefony",
      desc: "Jesteś profesjonalistą. Nie powinieneś przerywać pracy ani spotkań tylko po to, by odebrać telefon. Zostaw to naszej sztucznej inteligencji.",
      box1Title: "Bez AI",
      box1Sub: "Ciągły stres i marnowany czas",
      box1Lbl1: "Skupienie", box1Val1: "Ciągłe odrywanie od pracy",
      box1Lbl2: "Rezerwacje", box1Val2: "Tracisz klientów, gdy nie odbierasz",
      box1Lbl3: "Po godzinach", box1Val3: "Klienci odchodzą do konkurencji",
      box1Lbl4: "Koszty", box1Val4: "Przepadają zlecenia za tysiące złotych",
      box2Title: "Z asystentem AI",
      box2Sub: "Pełna kontrola i święty spokój",
      box2Lbl1: "Skupienie", box2Val1: "Robisz to, w czym jesteś najlepszy",
      box2Lbl2: "Rezerwacje", box2Val2: "Automatycznie i natychmiastowo",
      box2Lbl3: "Po godzinach", box2Val3: "AI umawia spotkania 24/7",
      box2Lbl4: "Koszty", box2Val4: "Zwraca się po 1 zleceniu"
    },
    who: {
      tag: "Dla kogo to tworzymy?",
      title1: "Dla firm, które",
      title2: "chcą rosnąć szybciej.",
      desc: "Nasze AI doskonale rozumie specyfikę Twojej branży i rozmawia z klientami dokładnie w takim tonie, jakiego oczekujesz.",
      c1t: "Usługi Fachowe", c1d: "Hydraulicy, Elektrycy, Wykończenia", c1tt1: "Praca w Terenie", c1tt2: "Zgłoszenia Awarii",
      c2t: "Uroda i Wellness", c2d: "Salony Kosmetyczne, Fryzjerzy, Spa", c2tt1: "Zapełnia Luki", c2tt2: "Zero Przeszkód",
      c3t: "Medycyna", c3d: "Dentyści, Terapeuci, Kliniki", c3tt1: "Ciepły Ton", c3tt2: "Błyskawiczna Pomoc",
      c4t: "Biznes Lokalny", c4d: "Warsztaty, Sklepy, Wynajem", c4tt1: "FAQ na bieżąco", c4tt2: "Czynne 24/7"
    },
    feat: {
      tag: "Jak to działa w praktyce",
      title1: "Twój prywatny asystent, który nigdy nie idzie na urlop.",
      desc: "Rozwiązanie skrojone na miarę dla usługodawców, gdzie każdy nieodebrany telefon to strata pieniędzy.",
      f1t: "Pracuje 24/7", f1d: "Klient dzwoni o północy? Albo gdy właśnie naprawiasz piec? AI dobierze z nim termin i zapisze bezpośrednio w Twoim kalendarzu.",
      f2t: "Odpowiada na pytania", f2d: "„Ile to potrwa?” „Gdzie przyjmujecie?” Asystent zna Twoją ofertę od podszewki i zawsze udziela trafnych, naturalnych odpowiedzi.",
      f3t: "Przełącza ważne rozmowy", f3d: "Gdy dzwoni VIP albo sytuacja jest awaryjna, sztuczna inteligencja inteligentnie przełączy rozmowę na Twój prywatny numer.",
      f4t: "Wysyła SMSy", f4d: "Po zakończeniu rozmowy system automatycznie wyśle klientowi SMS z potwierdzeniem rezerwacji lub linkiem do cennika.",
      f5t: "Bariera językowa znika", f5d: "Asystent natychmiast wykrywa język klienta i płynnie przechodzi na angielski, polski czy hiszpański. Nie stracisz już żadnego zlecenia.",
      f6t: "Ochrona przed spamem", f6d: "Masz dość telemarketerów? AI uprzejmie informuje, że nie jesteście zainteresowani i kończy połączenie."
    },
    proc: {
      tag: "Twój Start",
      title1: "Cztery kroki do wdrożenia",
      s1t: "Poznajemy Twój Biznes", s1d: "Ustalamy ofertę, zasady działania i jak dokładnie asystent ma witać Twoich klientów.",
      s2t: "Uczymy Sztuczną Inteligencję", s2d: "Integrujemy system z Twoim obecnym kalendarzem i dobieramy idealnie brzmiący, ludzki głos.",
      s3t: "Testujesz Bez Zobowiązań", s3d: "Dzwonisz do swojego nowego pracownika z trudnymi pytaniami, dopóki nie będziesz pewny w 100%.",
      s4t: "Odpalamy Do Pracy", s4d: "Asystent przejmuje wszystkie telefony (lub tylko te, których nie odbierzesz) i zaczyna generować zysk."
    },
    price: {
      tag: "Inwestycja z natychmiastowym zwrotem",
      title1: "Jeden uratowany klient",
      title2: "spłaca subskrypcję.",
      desc: "Zastanów się: tracisz zlecenie wyceniane na dziesiątki tysięcy, tylko dlatego że byłeś zajęty...",
      b1Title: "Start", b1Sub: "Dla samodzielnych specjalistów", b1P: "599zł", b1M: "msc", b1F: ["150 minut rozmów", "Profesjonalny głos z bazy", "Praca w wyznaczonych godzinach", "Integracja z głównym kalendarzem"],
      b2Title: "Pro", b2Sub: "Dla rozwijających się firm", b2P: "1399zł", b2M: "msc", b2F: ["500 minut rozmów", "Zaawansowane klonowanie głosu AI", "Obsługa połączeń 24/7/365", "Automatyczne SMS do klienta", "Obsługa wielu kalendarzy pracowniczych"],
      b3Title: "Enterprise", b3Sub: "Dla klinik i agencji", b3P: "Indywidualnie", b3M: "", b3F: ["Brak limitu minut", "Rozbudowana architektura procesów", "Integracje przez API / systemy CRM", "Osobisty menedżer wdrożenia"],
      mostPop: "Wybór Większości",
      bookBtn: "Porozmawiajmy o wycenie"
    },
    abt: {
      tag: "Poznaj Twórcę",
      title1: "Paweł Dusza",
      p1: "Cześć – jestem niezależnym programistą. Od dawna widziałem problem - świetni fachowcy tracą zyski, starając się nadążyć za wyrywającym z pracy dzwonkiem telefonu.",
      p2: "Zrozumiałem, że podczas trudnej fizycznej pracy, czy skupienia w trakcie zabiegu u klienta, tradycyjny odbiór połączeń to blokada. Ale w pełni inteligentna asystentka głosowa rozwiązuje ten problem natychmiastowo.",
      p3: "Tworzę te systemy, abyś mógł robić to, co lubisz najlepiej, mając pewność że Twój nowy 'inteligentny pracownik' zawsze perfekcyjnie dogaduje terminy na zapleczu.",
      btn: "Napisz do Pawła"
    },
    cta: {
      title1: "Przestań tracić.",
      title2: "Zacznij zarabiać.",
      desc: "Przekonaj się sam, jak dużo czasu i pieniędzy potrafi zaoszczędzić poprawnie wdrożona asystentka głosowa.",
      btn1: "Zarezerwuj Wstępną Rozmowę",
      btn2: "Przetestuj Głos Asystentki",
    },
    bot: {
      title: "Twój Doradca AI",
      status: "Dostępny i Aktywny",
      placeholder: "Chcesz o coś zapytać?...",
      listening: "Słucham...",
      hub: "Połączono za pomocą",
      hub2: "(Infrastruktura Cambridge AI)"
    },
    foot: {
      tag: "Przenieś swój biznes na wyższy poziom",
      btn: "Odbierz swoje rozwiązanie"
    }
  }
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(1);
  const [stage, setStage] = useState<'logo' | 'loading'>('logo');

  useEffect(() => {
    if (stage === 'logo') {
      const t = setTimeout(() => {
        setStage('loading');
      }, 3500);
      return () => clearTimeout(t);
    }

    if (stage === 'loading') {
      let current = 1;
      const interval = setInterval(() => {
        // Slow down progress: smaller increments and larger interval
        current += Math.floor(Math.random() * 3) + 1;
        if (current >= 100) {
          current = 100;
          clearInterval(interval);
          setTimeout(onComplete, 1200); 
        }
        setProgress(current);
      }, 70);
      return () => clearInterval(interval);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-brand-navy flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Intense High Tech Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
        className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" 
      />
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] border-[1px] border-white/5 rounded-full blur-[2px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[60vw] h-[60vw] border-[1px] border-brand-cyan/20 rounded-full blur-[2px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <AnimatePresence mode="wait">
        {stage === 'logo' && (
          <motion.div
            key="logo-stage"
            initial={{ opacity: 0, scale: 0.8, y: 50, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', y: -20 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center relative z-10"
          >
            <LogoMark className="w-48 h-48 mb-8" />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-3xl md:text-5xl font-display font-black tracking-tight text-brand-cyan uppercase drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]"
            >
              Cambridge AI
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 text-sm md:text-base font-bold uppercase tracking-[0.5em] text-white/50"
            >
              Intelligent Voice Solutions
            </motion.p>
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div
            key="loading-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center relative z-10 w-full"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 20 }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16 text-center max-w-5xl px-6 relative z-10"
            >
              <h1 className="text-4xl md:text-6xl lg:text-[90px] font-display font-black leading-[0.85] tracking-tighter text-white mb-8">
                Let me try make your<br/> business <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">easier for u</span>.
              </h1>
              <div className="flex items-center justify-center gap-4">
                 <div className="w-12 h-[1px] bg-brand-cyan" />
                 <p className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-brand-cyan/80">
                   Smart AI Front Desk Receptionist by <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Pawel Dusza</span>
                 </p>
                 <div className="w-12 h-[1px] bg-brand-cyan" />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative z-10 flex flex-col items-center mt-4"
            >
              <div className="text-7xl md:text-[140px] font-display font-black tracking-tighter text-brand-cyan/20 leading-none">
                {progress}%
              </div>
              <div className="w-64 md:w-96 h-1 bg-white/10 rounded-full overflow-hidden mt-8">
                <motion.div 
                  className="h-full bg-brand-cyan rounded-full shadow-[0_0_15px_rgba(0,212,255,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LanguageSelector = ({ onSelect }: { onSelect: (l: Lang) => void }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-brand-navy flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] border-[1px] border-white/5 rounded-full blur-[2px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] border-[1px] border-brand-cyan/10 rounded-full blur-[2px] opacity-20 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center mb-16"
      >
        <LogoMark className="w-24 h-24 md:w-32 md:h-32 mb-6" />
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-white uppercase mb-4 text-center">
          Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">System</span>
        </h1>
        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-white/50 text-center">
          Select Your Region
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('en')}
          className="relative p-8 md:p-14 glass overflow-hidden transition-all border border-brand-navy/20 hover:border-brand-cyan/50 rounded-[32px] group flex flex-col items-center bg-white/5"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <span className="text-5xl md:text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">🇬🇧</span>
           <span className="text-xl md:text-2xl font-black text-white tracking-widest uppercase mb-2 relative z-10 group-hover:text-brand-cyan transition-colors">English</span>
           <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] relative z-10">Continue in English</span>
           {/* Tech accents */}
           <div className="absolute top-4 left-4 w-2 h-2 rounded-full border border-brand-cyan/30 flex items-center justify-center"><div className="w-1 h-1 bg-brand-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
           <div className="absolute bottom-4 right-4 w-8 h-[1px] bg-brand-cyan/30" />
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('pl')}
          className="relative p-8 md:p-14 glass overflow-hidden transition-all border border-brand-navy/20 hover:border-white/50 rounded-[32px] group flex flex-col items-center bg-white/5"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <span className="text-5xl md:text-6xl mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">🇵🇱</span>
           <span className="text-xl md:text-2xl font-black text-white tracking-widest uppercase mb-2 relative z-10 group-hover:text-white/80 transition-colors">Polski</span>
           <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] relative z-10">Kontynuuj po polsku</span>
           {/* Tech accents */}
           <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-white/30 flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /></div>
           <div className="absolute bottom-4 left-4 w-8 h-[1px] bg-white/30" />
        </motion.button>
      </motion.div>
    </div>
  );
};

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener('resize', handleResize);

    // 3D Neural Network parameters
    let particles: { originalX: number, originalY: number, originalZ: number, radius: number, randomOffset: number }[] = [];
    
    const initParticles = () => {
      particles = [];
      const numParticles = Math.min(Math.floor((w * h) / 30000), 64); // Keep the ambient field light enough for smooth scrolling
      
      for (let i = 0; i < numParticles; i++) {
        // Distribute in a wide 3D space
        const x = (Math.random() - 0.5) * w * 1.5;
        const y = (Math.random() - 0.5) * h * 1.5;
        const z = (Math.random() - 0.5) * 1500;
        
        particles.push({ 
          originalX: x, 
          originalY: y, 
          originalZ: z, 
          radius: Math.random() * 1.5 + 0.5,
          randomOffset: Math.random() * Math.PI * 2
        });
      }
    };

    initParticles();

    let angleX = 0;
    let angleY = 0;

    let lastFrame = 0;
    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden || timestamp - lastFrame < 40) return;
      lastFrame = timestamp;
      ctx.clearRect(0, 0, w, h);
      
      // Extremely slow, elegant rotation
      angleX += 0.0002;
      angleY += 0.0004;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Project 3D to 2D
      const projected: { x: number, y: number, z: number, r: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Add subtle organic "breathing" movement
        const time = Date.now() * 0.0005;
        const waveX = Math.sin(time + p.randomOffset) * 15;
        const waveY = Math.cos(time + p.randomOffset) * 15;
        
        const px = p.originalX + waveX;
        const py = p.originalY + waveY;
        const pz = p.originalZ;

        // Rotate Y
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;

        // Rotate X
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        // Perspective projection
        const fov = 1000;
        const scale = fov / (fov + z2);
        
        // Prevent drawing things behind the camera too closely
        if (z2 < -800) continue;

        const x2D = (w / 2) + x1 * scale;
        const y2D = (h / 2) + y2 * scale;

        projected.push({ x: x2D, y: y2D, z: z2, r: p.radius * scale });
      }

      // Draw connections (neural links)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Only connect nearby nodes to form the constellation
          if (dist < 120) {
            const zAvg = (projected[i].z + projected[j].z) / 2;
            // Fade based on depth (z) and distance between nodes
            const depthAlpha = Math.max(0, 1 - (zAvg + 500) / 1500); 
            const distAlpha = 1 - dist / 120;
            const lineAlpha = Math.min(0.2, depthAlpha * distAlpha * 0.3); // max opacity 0.2 to stay minimalist

            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            // Elegant brand blue/cyan mix for the lines
            ctx.strokeStyle = `rgba(0, 102, 255, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw nodes (particles)
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.r > 0) {
          const alpha = Math.max(0.05, 1 - (p.z + 500) / 1500) * 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.fill();
        }
      }

    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-15] pointer-events-none overflow-hidden bg-white/50">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#001F3F 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full mix-blend-multiply opacity-80" />
      <div className="absolute -top-[35%] -left-[30%] h-[90vw] w-[90vw] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.055)_0%,transparent_58%)] mix-blend-multiply" />
      <div className="absolute -bottom-[35%] -right-[30%] h-[90vw] w-[90vw] bg-[radial-gradient(ellipse_at_center,rgba(0,102,255,0.045)_0%,transparent_58%)] mix-blend-multiply" />
    </div>
  );
};

const LogoMark = ({ className = "w-12 h-12" }: { className?: string }) => (
  <div className={`relative ${className} flex items-center justify-center group mix-blend-screen`}>
    <motion.div 
      animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.3, 0.6, 0.3] }} 
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }} 
      className="absolute inset-0 bg-brand-cyan/40 blur-[15px] rounded-full" 
    />
    
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10" fill="none">
      <defs>
        <linearGradient id="logo-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0066FF" />
        </linearGradient>
        <linearGradient id="logo-secondary" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#00D4FF" opacity="0.5" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur stdDeviation="3" result="blur" />
           <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbit 1 */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 15, ease: "linear", repeat: Infinity }} className="origin-center">
         <ellipse cx="50" cy="50" rx="42" ry="18" stroke="rgba(0,212,255,0.15)" strokeWidth="1" transform="rotate(30 50 50)" />
         <motion.ellipse 
           cx="50" cy="50" rx="42" ry="18" 
           stroke="url(#logo-primary)" 
           strokeWidth="2" 
           strokeDasharray="50 180" 
           strokeLinecap="round" 
           transform="rotate(30 50 50)" 
         />
      </motion.g>

      {/* Orbit 2 */}
      <motion.g animate={{ rotate: -360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }} className="origin-center">
         <ellipse cx="50" cy="50" rx="38" ry="15" stroke="rgba(255,255,255,0.1)" strokeWidth="1" transform="rotate(-60 50 50)" />
         <motion.ellipse 
           cx="50" cy="50" rx="38" ry="15" 
           stroke="url(#logo-secondary)" 
           strokeWidth="2.5" 
           strokeDasharray="40 150" 
           strokeLinecap="round" 
           transform="rotate(-60 50 50)" 
         />
      </motion.g>
      
      {/* Outer Ring */}
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 25, ease: "linear", repeat: Infinity }} className="origin-center">
         <circle cx="50" cy="50" r="46" stroke="rgba(0,212,255,0.05)" strokeWidth="1" />
         <motion.circle 
           cx="50" cy="50" r="46" 
           stroke="url(#logo-primary)" 
           strokeWidth="1.5" 
           strokeDasharray="20 280" 
           strokeLinecap="round" 
         />
      </motion.g>

      {/* Center Intelligence & Voice Core */}
      <g filter="url(#logo-glow)">
        <circle cx="50" cy="50" r="10" fill="url(#logo-primary)" opacity="0.1" />
        {[...Array(5)].map((_, i) => (
          <motion.rect 
            key={i}
            x={36 + i * 6} 
            y="35" 
            width="3" 
            height="30" 
            rx="1.5"
            fill={i === 2 ? "#FFFFFF" : "url(#logo-primary)"}
            initial={{ scaleY: 0.2 }}
            animate={{ scaleY: [0.2, 1.0, 0.2] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.15 
            }}
            style={{ transformOrigin: "50% 50%" }}
          />
        ))}
      </g>
    </svg>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang } = useLang();
  const t = contentDict[lang].nav;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.solutions, href: '#solutions' },
    { name: t.features, href: '#features' },
    { name: t.process, href: '#process' },
    { name: t.about, href: '#about' },
  ];

  const handleLinkClick = (e: any, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-3' : 'bg-transparent py-6 md:py-8'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleLinkClick(e as any, '#hero')}>
          <LogoMark className="w-10 h-10 md:w-12 md:h-12" />
          <span className="font-display font-black tracking-tighter text-brand-navy flex flex-col items-start leading-none ml-1">
            <span className="text-lg md:text-3xl tracking-tight text-brand-navy">CAMBRIDGE<span className="text-brand-blue">AI</span></span>
            <span className="text-[7px] md:text-[10px] uppercase tracking-[0.4em] font-black text-brand-navy/50 mt-1">Receptionist</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy hover:text-brand-blue transition-colors"
            >
              {link.name}
            </a>
          ))}

          <div className="flex items-center gap-2 border-l border-brand-navy/10 pl-6 border-r pr-6">
             <button onClick={() => setLang('en')} className={`text-xl hover:scale-110 !font-emoji transition-all ${lang === 'en' ? 'opacity-100 drop-shadow-[0_0_10px_rgba(0,212,255,0.8)] scale-110' : 'opacity-30 grayscale hover:grayscale-0'}`}>🇬🇧</button>
             <button onClick={() => setLang('pl')} className={`text-xl hover:scale-110 !font-emoji transition-all ${lang === 'pl' ? 'opacity-100 drop-shadow-[0_0_10px_rgba(0,102,255,0.8)] scale-110' : 'opacity-30 grayscale hover:grayscale-0'}`}>🇵🇱</button>
          </div>

          <button onClick={(e) => handleLinkClick(e as any, '#solutions')} className="bg-brand-navy text-white px-8 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-brand-blue transition-all border border-brand-navy static-glow">
            {t.contact}
          </button>
        </div>

        {/* Mobile Nav Top Bar - Add flags here too */}
        <div className="md:hidden flex items-center gap-4">
          <div className="flex items-center gap-2">
             <button onClick={() => setLang('en')} className={`text-xl hover:scale-110 !font-emoji transition-all ${lang === 'en' ? 'opacity-100 drop-shadow-md' : 'opacity-30 grayscale'}`}>🇬🇧</button>
             <button onClick={() => setLang('pl')} className={`text-xl hover:scale-110 !font-emoji transition-all ${lang === 'pl' ? 'opacity-100 drop-shadow-md' : 'opacity-30 grayscale'}`}>🇵🇱</button>
          </div>
          <button 
            className="text-brand-navy p-2 bg-white/50 backdrop-blur-md rounded-full shadow-sm border border-brand-navy/5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 w-full overflow-hidden bg-white/95 backdrop-blur-3xl border-t border-brand-navy/5 shadow-2xl origin-top"
          >
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="text-2xl font-display font-black text-brand-navy tracking-tight"
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.2 }}
                onClick={(e) => handleLinkClick(e as any, '#solutions')}
                className="bg-brand-navy text-white px-6 py-4 rounded-2xl text-center font-bold text-sm tracking-widest uppercase mt-4 shadow-lg active:scale-95 transition-transform"
              >
                {t.getStarted}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { lang } = useLang();
  const t = contentDict[lang].hero;
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity1 = useTransform(scrollY, [0, 500], [1, 0]);

  const handleDemoCall = () => window.dispatchEvent(new Event('open-retell-demo'));

  return (
    <section id="hero" className="relative pt-40 pb-20 md:pt-48 md:pb-32 lg:pt-64 lg:pb-40 overflow-hidden">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[2px] w-12 bg-brand-cyan" />
              <span className="text-brand-navy font-black uppercase text-[10px] tracking-[0.5em] block">
                {t.tag}
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-[80px] font-black leading-[0.9] text-brand-navy mb-6 tracking-tighter">
              {t.title1} <br />
              <span className="text-gradient-premium">{t.title2}</span><br />
              {t.title3}
            </h1>
            <p className="text-lg md:text-xl text-brand-navy/60 mb-8 lg:mb-10 max-w-lg leading-[1.6] font-medium tracking-tight">
              {t.desc}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
              <button className="relative bg-brand-navy text-white px-8 lg:px-10 py-4 rounded-xl font-bold text-xs tracking-widest uppercase hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_rgba(0,31,63,0.15)] focus:outline-none radiant-glow-btn text-center whitespace-nowrap">
                {t.btn1}
              </button>
              <div className="flex items-center gap-4 group cursor-pointer justify-center sm:justify-start">
                 <div className="w-14 h-14 rounded-full border border-brand-navy/10 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-cyan group-hover:border-brand-cyan static-glow bg-white relative z-10">
                    <Play className="w-5 h-5 fill-brand-navy text-brand-navy ml-1" />
                 </div>
                 <span className="text-[10px] uppercase font-black tracking-[0.3em] text-brand-navy transition-colors">{t.btn2}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 p-4 md:p-10 perspective-[2000px] mt-8 md:mt-0"
          >
            {/* Sphere & Stats Wrapper */}
            <div className="relative flex items-center justify-center w-full max-w-[340px] md:max-w-none md:w-auto">
              {/* 3D Glass Centerpiece */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotateX: [0, 2, 0],
                  rotateY: [0, -4, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] md:max-w-lg aspect-square glass rounded-full md:rounded-[3rem] flex items-center justify-center overflow-hidden group shadow-[0_40px_100px_rgba(0,31,63,0.1)] border border-white/60"
              >
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/10 via-transparent to-brand-blue/5" />
               
               {/* 3D Core Aura */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-cyan/20 rounded-full blur-[60px] group-hover:w-80 group-hover:h-80 group-hover:bg-brand-blue/30 transition-all duration-1000" />

               {/* Animated Voice Wave - Refined Apple Style */}
               <div className="flex items-center gap-[6px] h-32 relative z-10">
                  {[...Array(16)].map((_, i) => {
                    const targetHeight = 24 + ((Math.sin(i * 0.8) + 1) * 35) + ((i % 3) * 15);
                    return (
                      <motion.div 
                        key={i}
                        animate={{ height: [24, targetHeight, 24] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.05, 
                          ease: "easeInOut" 
                        }}
                        className="w-1.5 bg-gradient-to-t from-brand-navy to-brand-blue rounded-full shadow-[0_0_15px_rgba(0,102,255,0.4)]"
                      />
                    );
                  })}
               </div>
            </motion.div>

            {/* Premium Floating Indicator Cards */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.02, y: -10, transition: { duration: 0.3 } }}
              className="absolute -top-4 md:-top-10 right-0 sm:right-4 md:-right-8 glass-dark text-white p-3 md:p-6 rounded-2xl md:rounded-3xl w-36 sm:w-48 md:w-64 z-20 shadow-2xl backdrop-blur-3xl border border-white/20 cursor-default will-change-transform"
            >
              <div className="flex items-center gap-3 mb-2">
                 <Zap className="w-5 h-5 text-brand-cyan" />
                 <div className="text-[10px] uppercase font-black tracking-widest text-brand-cyan">{t.stat1}</div>
              </div>
              <div className="text-4xl font-display font-black tracking-tighter">0.12<span className="text-xl text-white/50">ms</span></div>
              <div className="w-full h-1 bg-white/20 mt-4 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="w-full h-full bg-brand-cyan absolute inset-0 rounded-full" 
                />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              whileHover={{ scale: 1.02, y: 10, transition: { duration: 0.3 } }}
              className="absolute -bottom-4 md:-bottom-10 left-0 sm:left-4 md:-left-12 glass p-3 md:p-6 rounded-2xl md:rounded-3xl w-40 sm:w-48 md:w-72 z-20 shadow-2xl border border-white/60 cursor-default will-change-transform"
            >
              <div className="flex items-center gap-3 mb-2">
                 <Globe className="w-5 h-5 text-brand-blue" />
                 <div className="text-[10px] uppercase font-black tracking-widest text-brand-blue">{t.stat2}</div>
              </div>
              <div className="text-3xl md:text-4xl font-display font-black text-brand-navy tracking-tighter">42+ <span className="text-lg md:text-xl text-brand-navy/50">{t.stat2sub}</span></div>
            </motion.div>
            </div>

            {/* Interactive Call Card */}
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              className="relative md:absolute md:top-[50%] md:-right-24 glass p-4 md:p-6 rounded-2xl md:rounded-[24px] w-full max-w-[320px] md:w-80 z-30 shadow-[0_30px_60px_rgba(0,31,63,0.15)] border border-brand-cyan/40 bg-white/95 will-change-transform mt-4 md:mt-0"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-brand-cyan/50 flex-shrink-0 relative shadow-lg bg-white">
                   <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/10 to-transparent mix-blend-overlay z-10" />
                   <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" alt="AI Agent" width="200" height="200" decoding="async" fetchPriority="high" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <div className="text-[10px] uppercase font-black tracking-widest text-brand-cyan mb-0">{t.chatState}</div>
                  </div>
                  <div className="text-xs md:text-[15px] font-black text-brand-navy leading-tight tracking-tight">{t.chatDesc}</div>
                </div>
              </div>
              
              <div className="relative min-h-[100px] flex flex-col gap-3 justify-center">
                <p className="text-xs font-semibold text-brand-navy/60 leading-relaxed text-center">
                  {lang === 'pl' ? 'Porozmawiaj teraz z polską recepcjonistką AI.' : 'Speak now with the live English AI receptionist.'}
                </p>
                <button 
                  onClick={handleDemoCall}
                  className="w-full bg-brand-navy text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition-colors shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/40"
                >
                  {lang === 'pl' ? 'Rozpocznij rozmowę na żywo' : 'Start live conversation'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const { lang } = useLang();
  const t = contentDict[lang].feat;

  const feats = [
    { 
      title: t.f1t, 
      desc: t.f1d, 
      icon: <CheckCircle2 className="w-6 h-6 text-brand-cyan" />
    },
    { 
      title: t.f2t, 
      desc: t.f2d, 
      icon: <Zap className="w-6 h-6 text-brand-blue" />
    },
    { 
      title: t.f3t, 
      desc: t.f3d, 
      icon: <Phone className="w-6 h-6 text-brand-cyan" />
    },
    { 
      title: t.f4t, 
      desc: t.f4d, 
      icon: <Activity className="w-6 h-6 text-brand-blue" />
    },
    {
      title: t.f5t,
      desc: t.f5d,
      icon: <Globe className="w-6 h-6 text-brand-cyan" />
    },
    {
      title: t.f6t,
      desc: t.f6d,
      icon: <CheckCircle2 className="w-6 h-6 text-brand-blue" />
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden bg-white text-brand-navy z-10 border-y border-brand-navy/5">
      {/* Subtle Tech Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.02]" fill="none">
           <pattern id="grid-pattern-features" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" stroke="currentColor" strokeWidth="1" />
           </pattern>
           <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern-features)" className="text-brand-navy" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 md:mb-16">
          <div className="max-w-3xl">
            <span className="text-brand-blue font-bold uppercase text-[10px] tracking-widest block mb-2">{t.tag}</span>
            <h2 className="font-display text-4xl md:text-5xl leading-tight font-black tracking-tighter" dangerouslySetInnerHTML={{ __html: t.title1 }} />
          </div>
          <p className="text-base text-brand-navy/60 font-medium leading-relaxed max-w-sm md:text-right">
             {t.desc}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {feats.map((f, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
               className="p-8 rounded-3xl bg-brand-gray/30 hover:bg-white border border-brand-navy/5 hover:border-brand-cyan/30 transition-all duration-300 hover:shadow-lg group"
             >
               <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-brand-navy/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                 {f.icon}
               </div>
               <h3 className="font-display font-black text-xl tracking-tight mb-3 text-brand-navy">{f.title}</h3>
               <p className="text-sm font-medium text-brand-navy/60 leading-relaxed">{f.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const ProblemSolution = () => {
  const { lang } = useLang();
  const t = contentDict[lang].prob;
  return (
    <section id="solutions" className="py-16 md:py-24 relative overflow-hidden bg-brand-gray/30 border-y border-brand-navy/5 z-10">
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 relative z-20">
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-black text-brand-navy leading-tight tracking-tighter mb-4">
              {t.title}
            </h2>
            <p className="text-base md:text-lg text-brand-navy/60 font-medium max-w-2xl mx-auto">
              {t.desc}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {/* Human / Old Way */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 md:p-10 rounded-3xl border border-brand-navy/10 shadow-sm"
           >
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brand-navy/5">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="font-black text-gray-500 text-2xl">?</span>
                </div>
                <div>
                  <h3 className="font-display font-black text-xl md:text-2xl text-brand-navy">{t.box1Title}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mt-1">{t.box1Sub}</p>
                </div>
              </div>
              
              <ul className="space-y-5">
                {[
                  { label: t.box1Lbl1, value: t.box1Val1 },
                  { label: t.box1Lbl2, value: t.box1Val2 },
                  { label: t.box1Lbl3, value: t.box1Val3 },
                  { label: t.box1Lbl4, value: t.box1Val4 }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 border-b border-brand-navy/5 pb-3 items-center justify-between">
                     <span className="text-sm font-medium text-brand-navy/60">{item.label}</span>
                    <span className="text-sm font-bold text-brand-navy text-right w-1/2">{item.value}</span>
                  </li>
                ))}
              </ul>
           </motion.div>

           {/* AI / New Way */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-navy p-8 md:p-10 rounded-3xl border border-brand-cyan/20 shadow-[0_20px_40px_rgba(0,31,63,0.15)] relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10 relative z-10">
                <div className="w-12 h-12 bg-brand-cyan/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-brand-cyan" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl md:text-2xl text-white">{t.box2Title}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-cyan mt-1">{t.box2Sub}</p>
                </div>
              </div>
              
              <ul className="space-y-5 relative z-10">
                {[
                  { label: t.box2Lbl1, value: t.box2Val1 },
                  { label: t.box2Lbl2, value: t.box2Val2 },
                  { label: t.box2Lbl3, value: t.box2Val3 },
                  { label: t.box2Lbl4, value: t.box2Val4 }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 border-b border-white/10 pb-3 items-center justify-between">
                    <span className="text-sm font-medium text-white/60">{item.label}</span>
                    <span className="text-sm font-bold text-white text-right w-1/2">{item.value}</span>
                  </li>
                ))}
              </ul>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

const ForWho = () => {
  const { lang } = useLang();
  const t = contentDict[lang].who;

  const industries = [
    { title: t.c1t, details: t.c1d, tags: [t.c1tt1, t.c1tt2] },
    { title: t.c2t, details: t.c2d, tags: [t.c2tt1, t.c2tt2] },
    { title: t.c3t, details: t.c3d, tags: [t.c3tt1, t.c3tt2] },
    { title: t.c4t, details: t.c4d, tags: [t.c4tt1, t.c4tt2] },
  ];

  return (
    <section id="who" className="py-24 relative overflow-hidden bg-white/72">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-20">
        <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <span className="text-brand-blue font-bold uppercase text-[10px] tracking-[0.4em]">{t.tag}</span>
            <h2 className="font-display text-4xl md:text-6xl font-black text-brand-navy mt-4 tracking-tighter leading-tight">{t.title1}<br/><span className="text-brand-blue">{t.title2}</span></h2>
          </div>
          <p className="max-w-md text-brand-navy/60 font-medium text-lg leading-relaxed">
             {t.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
           {industries.map((ind, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
               whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
               className="group relative p-6 sm:p-8 md:p-12 rounded-3xl md:rounded-[32px] border border-brand-navy/[0.05] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
             >
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-cyan/10 blur-[80px] opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 origin-top-right mix-blend-multiply pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue/5 blur-[80px] opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 origin-bottom-left mix-blend-multiply pointer-events-none" />
               
               <h3 className="font-display font-black text-2xl md:text-3xl text-brand-navy tracking-tighter mb-2 relative z-10">{ind.title}</h3>
               <p className="text-base font-bold text-brand-navy/60 mb-8 relative z-10">{ind.details}</p>
               <div className="flex gap-3 relative z-10 flex-wrap">
                 {ind.tags.map((tag, j) => (
                   <span key={j} className="px-4 py-2 rounded-full border border-brand-cyan/20 text-[10px] font-black uppercase tracking-widest text-brand-navy/70 bg-brand-gray/50 group-hover:bg-brand-cyan group-hover:text-brand-navy transition-colors duration-500 shadow-sm">{tag}</span>
                 ))}
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const { lang } = useLang();
  const t = contentDict[lang].proc;

  const steps = [
    { title: t.s1t, value: "01", text: t.s1d },
    { title: t.s2t, value: "02", text: t.s2d },
    { title: t.s3t, value: "03", text: t.s3d },
    { title: t.s4t, value: "04", text: t.s4d }
  ];

  return (
    <section id="process" className="py-40 relative overflow-hidden bg-brand-navy/95 border-y border-brand-navy/10">
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] border-[1px] border-white/5 rounded-full blur-[2px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[60vw] h-[60vw] border-[1px] border-brand-cyan/20 rounded-full blur-[2px] opacity-20 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-20">
        <div className="text-center mb-32">
          <span className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em]">{t.tag}</span>
          <h2 className="font-display text-5xl md:text-7xl font-black text-white mt-4 tracking-tighter flex items-center justify-center gap-4">
             {t.title1.split(' ')[0]} {t.title1.split(' ')[1]} <Zap className="w-10 h-10 text-brand-cyan" /> {t.title1.split(' ').slice(2).join(' ')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {steps.map((step, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 50, filter: 'blur(20px)' }}
               whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               viewport={{ once: true, margin: "-10%" }}
               transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
               className="glass-dark p-8 md:p-10 rounded-[30px] relative group border-white/10 hover:border-brand-cyan/50 hover:bg-brand-navy/80 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
             >
               <div className="absolute -inset-10 bg-gradient-to-br from-brand-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none" />
               <div className="text-white/10 font-display font-black text-8xl tracking-tighter mb-8 group-hover:text-brand-cyan/20 transition-colors pointer-events-none">
                 {step.value}
               </div>
               <h3 className="text-white font-black uppercase tracking-widest text-lg mb-4">{step.title}</h3>
               <p className="text-white/60 text-sm font-medium leading-relaxed group-hover:text-white/90 transition-colors">{step.text}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const { lang } = useLang();
  const t = contentDict[lang].price;

  const tiers = [
    { 
      title: t.b1Title, 
      price: t.b1P, 
      period: t.b1M, 
      desc: t.b1Sub 
    },
    { 
      title: t.b2Title, 
      price: t.b2P, 
      period: t.b2M, 
      desc: t.b2Sub 
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-white/72">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-xl">
            <span className="text-brand-gold font-bold uppercase text-[10px] tracking-widest">{t.tag}</span>
            <h2 className="font-display text-4xl md:text-7xl font-black text-brand-navy tracking-tighter mt-4">{t.title1} <br /><span className="text-brand-blue">{t.title2}</span></h2>
          </div>
          <div className="bg-brand-gray p-6 border-l-4 border-brand-cyan rounded-lg">
             <p className="italic text-brand-navy text-sm font-bold">{t.desc}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {tiers.map((tier, i) => (
            <div key={i} className="editorial-card p-6 sm:p-8 md:p-12 hover:border-brand-blue transition-all group bg-white shadow-sm hover:shadow-xl">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] text-brand-gold mb-8">{tier.title}</h3>
              <div className="mb-8">
                <span className="text-5xl font-black text-brand-navy tracking-tight">{tier.price}</span>
                <span className="text-brand-navy/40 font-bold text-xs uppercase ml-3 tracking-widest shrink-0">{tier.period}</span>
              </div>
              <p className="text-brand-navy/60 font-medium text-sm border-t border-brand-navy/5 pt-8">{tier.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const { lang } = useLang();
  const t = contentDict[lang].abt;
  
  const { scrollYProgress } = useScroll();
  const imgY = useTransform(scrollYProgress, [0.6, 1], [-50, 50]);

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-brand-navy border-y border-brand-cyan/20">
      {/* High-tech background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-transparent to-brand-navy pointer-events-none" />

      {/* Pulsing tech orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-cyan blur-[150px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-blue blur-[150px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
          {/* Image Side - High tech layout */}
          <div className="w-full lg:w-5/12 relative group mt-10 md:mt-0">
             <div className="relative z-10 p-2 glass bg-white/5 border border-brand-cyan/20 rounded-3xl overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(0,212,255,0.1)]">
               <motion.img 
                 style={{ y: imgY }}
                 initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                 whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                 viewport={{ once: true, margin: "-100px" }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 src="/IMG_8801.JPG"
                 width="1376"
                 height="768"
                 loading="lazy"
                 decoding="async"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = '/IMG_8801.jpeg';
                   (e.target as HTMLImageElement).onerror = () => {
                     (e.target as HTMLImageElement).src = '/IMG_8801.jpg';
                   };
                 }}
                 alt="Pawel Dusza" 
                 className="w-full h-auto rounded-2xl object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 object-top"
               />
               
               {/* Scanning line animation */}
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-[2px] bg-brand-cyan shadow-[0_0_15px_rgba(0,212,255,0.8)] z-20 pointer-events-none"
               />
             </div>

             {/* Tech HUD elements */}
             <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-brand-cyan/50 z-20" />
             <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-brand-cyan/50 z-20" />
             
             <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20 hidden md:flex">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1 h-8 bg-brand-cyan/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                      className="w-full bg-brand-cyan"
                    />
                  </div>
                ))}
             </div>
          </div>

          {/* Content Side */}
          <div className="w-full lg:w-7/12 flex-col space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 border border-brand-cyan/30 bg-brand-cyan/5 px-4 py-2 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
              <span className="text-brand-cyan font-bold uppercase text-[10px] tracking-[0.3em]">{t.tag}</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]"
            >
              {t.title1.split(' ')[0]} <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-white">{t.title1.split(' ').slice(1).join(' ')}</span>
            </motion.h2>
            
            <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: '4rem' }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="h-1 bg-gradient-to-r from-brand-cyan to-transparent rounded-full" 
            />

            <div className="text-white/70 space-y-6 text-sm md:text-base font-medium leading-relaxed max-w-2xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {t.p1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {t.p2}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white font-bold"
              >
                {t.p3}
              </motion.p>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="pt-6 border-t border-brand-cyan/20 grid grid-cols-2 gap-8 max-w-md"
            >
               <div>
                  <div className="text-3xl font-black text-brand-cyan mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Automation Dedication</div>
               </div>
               <div>
                  <div className="text-3xl font-black text-brand-cyan mb-1">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">System Reliability</div>
               </div>
            </motion.div>

            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.8 }}
               className="pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-brand-cyan/10"
            >
              <span className="text-[10px] font-bold text-brand-cyan uppercase tracking-widest">
                Cambridge, UK • AI Assistants & Receptionists • Workflow Automation
              </span>
              <button className="bg-brand-cyan text-brand-navy shadow-[0_0_15px_rgba(0,212,255,0.4)] px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all whitespace-nowrap ml-auto">
                {t.btn}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const LuxuryStats = () => {
  const stats = [
    { label: "Call Latency", value: "0.12ms" },
    { label: "Availability", value: "99.9%" },
    { label: "Bilingual Cap", value: "42+" },
    { label: "Cost Offset", value: "70%" },
  ];

  return (
    <section className="relative overflow-hidden bg-white/76 py-12 border-t border-brand-navy/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col">
              <div className="text-brand-gold font-bold uppercase text-[10px] tracking-widest mb-2">{s.label}</div>
              <div className="text-brand-navy font-black text-3xl">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { lang } = useLang();
  const t = contentDict[lang].cta;

  return (
    <section id="contact" className="py-16 md:py-24 relative overflow-hidden bg-white/76">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="bg-brand-navy p-8 sm:p-12 md:p-24 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-cyan/10 to-transparent -z-0" />
          
          <div className="relative z-10 max-w-xl text-left">
            <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-[0.95] tracking-tighter">
               {t.title1} <br />{t.title2.split(' ')[0]} <span className="text-brand-cyan">{t.title2.split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-lg text-white/70 mb-0 font-medium leading-relaxed">
              {t.desc}
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
            <button className="editorial-btn bg-brand-cyan text-brand-navy hover:bg-white border border-brand-cyan radiant-glow-btn">
              {t.btn1}
            </button>
            <button className="editorial-btn border border-white/20 text-white hover:bg-white/10 static-glow">
              {t.btn2}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { lang } = useLang();

  return (
    <footer className="bg-white pt-16 pb-24 md:pb-8 border-t border-brand-navy/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
           <div className="flex flex-col items-center md:items-start gap-5 md:gap-6">
             <div className="flex items-center gap-3 md:gap-4 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <LogoMark className="w-10 h-10 md:w-12 md:h-12" />
                <span className="font-display font-black tracking-tighter flex flex-col items-start leading-[0.85] ml-1 md:ml-0">
                  <span className="text-lg md:text-3xl tracking-tight text-brand-navy">CAMBRIDGE<span className="text-brand-blue">AI</span></span>
                  <span className="text-[7px] md:text-[9px] uppercase tracking-[0.35em] md:tracking-[0.45em] font-black text-brand-navy/60 mt-[3px] md:mt-[4px] ml-[1px]">Receptionist</span>
                </span>
              </div>
              <div className="flex items-center gap-5 text-brand-navy/50">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors" aria-label="LinkedIn">
                   <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-cyan transition-colors" aria-label="Twitter">
                   <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
          <div className="text-center md:text-right w-full md:w-auto">
            <div className="flex flex-wrap justify-center items-center md:justify-end gap-x-6 gap-y-3 text-[10px] uppercase font-bold tracking-[0.2em] text-brand-navy/50 mb-5 md:mb-4">
              <span>Oxford Analytica</span>
              <span className="w-1 h-1 rounded-full bg-brand-cyan/50 hidden md:block" />
              <span>Tech-Vantage</span>
              <span className="w-1 h-1 rounded-full bg-brand-cyan/50 hidden md:block" />
              <span>Globe-Sys</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-brand-navy/40 md:items-end md:text-[10px]">
              <p className="leading-relaxed">
                &copy; {new Date().getFullYear()} Cambridge AI Receptionist.<br className="block md:hidden"/> {lang === 'pl' ? 'Wszelkie prawa zastrzeżone.' : 'All rights reserved.'}
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
                className="rounded-full border border-brand-navy/10 px-4 py-2 text-brand-navy/55 transition-colors hover:border-brand-cyan/50 hover:text-brand-blue focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-cyan/30"
              >
                {lang === 'pl' ? 'Ustawienia cookies' : 'Cookie settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const StickyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { lang } = useLang();
  const t = contentDict[lang].foot;

  useEffect(() => {
    const handleScroll = () => {
      const featuresElement = document.getElementById('features');
      const contactElement = document.getElementById('contact');
      
      if (!featuresElement || !contactElement) return;

      const featuresTop = featuresElement.getBoundingClientRect().top + window.scrollY;
      const contactTop = contactElement.getBoundingClientRect().top + window.scrollY;
      
      const scrollY = window.scrollY;
      
      // Show when we scroll past the start of 'features' section
      // Hide when we reach the 'contact' section
      const isPastFeatures = scrollY > featuresTop - window.innerHeight / 2;
      const isBeforeContact = scrollY < contactTop - window.innerHeight;

      setIsVisible(isPastFeatures && isBeforeContact);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 sm:bottom-8 left-0 w-full z-40 p-4 pointer-events-none flex justify-center sticky-banner-container transition-all duration-300"
        >
          <div className="glass-dark px-6 py-4 rounded-full shadow-[0_20px_40px_rgba(0,31,63,0.3)] flex flex-row items-center gap-6 pointer-events-auto border border-brand-cyan/30 bg-brand-navy/80">
            <span className="text-white text-sm font-bold tracking-wide hidden sm:block">
              {t.tag}
            </span>
            <button 
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  window.scrollTo({
                    top: element.getBoundingClientRect().top + window.scrollY - 100,
                    behavior: 'smooth'
                  });
                }
              }}
              className="bg-brand-cyan text-brand-navy px-6 py-3 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)] whitespace-nowrap"
            >
              {t.btn}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MainApp = () => {
  return (
    <div className="font-sans min-h-screen selection:bg-brand-cyan selection:text-brand-navy overflow-x-hidden w-full relative">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <ProblemSolution />
      <ForWho />
      <Features />
      <Process />
      <Pricing />
      <About />
      <CTA />
      <Footer />
      <StickyBanner />
      <VoiceReceptionist />
      <CookieConsent />
    </div>
  );
};

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return window.localStorage.getItem('cambridge-language') === 'en' ? 'en' : 'pl';
    } catch {
      return 'pl';
    }
  });

  const setLang = (nextLanguage: Lang) => {
    setLangState(nextLanguage);
    try {
      window.localStorage.setItem('cambridge-language', nextLanguage);
    } catch {
      // The language still changes for this visit when storage is unavailable.
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <MainApp />
    </LangContext.Provider>
  );
}
