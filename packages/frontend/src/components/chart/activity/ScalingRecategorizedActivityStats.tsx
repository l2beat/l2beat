import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/pages/scaling/activity/components/ActivityMetricContext'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { api } from '~/trpc/React'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { StatCard } from '../stats/StatCard'
import { StatsGrid } from '../stats/StatsGrid'

interface Props {
  entries: ScalingActivityEntry[]
}

export function ScalingRecategorizedActivityStats({ entries }: Props) {
  const { metric } = useActivityMetricContext()

  const { data: stats, isLoading } = api.activity.chartStats.useQuery({
    filter: { type: 'projects', projectIds: entries.map((entry) => entry.id) },
  })

  return (
    <StatsGrid className="my-2">
      <Stat
        type="rollups"
        metric={metric}
        value={stats?.[metric].rollups}
        scalingFactor={stats?.[metric].scalingFactor}
        isLoading={isLoading}
      />
      <Stat
        type="validiumsAndOptimiums"
        metric={metric}
        value={stats?.[metric].validiumsAndOptimiums}
        isLoading={isLoading}
      />
      <Stat
        type="others"
        metric={metric}
        value={stats?.[metric].others}
        isLoading={isLoading}
      />
      <Stat
        type="ethereum"
        metric={metric}
        value={stats?.[metric].ethereum}
        isLoading={isLoading}
      />
    </StatsGrid>
  )
}

const statsMeta = {
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
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
  },
}

function Stat({
  type,
  metric,
  value,
  scalingFactor,
  isLoading,
}: {
  type: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'ethereum'
  metric: ActivityMetric
  value: number | undefined
  scalingFactor?: number
  isLoading: boolean
}) {
  const scalingFactorFooter =
    scalingFactor !== undefined ? (
      <div className="flex items-center gap-1 pt-1 text-secondary">
        <div className="text-label-value-13 lg:text-label-value-14">
          <span className="font-normal">Scaling factor: </span>
          <span className="font-bold">{scalingFactor.toFixed(2)}x</span>
        </div>
        <ScalingFactorTooltip metric={metric} />
      </div>
    ) : undefined

  return (
    <StatCard
      color={statsMeta[type].color}
      title={`${statsMeta[type].label} Past Day ${metric.toUpperCase()}`}
      isLoading={isLoading}
      footer={
        type !== 'rollups' ? undefined : isLoading ? (
          <Skeleton className="mt-1 h-3 w-24 md:mt-2 md:w-48" />
        ) : (
          scalingFactorFooter
        )
      }
    >
      <div className="flex min-h-[23px] items-center justify-center md:min-h-7">
        <div className="whitespace-nowrap font-bold text-heading-20 md:text-heading-24">
          {value !== undefined ? formatActivityCount(value) : 'No data'}
        </div>
      </div>
    </StatCard>
  )
}

function ScalingFactorTooltip({ metric }: { metric: ActivityMetric }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <InfoIcon className="size-3 fill-current" />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-2">
          <div className="font-bold">What is scaling factor?</div>

          <div>
            {`How many more ${metric === 'tps' ? 'transactions' : 'operations'} are settled by Ethereum if we take into
              account projects listed below.`}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-xs">Exact formula:</div>
            <div className="text-xs">
              {`(project ${metric}/7d + ETH ${metric}/7d) / ETH ${metric}/7d`}
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
