import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  type XAxisTickContentProps,
  YAxis,
} from 'recharts'
import {
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
} from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { PrivacyAmountAnalysisBucket } from '~/server/features/privacy/privacyAmountAnalysisUtils'
import { compactUsd } from '~/server/features/privacy/privacyAmountBuckets'
import { formatInteger } from '~/utils/number-format/formatInteger'
import {
  type PrivacyAmountScale,
  PrivacyAmountScaleToggle,
} from './PrivacyAmountScaleToggle'

interface Props {
  title: string
  buckets: PrivacyAmountAnalysisBucket[]
  color: string
  isLoading: boolean
}

interface BarDatum {
  name: string
  count: number
  /** Addresses in this bucket plus every larger bucket. */
  atOrAbove: number
  /** Inclusive USD lower bound of this bucket. */
  minUsd: number
}

export function PrivacyAddressAmountBucketsChart({
  title,
  buckets,
  color,
  isLoading,
}: Props) {
  const [scale, setScale] = useState<PrivacyAmountScale>('lin')
  const isClient = useIsClient()

  const data = useMemo<BarDatum[]>(() => {
    const result: BarDatum[] = buckets.map((bucket) => ({
      name: bucket.label,
      count: bucket.count,
      atOrAbove: 0,
      minUsd: bucket.minUsd ?? 0,
    }))
    // Suffix sum: addresses in each bucket and all larger ones (buckets are
    // ordered ascending), used for the "anonymity set" tooltip line.
    let running = 0
    for (let i = result.length - 1; i >= 0; i--) {
      const datum = result[i]
      if (!datum) continue
      running += datum.count
      datum.atOrAbove = running
    }
    return result
  }, [buckets])

  const chartMeta = {
    count: {
      label: 'Addresses',
      color,
      indicatorType: { shape: 'square' },
    },
  } satisfies ChartMeta

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="font-bold text-lg md:text-xl">{title}</h3>
        <PrivacyAmountScaleToggle value={scale} onChange={setScale} />
      </div>
      {isLoading || !isClient ? (
        <Skeleton className="h-[250px] min-h-[250px] w-full" />
      ) : (
        <SimpleChartContainer meta={chartMeta}>
          <BarChart
            responsive
            width="100%"
            data={data}
            margin={{ top: 20 }}
            maxBarSize={48}
            className="size-full min-h-[250px]! md:aspect-auto"
          >
            <CartesianGrid vertical={false} strokeDasharray="5 5" />
            <Bar
              dataKey="count"
              fill={color}
              fillOpacity={0.8}
              isAnimationActive={false}
            />
            <YAxis
              scale={scale === 'log' ? 'log' : 'linear'}
              domain={scale === 'log' ? [0.9, 'auto'] : [0, 'auto']}
              allowDataOverflow={scale === 'log'}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(value) => formatInteger(Number(value))}
            />
            <XAxis
              dataKey="name"
              type="category"
              interval={0}
              tickLine={false}
              height={48}
              // Angled labels keep all 12 buckets readable without overlapping.
              tick={<AngledBucketTick />}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--surface-tertiary)', fillOpacity: 0.3 }}
              content={<BucketsTooltip />}
            />
          </BarChart>
        </SimpleChartContainer>
      )}
    </div>
  )
}

function AngledBucketTick({ x, y, payload }: Partial<XAxisTickContentProps>) {
  return (
    <text
      x={x}
      y={y}
      dy={10}
      textAnchor="end"
      transform={`rotate(-35, ${x}, ${y})`}
      className="fill-secondary"
      style={{ fontSize: 9 }}
    >
      {String(payload?.value ?? '')}
    </text>
  )
}

function BucketsTooltip({
  payload,
  label,
}: {
  payload?: { payload?: BarDatum }[]
  label?: string
}) {
  const datum = payload?.[0]?.payload
  if (!datum || typeof label !== 'string') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {label}
      </div>
      <HorizontalSeparator className="my-1.5" />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Addresses</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatInteger(datum.count)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">
            Addresses ≥ {compactUsd(datum.minUsd)}
          </span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatInteger(datum.atOrAbove)}
          </span>
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
