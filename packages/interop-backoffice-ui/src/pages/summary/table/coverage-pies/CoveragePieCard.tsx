import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Badge } from '~/components/core/Badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import type { SummaryCoveragePieChart } from '../types'

function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`
}

export function CoveragePieCard(props: { chart: SummaryCoveragePieChart }) {
  const { chart } = props

  return (
    <Card className="gap-4">
      <CardHeader className="space-y-2">
        <CardTitle>{chart.title}</CardTitle>
        <CardDescription>
          All events: {formatCount(chart.totalCount)} | Supported:{' '}
          {formatCount(chart.supportedCount)} ({formatPct(chart.supportedPct)})
          | Unsupported: {formatCount(chart.unsupportedCount)} (
          {formatPct(chart.unsupportedPct)})
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="relative h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chart.slices}
                dataKey="count"
                nameKey="label"
                innerRadius={74}
                outerRadius={116}
                paddingAngle={1}
                stroke="#ffffff"
                strokeWidth={1}
                isAnimationActive={false}
              >
                {chart.slices.map((slice) => (
                  <Cell key={`${chart.id}-${slice.label}`} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => {
                  const slice =
                    item.payload as SummaryCoveragePieChart['slices'][number]
                  return [
                    `${formatCount(Number(value))} (${formatPct(slice.pctOfTotal)})`,
                    slice.label,
                  ]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="max-w-[160px] text-muted-foreground text-xs">
              {chart.centerLabel}
            </div>
            <div className="font-semibold text-2xl">
              {formatCount(chart.totalCount)}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {formatCount(chart.supportedCount)} supported
            </Badge>
            <Badge
              variant={chart.unsupportedCount > 0 ? 'destructive' : 'secondary'}
            >
              {formatCount(chart.unsupportedCount)} unsupported
            </Badge>
          </div>
          <ul className="max-h-[300px] space-y-1 overflow-auto pr-1 text-xs">
            {chart.slices.map((slice) => (
              <li
                key={`${chart.id}-legend-${slice.label}`}
                className={
                  slice.isSupported
                    ? 'rounded border border-emerald-100 bg-emerald-50 px-2 py-1'
                    : 'rounded border border-red-100 bg-red-50 px-2 py-1'
                }
                title={slice.rawChains.join(', ')}
              >
                <span className="mr-2 inline-flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-sm"
                    style={{ background: slice.color }}
                  />
                  <span>{slice.label}</span>
                </span>
                <span className="text-muted-foreground">
                  {formatPct(slice.pctOfTotal)} ({formatCount(slice.count)})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
