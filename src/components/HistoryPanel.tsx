import { motion } from 'framer-motion';
import { Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { HistoryEntry, ScanType } from '../types';
import { formatDate } from '../utils/helpers';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

export function HistoryPanel({ entries, onDelete, onDeleteAll }: HistoryPanelProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | ScanType>('all');
  const [sort, setSort] = useState<'recent' | 'risk'>('recent');

  const filtered = useMemo(() => {
    const next = entries.filter((entry) => {
      const matchesQuery = `${entry.title} ${entry.summary}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'all' || entry.type === filter;
      return matchesQuery && matchesFilter;
    });

    return next.sort((a, b) => {
      if (sort === 'risk') return b.riskScore - a.riskScore;
      return new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
    });
  }, [entries, filter, query, sort]);

  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-premium">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">History</p>
          <h3 className="mt-2 text-2xl font-semibold">Saved scans</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:flex md:w-auto md:items-center">
          <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm col-span-2 md:col-span-1">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="bg-transparent outline-none w-full md:w-auto" />
          </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | ScanType)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none col-span-1 w-full md:w-auto bg-slate-950">
            <option value="all">All</option>
            <option value="fake-news">Fake News</option>
            <option value="scam-message">Scam Message</option>
            <option value="phishing-link">Phishing Link</option>
            <option value="email">Email</option>
            <option value="screenshot">Screenshot</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as 'recent' | 'risk')} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none col-span-1 w-full md:w-auto bg-slate-950">
            <option value="recent">Recent</option>
            <option value="risk">Risk</option>
          </select>
          <button onClick={onDeleteAll} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20 col-span-2 w-full md:w-auto">Delete all</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center rounded-[20px] border border-dashed border-white/10 bg-slate-900/50 text-center text-sm text-slate-400">
          No saved scans yet. Run a scan to populate your secure evidence trail.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-slate-900/70 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{entry.title}</p>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-100">{entry.type}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{entry.verdict}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{entry.summary}</p>
                <p className="mt-2 text-xs text-slate-500">{formatDate(entry.scannedAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-200">{entry.riskScore}</div>
                <button onClick={() => onDelete(entry.id)} className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
