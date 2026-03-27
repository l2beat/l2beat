import { StatCard } from '~/components/chart/stats/StatCard'
import { StatsGrid } from '~/components/chart/stats/StatsGrid'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { api } from '~/trpc/React'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { optionToRange } from '~/utils/range/range'

type StatType = 'total' | 'rollups' | 'validiumsAndOptimiums' | 'others'
const statsMeta: Record<StatType, { label: string; color: string }> = {
  total: {
    label: 'Total',
    color: 'var(--chart-ethereum)',
  },
  rollups: {
    label: 'Rollups',
    color: 'var(--chart-fuchsia)',
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'var(--chart-teal)',
  },
  others: {
    label: 'Others',
    color: 'var(--chart-yellow)',
  },
}

export function ScalingTvsStats() {
  const { data, isLoading } = api.tvs.recategorisedChart.useQuery({
    range: optionToRange('7d'),
    filter: { type: 'layer2' },
  })

  const stats = getStats(data?.chart)

  return (
    <StatsGrid columns={4} columnsMobile={2}>
      <Stat
        type="rollups"
        value={stats?.rollups.value}
        change={stats?.rollups.change}
        isLoading={isLoading}
      />
      <Stat
        type="validiumsAndOptimiums"
        value={stats?.validiumsAndOptimiums.value}
        change={stats?.validiumsAndOptimiums.change}
        isLoading={isLoading}
      />
      <Stat
        type="others"
        value={stats?.others.value}
        change={stats?.others.change}
        isLoading={isLoading}
      />
      <Stat
        type="total"
        value={stats?.total.value}
        change={stats?.total.change}
        isLoading={isLoading}
      />
    </StatsGrid>
  )
}

function Stat({
  type,
  value,
  change,
  isLoading,
}: {
  type: StatType
  value: number | undefined
  change: number | undefined
  isLoading: boolean
}) {
  const meta = statsMeta[type]

  return (
    <StatCard
      color={meta.color}
      title={meta.label}
      isLoading={isLoading}
      loadingContent={
        <div className="flex min-h-[23px] items-center gap-1 md:min-h-7">
          <Skeleton className="min-h-[23px] w-[6rem] self-center md:min-h-7 md:w-[7.25rem]" />
          <span className="relative inline-block w-[52px] self-center pl-3.5">
            <Skeleton className="min-h-[18px] w-full md:min-h-[23px]" />
          </span>
        </div>
      }
    >
      <div className="flex min-h-6 items-center gap-1 md:min-h-7">
        <div className="whitespace-nowrap font-bold text-heading-20 md:text-heading-24">
          {value !== undefined ? formatCurrency(value, 'usd') : 'No data'}
        </div>
        {change !== undefined ? (
          <PercentChange
            textClassName="md:text-heading-20 text-heading-16"
            value={change}
          />
        ) : null}
      </div>
    </StatCard>
  )
}

function getStats(
  chart: [number, number | null, number | null, number | null][] | undefined,
) {
  const oldest = chart?.at(0)
  const newest = chart?.at(-1)
  if (!oldest || !newest) return undefined

  const [, oldestRollups, oldestValidiumsAndOptimiums, oldestOthers] =
    oldest as [number, number, number, number]
  const [, newestRollups, newestValidiumsAndOptimiums, newestOthers] =
    newest as [number, number, number, number]

  const stat = (now: number, then: number) => ({
    value: now,
    change: calculatePercentageChange(now, then),
  })

  return {
    total: stat(
      newestRollups + newestValidiumsAndOptimiums + newestOthers,
      oldestRollups + oldestValidiumsAndOptimiums + oldestOthers,
    ),
    rollups: stat(newestRollups, oldestRollups),
    validiumsAndOptimiums: stat(
      newestValidiumsAndOptimiums,
      oldestValidiumsAndOptimiums,
    ),
    others: stat(newestOthers, oldestOthers),
  }
}
