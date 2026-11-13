import { useState } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  type GasFeesGasMetric,
  type GasFeesMetric,
  type GasFeesUnit,
  type GasFeesUsdMetric,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import type { GasFeesChain } from './types'
import { MiddleD2 } from './variants/middle/MiddleD2'
import { TableB2 } from './variants/table/TableB2'
import { TopCardB2D } from './variants/top/TopCardB2D'

export type GasFeesScale = 'log' | 'lin'

const RANGE_LABELS: Record<(typeof GAS_FEES_RANGE_OPTIONS)[number], string> = {
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  max: 'Max',
}

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  initialRange: ChartRange
  /** The past year, fixed: the stats don't follow the chart's range */
  statsRange: ChartRange
}

export function GasFeesView({
  chains,
  upgrades,
  initialRange,
  statsRange,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
  // The chart opens on the whole history, the stats cover the past year and
  // the table opens on recent fees
  const [tableRange, setTableRange] = useState(() => optionToRange('30d'))
  const [unit, setUnit] = useState<GasFeesUnit>('usd')
  // Each unit keeps its own metric, so switching back restores it
  const [usdMetric, setUsdMetric] = useState<GasFeesUsdMetric>(
    DEFAULT_GAS_FEES_METRIC,
  )
  const [gasMetric, setGasMetric] = useState<GasFeesGasMetric>(
    DEFAULT_GAS_FEES_GAS_METRIC,
  )
  const metric = unit === 'usd' ? usdMetric : gasMetric
  const setMetric = (m: GasFeesMetric) =>
    isGasMetric(m) ? setGasMetric(m) : setUsdMetric(m)
  const [scale, setScale] = useState<GasFeesScale>('log')
  // The chain hovered in the table is highlighted on the chart
  const [highlightedChainId, setHighlightedChainId] = useState<string>()
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string>()

  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const summary = useChartQuery(trpc.gasFees.summary, { range: statsRange })
  const tableSummary = useChartQuery(trpc.gasFees.summary, {
    range: tableRange,
  })

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <TopCardB2D />
      </PrimaryCard>
      <PrimaryCard>
        <MiddleD2
          chains={chains}
          upgrades={upgrades}
          summary={{
            data: summary.data,
            isLoading: summary.isLoading,
            range: summary.shownInput.range,
          }}
          chart={{
            data: chart.data,
            isLoading: chart.isLoading,
            isPlaceholderData: chart.isPlaceholderData,
            range: chart.shownInput.range,
            metric: chart.shownInput.metric,
          }}
          range={range}
          setRange={setRange}
          unit={unit}
          setUnit={setUnit}
          metric={metric}
          setMetric={setMetric}
          scale={scale}
          setScale={setScale}
          highlightedChainId={highlightedChainId}
          highlightedUpgradeId={highlightedUpgradeId}
          setHighlightedUpgradeId={setHighlightedUpgradeId}
          selectedUpgradeId={selectedUpgradeId}
          setSelectedUpgradeId={setSelectedUpgradeId}
        />
      </PrimaryCard>
      <PrimaryCard>
        <TableB2
          chains={chains}
          summary={tableSummary.data}
          isLoading={tableSummary.isLoading}
          period={getPeriodLabel(tableSummary.shownInput.range)}
          rangeControl={
            <RadioGroup
              name="gasFeesTableRange"
              value={rangeToOption(tableRange, GAS_FEES_RANGE_OPTIONS)}
              onValueChange={(value) =>
                setTableRange(
                  optionToRange(
                    value as (typeof GAS_FEES_RANGE_OPTIONS)[number],
                  ),
                )
              }
            >
              {GAS_FEES_RANGE_OPTIONS.map((option) => (
                <RadioGroupItem key={option} value={option}>
                  {option === 'max' ? 'All' : RANGE_LABELS[option]}
                </RadioGroupItem>
              ))}
            </RadioGroup>
          }
          highlightedChainId={highlightedChainId}
          setHighlightedChainId={setHighlightedChainId}
        />
      </PrimaryCard>
    </div>
  )
}
