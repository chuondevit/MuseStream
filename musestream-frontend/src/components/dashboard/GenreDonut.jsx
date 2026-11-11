import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export const PALETTE = ['#8B5CF6', '#EC4899', '#22D3EE', '#A78BFA', '#34D399', '#FACC15', '#F97316', '#94A3B8'];

export default function GenreDonut({ data = [] }) {
  const total = data.reduce((s, g) => s + (g.plays || 0), 0);
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);
  const summary = `Top genres: ${data.map((g) => `${g.name} ${pct(g.plays)} percent`).join(', ')}.`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <p className="sr-only">{summary}</p>
      <div className="w-48 h-48 shrink-0" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="plays" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={3} stroke="none">
              {data.map((g, i) => <Cell key={g.id ?? g.name} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1A1430', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#F5F3FF', fontSize: 12 }}
              itemStyle={{ color: '#F5F3FF' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full space-y-2">
        {data.map((g, i) => (
          <li key={g.id ?? g.name} className="flex items-center gap-3 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="flex-1 truncate">{g.name}</span>
            <span className="text-ink-muted tabular-nums">{pct(g.plays)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
