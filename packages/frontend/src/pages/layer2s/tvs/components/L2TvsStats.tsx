import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { StatCard } from '~/components/chart/stats/StatCard'
import { StatsGrid } from '~/components/chart/stats/StatsGrid'
import { PercentChange } from '~/components/PercentChange'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import type { L2TvsEntry } from '~/server/features/layer2s/tvs/getL2TvsEntries'
import { useTRPC } from '~/trpc/React'
import {
  PERIOD_LABEL,
  type PercentageChangePeriod,
} from '~/utils/calculatePercentageChange'

type StatType = 'total' | 'rollups' | 'validiumsAndOptimiums' | 'others'
const statsMeta: Record<StatType, { label: string; color: string }> = {
  total: {
    label: 'Total',
    color: 'var(--chart-ethereum)',
  },
  rollups: {
    label: 'Rollups',
    // As in the charts above, where rollups are the pink series.
    color: 'var(--chart-pink)',
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

export function L2TvsStats({
  entries,
}: {
  entries: {
    rollups: L2TvsEntry[]
    validiumsAndOptimiums: L2TvsEntry[]
    others: L2TvsEntry[]
  }
}) {
  const trpc = useTRPC()
  const { display } = useTvsDisplayControlsContext()
  const { data, isLoading } = useQuery(
    trpc.tvs.chartStats.queryOptions({
      filter: {
        type: 'projects',
        projectIds: [
          ...entries.rollups,
          ...entries.validiumsAndOptimiums,
          ...entries.others,
        ].map((entry) => entry.id),
      },
      excludeAssociatedTokens: display.excludeAssociatedTokens,
      excludeRwaRestrictedTokens: display.excludeRwaRestrictedTokens,
    }),
  )
  const stats = data

  return (
    <StatsGrid className="mx-4">
      <Stat
        type="rollups"
        value={stats?.rollups.value}
        change={stats?.rollups.change}
        changePeriod={stats?.rollups.changePeriod}
        isLoading={isLoading}
      />
      <Stat
        type="validiumsAndOptimiums"
        value={stats?.validiumsAndOptimiums.value}
        change={stats?.validiumsAndOptimiums.change}
        changePeriod={stats?.validiumsAndOptimiums.changePeriod}
        isLoading={isLoading}
      />
      <Stat
        type="others"
        value={stats?.others.value}
        change={stats?.others.change}
        changePeriod={stats?.others.changePeriod}
        isLoading={isLoading}
      />
      <Stat
        type="total"
        value={stats?.total.value}
        change={stats?.total.change}
        changePeriod={stats?.total.changePeriod}
        isLoading={isLoading}
      />
    </StatsGrid>
  )
}

function Stat({
  type,
  value,
  change,
  changePeriod,
  isLoading,
}: {
  type: StatType
  value: number | undefined
  change: number | undefined
  changePeriod: PercentageChangePeriod | undefined
  isLoading: boolean
}) {
  const meta = statsMeta[type]

  return (
    <StatCard color={meta.color} title={meta.label} isLoading={isLoading}>
      <div className="flex min-h-6 flex-wrap items-baseline justify-center gap-x-1.5 md:min-h-7">
        <div className="whitespace-nowrap font-semibold text-heading-18 tabular-nums tracking-[-0.02em] md:text-heading-24">
          {value !== undefined ? formatCurrency(value, 'usd') : 'No data'}
        </div>
        {change !== undefined && changePeriod !== undefined ? (
          <span className="flex items-baseline gap-1 whitespace-nowrap font-medium text-label-value-13">
            <PercentChange
              className="min-w-0 cursor-default text-left"
              textClassName="text-label-value-13"
              value={change}
              period={changePeriod}
            />
            <span className="text-secondary">
              / {PERIOD_LABEL[changePeriod]}
            </span>
          </span>
        ) : null}
      </div>
    </StatCard>
  )
}
