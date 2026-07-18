export type ScanType = 'fake-news' | 'scam-message' | 'phishing-link' | 'email' | 'screenshot';

export interface ScanResult {
  id: string;
  title: string;
  type: ScanType;
  verdict: 'Safe' | 'Likely Safe' | 'Suspicious' | 'Likely Scam' | 'Scam Detected' | 'Insufficient Information';
  riskScore: number;
  confidence: number;
  summary: string;
  patterns: string[];
  recommendations: string[];
  evidence: string[];
  scannedAt: string;
  mode: 'dark' | 'light';
  content?: string;
}

export interface HistoryEntry extends ScanResult {
  content: string;
}
