import { useMemo } from 'react'
import { CssVariables } from '~/components/CssVariables'
import { OverflowWrapper } from '~/components/core/OverflowWrapper'
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
import type { RecategorisedActivityChartData } from '~/server/features/scaling/activity/getRecategorisedActivityChart'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'

interface Props {
  data: RecategorisedActivityChartData | undefined
}

export function ScalingRecategorizedActivityStats({ data }: Props) {
  const { metric } = useActivityMetricContext()

  const stats = useMemo(() => {
    const latestData = data?.data.at(-1)
    if (!latestData)
      return {
        rollups: 0,
        validiumsAndOptimiums: 0,
        others: 0,
        ethereum: 0,
      }

    const [
      _,
      rollupsUops,
      validiumsAndOptimiumsUops,
      othersUops,
      ethereumUops,
      rollupsTx,
      validiumsAndOptimiumsTx,
      othersTx,
      ethereumTx,
    ] = latestData

    const rollupsValue = metric === 'uops' ? rollupsUops : rollupsTx
    const validiumsAndOptimiumsValue =
      metric === 'uops' ? validiumsAndOptimiumsUops : validiumsAndOptimiumsTx
    const othersValue = metric === 'uops' ? othersUops : othersTx
    const ethereumValue = metric === 'uops' ? ethereumUops : ethereumTx

    return {
      rollups: rollupsValue ? countPerSecond(rollupsValue) : 0,
      validiumsAndOptimiums: validiumsAndOptimiumsValue
        ? countPerSecond(validiumsAndOptimiumsValue)
        : 0,
      others: othersValue ? countPerSecond(othersValue) : 0,
      ethereum: ethereumValue ? countPerSecond(ethereumValue) : 0,
      scalingFactor:
        rollupsValue && ethereumValue ? rollupsValue / ethereumValue : 0,
    }
  }, [data, metric])

  return (
    <OverflowWrapper>
      <div className="my-3 grid min-w-182 grid-cols-4 gap-3 ">
        <Stat
          type="rollups"
          metric={metric}
          value={stats.rollups}
          scalingFactor={stats.scalingFactor}
        />
        <Stat
          type="validiumsAndOptimiums"
          metric={metric}
          value={stats.validiumsAndOptimiums}
        />
        <Stat type="others" metric={metric} value={stats.others} />
        <Stat type="ethereum" metric={metric} value={stats.ethereum} />
      </div>
    </OverflowWrapper>
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
}: {
  type: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'ethereum'
  metric: ActivityMetric
  value: number
  scalingFactor?: number
}) {
  return (
    <CssVariables
      variables={{
        'stat-color': statsMeta[type].color,
      }}
    >
      <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--stat-color)] bg-[var(--stat-color)]/10 px-2 py-3 lg:px-4 lg:py-5">
        <div className="h-6.5 text-center font-medium text-label-value-13 md:h-7 md:text-label-value-14 lg:h-8 lg:text-label-value-16">
          {statsMeta[type].label} Past Day {metric.toUpperCase()}
        </div>
        <div className="flex h-9 flex-col items-center justify-center md:h-[43px] lg:h-13">
          <div className="font-bold text-heading-20 md:text-heading-24 lg:text-heading-32">
            {formatActivityCount(value)}
          </div>
          {scalingFactor && (
            <div className="flex items-center gap-1 text-secondary">
              <div className="text-label-value-13 lg:text-label-value-14">
                <span className="font-normal">Scaling factor: </span>
                <span className="font-bold">{scalingFactor.toFixed(2)}x</span>
              </div>
              <ScalingFactorTooltip metric={metric} />
            </div>
          )}
        </div>
      </div>
    </CssVariables>
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
