import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
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
import { GasFeesChart } from './GasFeesChart'
import { GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import type { RecentHover } from './recent/GasFeesRecentStrip'
import { GasFeesRecentTooltip } from './recent/GasFeesRecentTooltip'
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
}

export function GasFeesView({ chains, upgrades, initialRange }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
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
  // One chain is in focus across the page: hovered in the table or its
  // last 24 hours
  const [hoveredChainId, setHoveredChainId] = useState<string>()
  const [recentHover, setRecentHover] = useState<RecentHover>()
  const highlightedChainId = recentHover?.chainId ?? hoveredChainId
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()

  const recent = useQuery(trpc.gasFees.recent.queryOptions())
  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const summary = useChartQuery(trpc.gasFees.summary, { range })
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])
  const shownMetric = chart.shownInput.metric

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <div className="md:-mt-2 flex justify-end max-md:px-4 max-md:pt-3">
        <RadioGroup
          name="gasFeesUnit"
          value={unit}
          onValueChange={(value) => setUnit(value as GasFeesUnit)}
        >
          <RadioGroupItem value="usd">USD</RadioGroupItem>
          <RadioGroupItem value="gas">Gas price</RadioGroupItem>
        </RadioGroup>
      </div>
      {/* History: the stats and the chart on the left; the range, which
          drives them and the table, heads the column on the right, with the
          upgrades below it, cut to the left column's height */}
      <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex justify-end max-md:px-4 max-md:py-3 lg:col-start-2 lg:row-start-1">
          <ChartRangeControls
            name="gasFeesRange"
            value={range}
            setValue={setRange}
            options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
              value,
              label: RANGE_LABELS[value],
            }))}
          />
        </div>
        <div className="flex min-w-0 flex-col md:gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <PrimaryCard>
            <GasFeesStats
              stats={summary.data?.stats}
              range={summary.shownInput.range}
              isLoading={summary.isLoading}
              unit={unit}
            />
          </PrimaryCard>
          <PrimaryCard>
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
              unit={unit}
            />
          </PrimaryCard>
        </div>
        <PrimaryCard className="relative max-lg:h-[480px] lg:col-start-2 lg:row-start-2">
          <div className="absolute inset-0 p-4 md:px-6 md:py-5">
            <GasFeesUpgrades
              upgrades={upgrades}
              metric={isGasMetric(shownMetric) ? undefined : shownMetric}
              range={chart.shownInput.range}
              highlightedUpgradeId={highlightedUpgradeId}
              setHighlightedUpgradeId={setHighlightedUpgradeId}
              showWholeHistory={showWholeHistory}
            />
          </div>
        </PrimaryCard>
      </div>
      <PrimaryCard>
        <GasFeesTable
          chains={chains}
          summary={summary.data}
          isLoading={summary.isLoading}
          period={getPeriodLabel(summary.shownInput.range)}
          unit={unit}
          recent={{
            data: recent.data,
            hover: recentHover,
            setHover: setRecentHover,
          }}
          highlightedChainId={highlightedChainId}
          setHighlightedChainId={setHoveredChainId}
        />
      </PrimaryCard>
      <GasFeesRecentTooltip
        hover={recentHover}
        setHover={setRecentHover}
        chains={chains}
        data={recent.data}
        unit={unit}
      />
    </div>
  )
}
