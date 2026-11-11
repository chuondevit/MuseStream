import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const weekday = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });

function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs shadow-glow">
      <p className="text-ink-muted">{p.fullDate}</p>
      <p className="font-bold text-sm">{p.plays} {p.plays === 1 ? 'play' : 'plays'}</p>
    </div>
  );
}

export default function PlaysAreaChart({ data = [] }) {
  const rows = data.map((d) => ({
    day: weekday(d.date),
    plays: d.plays || 0,
    fullDate: new Date(`${d.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
  }));
  const total = rows.reduce((s, r) => s + r.plays, 0);
  const summary = `Plays in the last 7 days: ${total} total. ${rows.map((r) => `${r.day} ${r.plays}`).join(', ')}.`;

  return (
    <div>
      <p className="sr-only">{summary}</p>
      <div className="h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="playsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" stroke="#A1A1B5" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#A1A1B5" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
            <Tooltip content={<DarkTooltip />} cursor={{ stroke: '#A78BFA', strokeDasharray: 4 }} />
            <Area type="monotone" dataKey="plays" stroke="#A78BFA" strokeWidth={3} fill="url(#playsFill)" dot={{ r: 3, fill: '#A78BFA' }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
