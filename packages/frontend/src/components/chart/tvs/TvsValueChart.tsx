import type { Milestone } from '@l2beat/config'
import { formatCurrency } from '@l2beat/shared-pure'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatSnapshotTimestamp } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'

interface TvsValueChartDataPoint {
  timestamp: number
  value: number | null
  /** USD value of the ETH staked network-wide, drawn behind the TVL. */
  ethStaked?: number | null
}

interface Props {
  data: TvsValueChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  resolution: ChartResolution
  project?: ChartProject
  milestones?: Milestone[]
  /** Draws `ethStaked`, which the TVL is a part of. */
  withEthStaked?: boolean
}

type Key = 'value' | 'ethStaked'

const valueMeta = {
  value: {
    label: 'TVL',
    color: 'var(--chart-pink)',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

const withEthStakedMeta = {
  ethStaked: {
    label: 'Total ETH staked',
    color: 'var(--chart-ethereum-secondary)',
    indicatorType: { shape: 'line' },
  },
  ...valueMeta,
} satisfies ChartMeta

export function TvsValueChart({
  data,
  syncedUntil,
  isLoading,
  isPlaceholderData,
  resolution,
  project,
  milestones,
  withEthStaked,
}: Props) {
  const keys: Key[] = withEthStaked ? ['ethStaked', 'value'] : ['value']
  const meta = withEthStaked ? withEthStakedMeta : valueMeta
  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
      data={data}
      meta={meta}
      isLoading={isLoading}
      project={project}
      milestones={milestones}
      legend
    >
      <TimeSeriesChart
        data={data}
        ariaLabel="Value secured"
        series={keys.map((key) => ({
          key,
          ...tinted(withEthStakedMeta[key].color),
        }))}
        yAxis={{
          tickCount: 4,
          format: (value) => formatCurrency(value, 'usd'),
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row, keys) => (
          <TvsValueChartTooltip row={row} keys={keys} resolution={resolution} />
        )}
      />
    </ChartContainer>
  )
}

function TvsValueChartTooltip({
  row,
  keys,
  resolution,
}: {
  row: TvsValueChartDataPoint
  keys: Key[]
  resolution: ChartResolution
}) {
  // The TVL first, then the total it is a part of
  const payload = getTooltipEntries(row, keys).reverse()
  const share =
    keys.includes('ethStaked') && row.value != null && row.ethStaked
      ? row.value / row.ethStaked
      : undefined

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatSnapshotTimestamp(row.timestamp, resolution)}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry) => (
          <ChartTooltipRow
            key={entry.name}
            name={entry.name}
            gap="gap-x-6"
            wrapLabel={false}
          >
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {entry.value === null
                ? 'No data'
                : formatCurrency(entry.value, 'usd')}
              {entry.name === 'value' && share !== undefined && (
                <span className="text-secondary">
                  {' '}
                  ({formatPercent(share)})
                </span>
              )}
            </span>
          </ChartTooltipRow>
        ))}
      </div>
    </ChartTooltipWrapper>
  )
}
