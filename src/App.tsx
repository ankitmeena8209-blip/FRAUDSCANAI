import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BackgroundEffects } from './components/BackgroundEffects';
import { FeatureGrid } from './components/FeatureGrid';
import { HistoryPanel } from './components/HistoryPanel';
import { Navbar } from './components/Navbar';
import { ResultPanel } from './components/ResultPanel';
import { ScannerPanel } from './components/ScannerPanel';
import { SectionCard } from './components/SectionCard';
import { TrendChart } from './components/TrendChart';
import { FAQ_ITEMS, FEATURES, STATS } from './data/samples';
import { useTheme } from './hooks/useTheme';
import { createScanResult, loadHistory, saveHistory } from './services/storage';
import type { HistoryEntry, ScanType } from './types';
import { classNames } from './utils/helpers';

function App() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ScanType>('fake-news');
  const [inputValue, setInputValue] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const runScan = (content: string, mode: ScanType) => {
    setIsScanning(true);
    setLoadingStep(0);
    const steps = [0, 1, 2, 3];

    steps.forEach((_, index) => {
      window.setTimeout(() => {
        setLoadingStep(index);
        if (index === 3) {
          const riskScore = mode === 'screenshot' ? 78 : mode === 'phishing-link' ? 86 : mode === 'email' ? 74 : mode === 'scam-message' ? 81 : 68;
          const confidence = Math.max(82, Math.min(97, riskScore + 10));
          const verdict = riskScore > 70 ? 'High Risk' : riskScore > 40 ? 'Suspicious' : 'Safe';
          const patterns =
            mode === 'phishing-link'
              ? ['Impersonation domain', 'Credential harvesting cues', 'Urgent redirection']
              : mode === 'scam-message'
                ? ['Threatening language', 'Account urgency', 'Pressure to act fast']
                : mode === 'email'
                  ? ['Brand mimicry', 'Request for password', 'Suspicious sender tactics']
                  : mode === 'screenshot'
                    ? ['Popup deception', 'Fake verification prompt', 'Visual urgency']
                    : ['Emotion-driven headline', 'Unverified authority claim', 'Rapid distribution pattern'];

          const recommendations = [
            'Avoid clicking links or sharing credentials.',
            'Verify the message through an official channel.',
            'Report the content and preserve evidence for review.',
          ];

          const evidence = [
            content.slice(0, 36),
            `${mode.replace('-', ' ')} signal cluster detected`,
            'high urgency language observed',
          ];

          const scanResult = createScanResult({
            title: `${mode === 'fake-news' ? 'Fake News' : mode === 'scam-message' ? 'Scam Message' : mode === 'phishing-link' ? 'Phishing Link' : mode === 'email' ? 'Email' : 'Screenshot'} Analysis`,
            type: mode,
            verdict,
            riskScore,
            confidence,
            summary: 'The content shows a strong combination of urgency, impersonation, and trust manipulation tactics that point toward a high-risk threat.',
            patterns,
            recommendations,
            evidence,
            mode: theme,
            content,
          });

          const nextEntry = { ...scanResult, content } as HistoryEntry;
          setResult(nextEntry);
          setHistory((prev) => [nextEntry, ...prev].slice(0, 12));
          setIsScanning(false);
        }
      }, index * 950);
    });
  };

  const deleteEntry = (id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
    if (result?.id === id) {
      setResult(null);
    }
  };

  const deleteAll = () => {
    setHistory([]);
    setResult(null);
  };

  return (
    <div className={classNames('min-h-screen bg-slate-950 text-slate-100', theme === 'dark' ? 'dark' : 'light')}>
      <BackgroundEffects />
      <Navbar theme={theme} setTheme={setTheme} />
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
              Premium cybersecurity intelligence for modern teams
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Detect fraud before it spreads across your digital surface.
              </h1>
              <p className="max-w-2xl text-lg text-slate-400">
                FraudScanAI combines behavioral signals, evidence tracing, and polished threat review to help analysts detect fake news, scam messages, phishing links, fraud emails, and suspicious screenshots in a single, immersive workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#scanner" className="rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">Launch scanner</a>
              <a href="#history" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10">View history</a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {STATS.map((stat) => (
                <div key={stat.label} className="glass rounded-[20px] p-4">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-[32px] p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Threat overview</p>
                <h2 className="mt-2 text-2xl font-semibold">Zero-friction review</h2>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-200">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><ShieldCheck className="h-5 w-5" /></motion.div>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-white/5 p-3">
                  <div className="mt-0.5 rounded-full bg-cyan-500/15 p-2 text-cyan-300"><ShieldCheck className="h-4 w-4" /></div>
                  <p className="text-sm text-slate-300">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <SectionCard title="Scanner" description="Select a threat type, paste content, upload evidence, and trigger a live analysis workflow." glow>
          <div id="scanner" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <ScannerPanel
              selectedTab={activeTab}
              onTabChange={setActiveTab}
              inputValue={inputValue}
              setInputValue={setInputValue}
              filePreview={filePreview}
              setFilePreview={setFilePreview}
              onScan={runScan}
              isScanning={isScanning}
              loadingStep={loadingStep}
              setLoadingStep={setLoadingStep}
            />
            <ResultPanel result={result} isScanning={isScanning} loadingStep={loadingStep} />
          </div>
        </SectionCard>

        <SectionCard title="Evidence history" description="Search, filter, and review past scans with a polished local archive.">
          <div id="history">
            <HistoryPanel entries={history} onDelete={deleteEntry} onDeleteAll={deleteAll} />
          </div>
        </SectionCard>

        <SectionCard title="Platform capabilities" description="Every interaction is designed to feel premium and purposeful.">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <FeatureGrid />
            <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Threat signal trend</p>
                  <h3 className="mt-2 text-xl font-semibold">Weekly review velocity</h3>
                </div>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Live demo</div>
              </div>
              <TrendChart />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-slate-400">Mitigation speed</p>
                  <p className="mt-2 text-xl font-semibold">2.4x faster</p>
                </div>
                <div className="rounded-[16px] border border-white/10 bg-white/5 p-3">
                  <p className="text-sm text-slate-400">Coverage</p>
                  <p className="mt-2 text-xl font-semibold">24/7 watch</p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="FAQ" description="Practical answers for how the experience works." glow>
          <div id="faq" className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="rounded-[20px] border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-200">{item.question}</summary>
                <p className="mt-3 text-sm text-slate-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </SectionCard>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/70 px-4 py-6 text-center text-sm text-slate-400">
        <p>FraudScanAI © 2026. Built as a premium single-page cybersecurity experience.</p>
      </footer>
    </div>
  );
}

export default App;
