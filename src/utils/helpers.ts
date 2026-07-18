export function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function getRiskColor(score: number) {
  if (score > 80) return 'from-rose-600 to-red-500';
  if (score > 60) return 'from-orange-500 to-amber-500';
  if (score > 40) return 'from-yellow-500 to-amber-400';
  if (score > 20) return 'from-blue-500 to-cyan-400';
  return 'from-emerald-500 to-green-400';
}

export function getRiskLabel(score: number) {
  if (score > 80) return 'Scam Detected';
  if (score > 60) return 'Likely Scam';
  if (score > 40) return 'Suspicious';
  if (score > 20) return 'Likely Safe';
  return 'Safe';
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
