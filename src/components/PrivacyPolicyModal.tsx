import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, Eye, Database, FileText } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col rounded-[28px] border border-white/10 bg-slate-900 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-2.5">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Privacy Policy</h2>
                <p className="text-xs text-slate-400">FraudScanAI Data Governance & Protection</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 scrollbar-thin">
            <div className="rounded-[20px] border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-cyan-200 leading-relaxed">
                At FraudScanAI, we prioritize your digital privacy. This document outlines how data is handled when you use our cybersecurity intelligence platform.
              </p>
            </div>

            {/* Section 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <Lock className="h-4 w-4 text-cyan-400" />
                <h3>1. Information Processing & Gemini AI Integration</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                When you submit content (news text, scam messages, URLs, email bodies, or screenshot descriptions) for scanning, the data is processed in real time by our Google Gemini AI threat engine. The text is submitted solely to generate risk scores, verdicts, and actionable defense guidance.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <Database className="h-4 w-4 text-cyan-400" />
                <h3>2. Local Storage & Client Privacy</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your scan history and recent threat reports are stored locally in your browser&apos;s <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300 font-mono text-xs">localStorage</code>. We do not maintain remote user tracking databases or user profile logs. You retain full control to clear your local history at any time using the &quot;Delete All&quot; action in the Evidence History panel.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <Eye className="h-4 w-4 text-cyan-400" />
                <h3>3. Data Retention & Third-Party Sharing</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                We do not sell, rent, or monetize your submitted content or metadata to advertisers or data brokers. All API communication with Google Cloud Generative AI endpoint occurs securely via TLS encryption.
              </p>
            </div>

            {/* Section 4 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-100">
                <FileText className="h-4 w-4 text-cyan-400" />
                <h3>4. Your Rights & Control</h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                You have the right to inspect, copy, or purge your data stored on your device. Clearing your browser cache or site storage immediately wipes all stored scan records.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 p-4 sm:px-6">
            <p className="text-xs text-slate-400">Last updated: July 2026</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-cyan-500/20 px-5 py-2 text-xs font-semibold text-cyan-200 border border-cyan-400/30 transition hover:bg-cyan-500/30"
            >
              Close Privacy Policy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
