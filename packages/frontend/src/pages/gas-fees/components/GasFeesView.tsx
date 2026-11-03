import { useState } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { GasFeesMetric } from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import { DEFAULT_GAS_FEES_METRIC } from './metrics'
import type { GasFeesChain } from './types'

export type GasFeesScale = 'log' | 'lin'

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
  // Shared so a table row or a legend hover finds its line in the chart
  const [highlightedChainId, setHighlightedChainId] = useState<string>()
  const [markedUpgradeId, setMarkedUpgradeId] = useState<string>()

  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const summary = useChartQuery(trpc.gasFees.summary, { range })
  const markedUpgrade = upgrades.find((u) => u.id === markedUpgradeId)

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <div className="grid md:gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col md:gap-4">
          <PrimaryCard>
            <GasFeesStats
              stats={summary.data?.stats}
              range={summary.shownInput.range}
              isLoading={summary.isLoading}
            />
          </PrimaryCard>
          <PrimaryCard>
            <GasFeesChart
              chains={chains}
              upgrades={upgrades}
              data={chart.data}
              isLoading={chart.isLoading}
              isPlaceholderData={chart.isPlaceholderData}
              shownMetric={chart.shownInput.metric}
              range={range}
              setRange={setRange}
              metric={metric}
              setMetric={setMetric}
              scale={scale}
              setScale={setScale}
              highlightedChainId={highlightedChainId}
              markedUpgrade={markedUpgrade}
            />
          </PrimaryCard>
        </div>
        {/* Matches the left column's height and scrolls inside, so the
            timeline never pushes the table down */}
        <PrimaryCard className="relative max-lg:min-h-[480px]">
          <GasFeesUpgrades
            upgrades={upgrades}
            metric={metric}
            range={chart.shownInput.range}
            markedUpgradeId={markedUpgradeId}
            setMarkedUpgradeId={setMarkedUpgradeId}
            showWholeHistory={() => setRange(optionToRange('max'))}
          />
        </PrimaryCard>
      </div>
      <PrimaryCard>
        <GasFeesTable
          chains={chains}
          summary={summary.data}
          range={summary.shownInput.range}
          isLoading={summary.isLoading}
          setHighlightedChainId={setHighlightedChainId}
        />
      </PrimaryCard>
    </div>
  )
}
