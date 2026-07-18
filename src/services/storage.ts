import type { HistoryEntry, ScanResult } from '../types';

const HISTORY_KEY = 'fraudscanai.history';
const THEME_KEY = 'fraudscanai.theme';

export function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function loadHistory(): HistoryEntry[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveTheme(theme: 'dark' | 'light') {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): 'dark' | 'light' {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === 'light' ? 'light' : 'dark';
}

export function createScanResult(input: Omit<ScanResult, 'id' | 'scannedAt'>): ScanResult {
  return {
    id: crypto.randomUUID(),
    scannedAt: new Date().toISOString(),
    ...input,
  };
}
