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
  if (score > 70) return 'from-rose-500 to-orange-400';
  if (score > 40) return 'from-amber-500 to-yellow-400';
  return 'from-emerald-500 to-cyan-400';
}

export function getRiskLabel(score: number) {
  if (score > 70) return 'High Risk';
  if (score > 40) return 'Suspicious';
  return 'Safe';
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
