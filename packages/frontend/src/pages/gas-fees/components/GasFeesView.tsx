import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { GasFeesMetric } from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesRecent } from './GasFeesRecent'
import { GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import {
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
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
  const [metric, setMetric] = useState<GasFeesMetric>(DEFAULT_GAS_FEES_METRIC)
  const [scale, setScale] = useState<GasFeesScale>('log')
  // One chain is in focus across the page: hovered in the heatmap, the focus
  // chart or the table, or pinned from the heatmap
  const [hoveredChainId, setHoveredChainId] = useState<string>()
  const [pinnedChainId, setPinnedChainId] = useState<string>()
  const highlightedChainId = hoveredChainId ?? pinnedChainId
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()

  const recent = useQuery(trpc.gasFees.recent.queryOptions())
  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const summary = useChartQuery(trpc.gasFees.summary, { range })
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])

  return (
    // Three cards, read top to bottom: today, history, and how chains compare.
    // On mobile they run edge to edge, split by a line.
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <GasFeesRecent
        chains={chains}
        data={recent.data}
        hoveredChainId={hoveredChainId}
        setHoveredChainId={setHoveredChainId}
        pinnedChainId={pinnedChainId}
        setPinnedChainId={setPinnedChainId}
      />
      <PrimaryCard>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <GasFeesChart
            chains={chains}
            upgrades={upgrades}
            data={chart.data}
            isLoading={chart.isLoading}
            isPlaceholderData={chart.isPlaceholderData}
            shownMetric={chart.shownInput.metric}
            metric={metric}
            setMetric={setMetric}
            scale={scale}
            setScale={setScale}
            highlightedChainId={highlightedChainId}
            highlightedUpgradeId={highlightedUpgradeId}
            headerRight={
              <ChartRangeControls
                name="gasFeesRange"
                value={range}
                setValue={setRange}
                options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
                  value,
                  label: RANGE_LABELS[value],
                }))}
              />
            }
          />
          {/* The timeline takes the chart's height and scrolls inside */}
          <div className="relative border-divider max-lg:h-[420px] max-lg:border-t max-lg:pt-5 lg:border-l">
            <GasFeesUpgrades
              upgrades={upgrades}
              metric={metric}
              range={chart.shownInput.range}
              highlightedUpgradeId={highlightedUpgradeId}
              setHighlightedUpgradeId={setHighlightedUpgradeId}
              showWholeHistory={showWholeHistory}
            />
          </div>
        </div>
        <div className="mt-5 border-divider border-t pt-5">
          <GasFeesStats
            stats={summary.data?.stats}
            range={summary.shownInput.range}
            isLoading={summary.isLoading}
          />
        </div>
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesTable
          chains={chains}
          summary={summary.data}
          isLoading={summary.isLoading}
          period={getPeriodLabel(summary.shownInput.range)}
          highlightedChainId={highlightedChainId}
          setHighlightedChainId={setHoveredChainId}
        />
      </PrimaryCard>
    </div>
  )
}
