import { motion } from 'framer-motion';
import { ShieldCheck, MoonStar, SunMedium } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface NavbarProps {
  theme: 'dark' | 'light';
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
}

export function Navbar({ theme, setTheme }: NavbarProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2.5">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">FraudScanAI</p>
            <p className="text-xs text-slate-400">Cyber defense engine</p>
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#scanner" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">Scanner</a>
          <a href="#history" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">History</a>
          <a href="#faq" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">FAQ</a>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full border border-white/10 bg-white/10 p-2.5 text-slate-100 transition hover:scale-105"
        >
          {theme === 'dark' ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </button>
      </div>
    </motion.header>
  );
}
