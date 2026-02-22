import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { growingSeries, fluctSeries } from '../lib/mockStats'

const STROKE = '#6366f1'

function MiniLineChart({ data }: { data: { month: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={110}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 9, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={32} />
        <Tooltip
          contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb' }}
          itemStyle={{ color: STROKE }}
        />
        <Line type="monotone" dataKey="value" stroke={STROKE} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function ChartSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
      {children}
    </div>
  )
}

export default function BoardGameStatsSidebar({ gameId }: { gameId: string }) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-400 italic">Demo data — live stats coming soon</p>
      <ChartSection title="Owners over time">
        <MiniLineChart data={growingSeries(gameId + ':own', 18, 8)} />
      </ChartSection>
      <ChartSection title="Plays over time">
        <MiniLineChart data={growingSeries(gameId + ':play', 18, 15)} />
      </ChartSection>
      <ChartSection title="Change in ratings">
        <MiniLineChart data={fluctSeries(gameId + ':rat', 18, 7.2, 2.5, 1, 10)} />
      </ChartSection>
      <ChartSection title="Likes over time">
        <MiniLineChart data={growingSeries(gameId + ':like', 18, 10)} />
      </ChartSection>
    </div>
  )
}
