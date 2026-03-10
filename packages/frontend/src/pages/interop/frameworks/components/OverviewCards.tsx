import { formatSeconds } from '@l2beat/shared-pure'
import { Area, AreaChart } from 'recharts'
import {
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  type CustomChartTooltipProps,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { FrameworkOverview } from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { formatCurrency as formatCurrencyStandard } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { FW_COLORS_HEX } from '../utils/constants'
import { formatCurrency, formatNumber } from '../utils/format'

interface Props {
  frameworks: FrameworkOverview[]
}

export function OverviewCards({ frameworks }: Props) {
  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Overview
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          Last 7d
        </span>
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:overflow-x-auto">
        {frameworks.map((fw) => (
          <PrimaryCard key={fw.id} className="md:min-w-[240px] md:flex-1">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                <span className="font-bold text-heading-16">
                  {fw.shortName}
                </span>
              </div>
              <span className="text-label-value-12 text-secondary">
                {fw.provider}
              </span>
            </div>

            <div className="font-bold text-heading-24 tabular-nums">
              {formatCurrency(fw.volume)}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-label-value-12">
              <span className="text-secondary">7d volume</span>
              <PercentChange value={fw.volumeChange7d} />
              <span className="text-secondary">/ 7d</span>
            </div>

            {fw.volumeSeries.length > 1 && (
              <VolumeSparkline
                data={fw.volumeSeries}
                color={FW_COLORS_HEX[fw.id] ?? '#888'}
              />
            )}

            <div className="mt-3 flex flex-col gap-0">
              <StatRow label="Transfers" value={formatNumber(fw.transfers)} />
              <StatRow
                label="Avg Duration"
                value={
                  fw.avgDurationSec != null
                    ? formatSeconds(fw.avgDurationSec)
                    : '--'
                }
              />
              <StatRow
                label="Avg Transfer Size"
                value={
                  fw.transfers > 0
                    ? formatCurrency(fw.volume / fw.transfers)
                    : '--'
                }
              />
            </div>
          </PrimaryCard>
        ))}
      </div>
    </div>
  )
}

interface SparklinePoint {
  timestamp: number
  volume: number
  transfers: number
}

function VolumeSparkline({
  data,
  color,
}: {
  data: SparklinePoint[]
  color: string
}) {
  const meta = {
    volume: {
      color,
      indicatorType: { shape: 'line' as const },
      label: 'Volume',
    },
  } satisfies ChartMeta

  return (
    <div className="mt-2 h-10">
      <SimpleChartContainer meta={meta}>
        <AreaChart
          responsive
          width="100%"
          data={data}
          margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
          className="h-10!"
        >
          <defs>
            <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="volume"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color})`}
            isAnimationActive={false}
          />
          <ChartTooltip
            filterNull={false}
            content={<SparklineTooltip />}
            allowEscapeViewBox={{ y: true }}
          />
        </AreaChart>
      </SimpleChartContainer>
    </div>
  )
}

function SparklineTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload?.[0] || label === undefined) return null

  const data = payload[0].payload as SparklinePoint
  const config = meta.volume
  if (!config) return null

  const date = new Date(data.timestamp * 1000)
  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {dateStr}
      </div>
      <div className="mt-1.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-x-4">
          <span className="flex items-center gap-1">
            <ChartDataIndicator
              backgroundColor={config.color}
              type={config.indicatorType}
            />
            <span className="font-medium text-label-value-14">Volume</span>
          </span>
          <span className="font-medium text-label-value-15 tabular-nums">
            {formatCurrencyStandard(data.volume, 'usd')}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <span className="font-medium text-label-value-14">Transfers</span>
          <span className="font-medium text-label-value-15 tabular-nums">
            {formatInteger(data.transfers)}
          </span>
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-b-divider py-2 last:border-b-0">
      <span className="text-label-value-14 text-secondary">{label}</span>
      <span className="font-medium text-label-value-15 tabular-nums">
        {value}
      </span>
    </div>
  )
}
