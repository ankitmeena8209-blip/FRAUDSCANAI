import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Gauge, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import type { ScanResult } from '../types';
import { classNames, formatDate, getRiskColor, getRiskLabel } from '../utils/helpers';

interface ResultPanelProps {
  result: ScanResult | null;
  isScanning: boolean;
  loadingStep: number;
}

export function ResultPanel({ result, isScanning, loadingStep }: ResultPanelProps) {
  const stages = ['Analyzing context', 'Evaluating signals', 'Comparing evidence', 'Generating report'];

  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-premium">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Analysis Result</p>
          <h3 className="mt-2 text-2xl font-semibold">Live verdict</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-200">
          <ShieldCheck className="h-4 w-4" />
          {isScanning ? 'Active scan' : 'Ready'}
        </div>
      </div>

      {isScanning ? (
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: index <= loadingStep ? 1 : 0.35, x: 0 }}
              className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/5 p-3"
            >
              <div className={classNames('rounded-full p-2', index <= loadingStep ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/10 text-slate-400')}>
                {index <= loadingStep ? <Sparkles className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{stage}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: index <= loadingStep ? '100%' : '35%' }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : result ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-sm font-semibold text-white ${getRiskColor(result.riskScore)}`}>
                {result.verdict}
              </div>
              <h4 className="text-3xl font-semibold">{result.title}</h4>
              <p className="max-w-xl text-sm text-slate-400">{result.summary}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${getRiskColor(result.riskScore)}`}>
                  <Gauge className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Risk score</p>
                  <p className="text-3xl font-semibold">{result.riskScore}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2 text-cyan-300">
                <TrendingUp className="h-4 w-4" />
                <p className="text-sm font-medium">Confidence</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">{result.confidence}%</p>
              <p className="mt-2 text-sm text-slate-400">Model confidence based on visible urgency and impersonation cues.</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2 text-fuchsia-300">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-medium">Recommended action</p>
              </div>
              <p className="mt-3 text-lg font-semibold">{getRiskLabel(result.riskScore)}</p>
              <p className="mt-2 text-sm text-slate-400">{formatDate(result.scannedAt)}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <h5 className="text-sm font-semibold">Detected patterns</h5>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.patterns.map((item) => (
                  <span key={item} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-100">{item}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <h5 className="text-sm font-semibold">Recommendations</h5>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {result.recommendations.map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-cyan-300">•</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
            <h5 className="text-sm font-semibold">Evidence chips</h5>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.evidence.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{item}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex min-h-[260px] items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-slate-900/50 text-center text-sm text-slate-400">
          Scan content to reveal a premium analysis report.
        </div>
      )}
    </div>
  );
}
