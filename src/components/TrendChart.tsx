import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Mon', alerts: 12, confidence: 78 },
  { name: 'Tue', alerts: 18, confidence: 84 },
  { name: 'Wed', alerts: 23, confidence: 88 },
  { name: 'Thu', alerts: 16, confidence: 82 },
  { name: 'Fri', alerts: 24, confidence: 91 },
  { name: 'Sat', alerts: 21, confidence: 89 },
  { name: 'Sun', alerts: 27, confidence: 94 },
];

export function TrendChart() {
  return (
    <div className="h-56 w-full rounded-[20px] border border-white/10 bg-slate-950/60 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="alerts" stroke="#38bdf8" fillOpacity={1} fill="url(#colorAlerts)" strokeWidth={2.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
