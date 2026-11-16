import { useCallback, useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
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
import { cn } from '~/utils/cn'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesComparedL2s, GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesTipping } from './GasFeesTipping'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import { SPLIT } from './parts'
import type { GasFeesChain } from './types'

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
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])
  const shownMetric = chart.shownInput.metric

  const rangeControls = (
    <ChartRangeControls
      name="gasFeesRange"
      value={range}
      setValue={setRange}
      options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
        value,
        label: RANGE_LABELS[value],
      }))}
    />
  )

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <GasFeesTipping />
      </PrimaryCard>
      {/* The split, the fee history and the upgrades behind it, as one section */}
      <PrimaryCard>
        <div className="@container flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-xl md:text-2xl">Ethereum vs L2s</h2>
              <GasFeesComparedL2s chains={chains} summary={summary.data} />
            </div>
            <p className="mt-1 text-secondary text-sm">
              Where transactions happen and who collects the fees, what fees
              have cost over time, and the Ethereum upgrades that brought them
              down.
            </p>
          </div>
          <GasFeesStats
            summary={summary.data}
            range={summary.shownInput.range}
            isLoading={summary.isLoading}
          />
          {/* The upgrades sit beside the chart, cut to its height, in the
              same columns as the stats above */}
          <div className={cn(SPLIT.grid, 'border-divider border-t pt-6')}>
            <div className={SPLIT.main}>
              <GasFeesChart
                chains={chains}
                upgrades={upgrades}
                data={chart.data}
                isLoading={chart.isLoading}
                isPlaceholderData={chart.isPlaceholderData}
                shownMetric={shownMetric}
                metric={metric}
                setMetric={setMetric}
                scale={scale}
                setScale={setScale}
                highlightedChainId={highlightedChainId}
                highlightedUpgradeId={highlightedUpgradeId}
                selectedUpgradeId={selectedUpgradeId}
                unit={unit}
                setUnit={setUnit}
                rangeControl={rangeControls}
              />
            </div>
            <div className={cn(SPLIT.side, 'relative @max-3xl:h-[480px]')}>
              <div className={cn(SPLIT.sidePad, 'absolute inset-0')}>
                <GasFeesUpgrades
                  upgrades={upgrades}
                  range={chart.shownInput.range}
                  highlightedUpgradeId={highlightedUpgradeId}
                  setHighlightedUpgradeId={setHighlightedUpgradeId}
                  selectedUpgradeId={selectedUpgradeId}
                  setSelectedUpgradeId={setSelectedUpgradeId}
                  showWholeHistory={showWholeHistory}
                />
              </div>
            </div>
          </div>
        </div>
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesTable
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
