import { useCallback, useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesCosts } from './GasFeesCosts'
import { GasFeesEstimator } from './GasFeesEstimator'
import { GasFeesHero } from './GasFeesHero'
import { GasFeesHowItWorks } from './GasFeesHowItWorks'
import { GasFeesLive } from './GasFeesLive'
import { GasFeesTipPayers } from './GasFeesTipPayers'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import { DEFAULT_GAS_FEES_METRIC, GAS_FEES_RANGE_OPTIONS } from './metrics'
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
  const [scale, setScale] = useState<GasFeesScale>('log')
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()
  const metric = DEFAULT_GAS_FEES_METRIC
  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <GasFeesHero />
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesLive />
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesEstimator />
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesTipPayers />
      </PrimaryCard>
      {/* The upgrades sit beside the chart, cut to its height */}
      <div className="grid grid-cols-1 md:gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <PrimaryCard>
          <GasFeesChart
            simple
            chains={chains}
            upgrades={upgrades}
            data={chart.data}
            isLoading={chart.isLoading}
            isPlaceholderData={chart.isPlaceholderData}
            shownMetric={metric}
            metric={metric}
            setMetric={() => {}}
            scale={scale}
            setScale={setScale}
            highlightedChainId={undefined}
            highlightedUpgradeId={highlightedUpgradeId}
            unit="usd"
            setUnit={() => {}}
            rangeControl={
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
        </PrimaryCard>
        <PrimaryCard className="relative max-lg:h-[480px]">
          <div className="absolute inset-0 p-4 md:px-6 md:py-5">
            <GasFeesUpgrades
              upgrades={upgrades}
              metric={metric}
              range={chart.shownInput.range}
              highlightedUpgradeId={highlightedUpgradeId}
              setHighlightedUpgradeId={setHighlightedUpgradeId}
              showWholeHistory={showWholeHistory}
            />
          </div>
        </PrimaryCard>
      </div>
      <PrimaryCard>
        <GasFeesCosts chains={chains} />
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesHowItWorks />
      </PrimaryCard>
      <p className="px-4 pb-4 text-2xs text-secondary md:px-0">
        Mock for review. Our tips and the wallets' suggestions are live: Ambire
        is computed from its public code, the others are read from their fee
        services. Everything else is replayed against Flashbots mempool data,
        not published live. L2 costs are rough: 30 sampled blocks per chain.
      </p>
    </div>
  )
}
