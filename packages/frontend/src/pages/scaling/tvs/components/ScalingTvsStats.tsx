import { StatCard } from '~/components/chart/stats/StatCard'
import { StatsGrid } from '~/components/chart/stats/StatsGrid'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PercentChange } from '~/components/PercentChange'
import { useTvsDisplayControlsContext } from '~/components/table/display/contexts/TvsDisplayControlsContext'
import type { ScalingTvsEntry } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

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

export function ScalingTvsStats({
  entries,
}: {
  entries: {
    rollups: ScalingTvsEntry[]
    validiumsAndOptimiums: ScalingTvsEntry[]
    others: ScalingTvsEntry[]
  }
}) {
  const { display } = useTvsDisplayControlsContext()
  const { data, isLoading } = api.tvs.chartStats.useQuery({
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
  })
  const stats = data

  return (
    <StatsGrid className="mx-4">
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
    <StatCard color={meta.color} title={meta.label} isLoading={isLoading}>
      <div className="flex min-h-6 items-center gap-1 md:min-h-7">
        <div className="whitespace-nowrap font-bold text-heading-18 md:text-heading-24">
          {value !== undefined ? formatCurrency(value, 'usd') : 'No data'}
        </div>
        {change !== undefined ? (
          <Tooltip>
            <TooltipTrigger>
              <PercentChange
                textClassName="cursor-default md:text-heading-20 w-full text-heading-16"
                value={change}
              />
            </TooltipTrigger>
            <TooltipContent>
              Percentage change compared to 7D ago.
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </StatCard>
  )
}
