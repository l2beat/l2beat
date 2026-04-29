import { RefreshCwIcon } from 'lucide-react'
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ErrorState } from '~/components/ErrorState'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import type { CoveragePieChart, CoveragePieSlice } from './types'

const integerFormatter = new Intl.NumberFormat('en-US')
const percentFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatInt(value: number): string {
  return integerFormatter.format(value)
}

function formatPct(value: number): string {
  return `${percentFormatter.format(value)}%`
}

function formatGeneratedAt(value: string): string {
  return new Date(value).toLocaleString()
}

function CoveragePieTooltip(props: {
  active?: boolean
  payload?: Array<{ payload: CoveragePieSlice }>
}) {
  const slice = props.payload?.[0]?.payload
  if (!props.active || !slice) return null

  const rawChains =
    slice.rawChains.length > 1 || slice.rawChains[0] !== slice.label
      ? slice.rawChains.join(', ')
      : undefined

  return (
    <div className="max-w-64 rounded-lg border bg-background p-3 shadow-sm">
      <p className="font-medium text-sm">{slice.label}</p>
      <p className="mt-1 text-muted-foreground text-xs">
        {formatInt(slice.count)} events • {formatPct(slice.pctOfTotal)}
      </p>
      <p className="mt-2 text-xs">
        {slice.isSupported ? 'Supported' : 'Unsupported'}
      </p>
      {rawChains ? (
        <p className="mt-1 text-muted-foreground text-xs">{rawChains}</p>
      ) : null}
    </div>
  )
}

function renderCenterLabel(chart: CoveragePieChart) {
  return function CenterLabel(props: { viewBox?: unknown }) {
    const viewBox = props.viewBox as { cx?: number; cy?: number } | undefined
    const cx = viewBox?.cx
    const cy = viewBox?.cy
    if (cx === undefined || cy === undefined) return null

    return (
      <text x={cx} y={cy} textAnchor="middle">
        <tspan x={cx} y={cy} fontSize="24" fontWeight="600">
          {formatInt(chart.totalCount)}
        </tspan>
        <tspan
          x={cx}
          dy="18"
          fill="var(--color-muted-foreground)"
          fontSize="11"
        >
          {chart.centerLabel}
        </tspan>
      </text>
    )
  }
}

function CoveragePieCard(props: { chart: CoveragePieChart }) {
  const { chart } = props

  return (
    <Card className="gap-4">
      <CardHeader className="space-y-1">
        <CardTitle>{chart.title}</CardTitle>
        <CardDescription>{chart.centerLabel}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {formatInt(chart.totalCount)} events
          </Badge>
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {formatInt(chart.supportedCount)} supported (
            {formatPct(chart.supportedPct)})
          </Badge>
          <Badge className="border-red-200 bg-red-50 text-red-700">
            {formatInt(chart.unsupportedCount)} unsupported (
            {formatPct(chart.unsupportedPct)})
          </Badge>
        </div>

        <div className="h-80">
          {chart.totalCount === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-muted-foreground text-sm">
              No events found
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CoveragePieTooltip />} />
                <Pie
                  data={chart.slices}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={72}
                  outerRadius={116}
                  paddingAngle={chart.slices.length > 1 ? 1 : 0}
                  stroke="var(--color-background)"
                  strokeWidth={2}
                  isAnimationActive={false}
                >
                  {chart.slices.map((slice) => (
                    <Cell
                      key={`${chart.id}-${slice.label}`}
                      fill={slice.color}
                    />
                  ))}
                  <Label content={renderCenterLabel(chart)} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="space-y-2">
          {chart.slices.map((slice) => (
            <div
              key={`${chart.id}-${slice.label}-legend`}
              className="flex items-start gap-3 text-sm"
              title={slice.rawChains.join(', ')}
            >
              <span
                className="mt-1 size-2.5 shrink-0 rounded-[3px]"
                style={{ backgroundColor: slice.color }}
              />
              <div className="min-w-0">
                <p className="font-medium leading-5">{slice.label}</p>
                <p className="text-muted-foreground text-xs leading-5">
                  {formatPct(slice.pctOfTotal)} • {formatInt(slice.count)}{' '}
                  events
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function CoveragePiesPage() {
  const { data, error, isError, isLoading, isFetching, refetch } =
    api.coveragePies.data.useQuery()

  const charts = data?.charts ?? []

  return (
    <AppLayout className="min-h-screen">
      <div className="flex flex-col gap-4 p-4">
        <Card className="gap-4">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Coverage pies</CardTitle>
              <CardDescription>
                Support source of truth: <code>InteropEvent.unsupported</code>.
                Small slices are collapsed by support status.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching}
            >
              <RefreshCwIcon className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">{charts.length} charts</Badge>
            {data ? (
              <>
                <Badge variant="secondary">
                  Collapse threshold {data.collapseThresholdPct}%
                </Badge>
                <Badge variant="secondary">
                  Generated {formatGeneratedAt(data.generatedAt)}
                </Badge>
              </>
            ) : null}
          </CardContent>
        </Card>

        {isLoading ? <LoadingState className="m-6" /> : null}
        {isError ? <ErrorState className="m-6" cause={error.message} /> : null}
        {!isLoading && !isError ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {charts.map((chart) => (
              <CoveragePieCard key={chart.id} chart={chart} />
            ))}
          </div>
        ) : null}
      </div>
    </AppLayout>
  )
}
