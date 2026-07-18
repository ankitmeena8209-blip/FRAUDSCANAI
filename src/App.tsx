import { ShieldCheck } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { SectionCard } from './components/SectionCard';
import { FAQ_ITEMS, FEATURES, STATS } from './data/samples';
import { createScanResult, loadHistory, saveHistory } from './services/storage';
import { analyzeContentWithGemini } from './services/gemini';
import type { HistoryEntry, ScanType } from './types';
import { classNames } from './utils/helpers';

const BackgroundEffects = lazy(() => import('./components/BackgroundEffects').then((module) => ({ default: module.BackgroundEffects })));
const FeatureGrid = lazy(() => import('./components/FeatureGrid').then((module) => ({ default: module.FeatureGrid })));
const HistoryPanel = lazy(() => import('./components/HistoryPanel').then((module) => ({ default: module.HistoryPanel })));
const ResultPanel = lazy(() => import('./components/ResultPanel').then((module) => ({ default: module.ResultPanel })));
const ScannerPanel = lazy(() => import('./components/ScannerPanel').then((module) => ({ default: module.ScannerPanel })));
const TrendChart = lazy(() => import('./components/TrendChart').then((module) => ({ default: module.TrendChart })));

function LoadingCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-[24px] border border-white/10 bg-slate-950/60 text-sm text-slate-400">
      <span>{label}</span>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<ScanType>('fake-news');
  const [inputValue, setInputValue] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const runScan = async (content: string, mode: ScanType) => {
    setIsScanning(true);
    setLoadingStep(0);
    setResult(null);

    const intervalId = window.setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, 2));
    }, 900);

    try {
      const geminiResult = await analyzeContentWithGemini(content, mode);
      
      window.clearInterval(intervalId);
      setLoadingStep(3);

      const scanResult = createScanResult({
        title: `${mode === 'fake-news' ? 'Fake News' : mode === 'scam-message' ? 'Scam Message' : mode === 'phishing-link' ? 'Phishing Link' : mode === 'email' ? 'Email' : 'Screenshot'} Analysis`,
        type: mode,
        verdict: geminiResult.verdict,
        riskScore: geminiResult.riskScore,
        confidence: geminiResult.confidence,
        summary: geminiResult.reasoning,
        patterns: geminiResult.warningSigns,
        recommendations: geminiResult.safetyTips,
        evidence: geminiResult.evidence,
        mode: 'dark',
        content,
      });

      const nextEntry = { ...scanResult, content } as HistoryEntry;
      setResult(nextEntry);
      setHistory((prev) => [nextEntry, ...prev].slice(0, 12));
    } catch (err: any) {
      window.clearInterval(intervalId);
      console.error(err);
      alert(err.message || 'An error occurred during analysis.');
    } finally {
      setIsScanning(false);
    }
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
    <div className={classNames('min-h-screen bg-slate-950 text-slate-100 dark')}>
      <Suspense fallback={null}>
        <BackgroundEffects />
      </Suspense>
      <Navbar onOpenPrivacy={() => setIsPrivacyOpen(true)} />
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
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
          <div className="glass rounded-[32px] p-6 shadow-premium">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Threat overview</p>
                <h2 className="mt-2 text-2xl font-semibold">Zero-friction review</h2>
              </div>
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-200">
                <div><ShieldCheck className="h-5 w-5" /></div>
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
          </div>
        </section>

        <SectionCard title="Scanner" description="Select a threat type, paste content, upload evidence, and trigger a live analysis workflow." glow>
          <div id="scanner" className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Suspense fallback={<LoadingCard label="Loading scanner…" />}>
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
            </Suspense>
            <Suspense fallback={<LoadingCard label="Loading analysis panel…" />}>
              <ResultPanel result={result} isScanning={isScanning} loadingStep={loadingStep} />
            </Suspense>
          </div>
        </SectionCard>

        <SectionCard title="Evidence history" description="Search, filter, and review past scans with a polished local archive.">
          <div id="history">
            <Suspense fallback={<LoadingCard label="Loading history…" />}>
              <HistoryPanel entries={history} onDelete={deleteEntry} onDeleteAll={deleteAll} />
            </Suspense>
          </div>
        </SectionCard>

        <SectionCard title="Platform capabilities" description="Every interaction is designed to feel premium and purposeful.">
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Suspense fallback={<LoadingCard label="Loading capabilities…" />}>
              <FeatureGrid />
            </Suspense>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Threat signal trend</p>
                  <h3 className="mt-2 text-xl font-semibold">Weekly review velocity</h3>
                </div>
                <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Live demo</div>
              </div>
              <Suspense fallback={<LoadingCard label="Loading trend view…" />}>
                <TrendChart />
              </Suspense>
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

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/70 px-4 py-8 text-center text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span className="font-semibold text-slate-200">FraudScanAI</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#scanner" className="hover:text-slate-200 transition">Scanner</a>
            <a href="#history" className="hover:text-slate-200 transition">History</a>
            <a href="#faq" className="hover:text-slate-200 transition">FAQ</a>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="text-cyan-300 hover:text-cyan-200 transition underline underline-offset-4"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </div>
  );
}

export default App;
