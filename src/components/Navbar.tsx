import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Menu, X, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onOpenPrivacy: () => void;
}

export function Navbar({ onOpenPrivacy }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
        
        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-3 md:flex">
          <a href="#scanner" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">Scanner</a>
          <a href="#history" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">History</a>
          <a href="#faq" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">FAQ</a>
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <ShieldAlert className="h-4 w-4 text-cyan-300" />
            Privacy Policy
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-400/20"
          >
            Privacy
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-100 transition"
          >
            {isOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-slate-950 md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-5">
              <a
                href="#scanner"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2.5 text-center text-sm text-slate-300 transition hover:bg-white/10"
              >
                Scanner
              </a>
              <a
                href="#history"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2.5 text-center text-sm text-slate-300 transition hover:bg-white/10"
              >
                History
              </a>
              <a
                href="#faq"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 px-4 py-2.5 text-center text-sm text-slate-300 transition hover:bg-white/10"
              >
                FAQ
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenPrivacy();
                }}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-center text-sm text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Privacy Policy
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
