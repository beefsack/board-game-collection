import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { growingSeries, barRatings } from '../lib/mockStats'

const STROKE = '#6366f1'
const FILL = '#818cf8'

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

interface Props {
  entityId: string
  gameCount: number
  gameLabels: string[]
}

export default function EntityStatsSidebar({ entityId, gameCount, gameLabels }: Props) {
  const ratingData = barRatings(entityId + ':ratings', gameLabels)

  return (
    <div className="space-y-5">
      <p className="text-xs text-gray-400 italic">Demo data - live stats coming soon</p>
      <ChartSection title="Games over time">
        <MiniLineChart data={growingSeries(entityId + ':games', 18, Math.max(1, gameCount / 6))} />
      </ChartSection>
      <ChartSection title="Owners over time">
        <MiniLineChart data={growingSeries(entityId + ':own', 18, 12)} />
      </ChartSection>
      {gameLabels.length > 0 && (
        <ChartSection title="Game ratings">
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={ratingData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={gameLabels.length > 4 ? -35 : 0}
                textAnchor={gameLabels.length > 4 ? 'end' : 'middle'}
                height={gameLabels.length > 4 ? 36 : 16}
              />
              <YAxis
                domain={[0, 10]}
                ticks={[0, 5, 10]}
                tick={{ fontSize: 9, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, border: '1px solid #e5e7eb' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="value" fill={FILL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartSection>
      )}
    </div>
  )
}
