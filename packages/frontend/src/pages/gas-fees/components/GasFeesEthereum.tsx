import { useState } from 'react'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  type GasFeesGasMetric,
  type GasFeesMetric,
  type GasFeesUnit,
  type GasFeesUsdMetric,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesLive } from './GasFeesLive'
import { GasFeesMethodology } from './GasFeesMethodology'
import { GasFeesPriceOfSpeed } from './GasFeesPriceOfSpeed'
import { GasFeesTipHistory } from './GasFeesTipHistory'
import { GasFeesTipPayers } from './GasFeesTipPayers'
import { GasFeesTipsSummary } from './GasFeesTipping'
import type { GasFeesScale } from './GasFeesView'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_RANGE_OPTIONS,
} from './metrics'
import type { GasFeesChain } from './types'

const RANGE_LABELS: Record<(typeof GAS_FEES_RANGE_OPTIONS)[number], string> = {
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  max: 'Max',
}

interface Props {
  ethereum: GasFeesChain
  upgrades: GasFeesUpgrade[]
}

/**
 * The Ethereum half of /gas-fees for Ethereum's own page: its fee history,
 * then tips now, what tips cost, and the estimator's track record
 */
export function GasFeesEthereum({ ethereum, upgrades }: Props) {
  return (
    <div className="flex flex-col gap-6">
      <FeeHistory ethereum={ethereum} upgrades={upgrades} />
      <Divided>
        <GasFeesLive estimateAction={<GasFeesMethodology />} showBlocks />
      </Divided>
      <Divided>
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
          <GasFeesTipsSummary />
          <div className="border-divider max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-10">
            <GasFeesTipPayers />
          </div>
        </div>
      </Divided>
      <Divided>
        <GasFeesPriceOfSpeed />
      </Divided>
      <Divided>
        <GasFeesTipHistory />
      </Divided>
    </div>
  )
}

function Divided({ children }: { children: React.ReactNode }) {
  return <div className="border-divider border-t pt-6">{children}</div>
}

function FeeHistory({ ethereum, upgrades }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState(() => optionToRange('max'))
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
  const chart = useChartQuery(trpc.gasFees.chart, { range, metric })

  return (
    <GasFeesChart
      ethereumOnly
      // The server lists Ethereum first, so its values line up
      chains={[ethereum]}
      upgrades={upgrades}
      data={chart.data}
      isLoading={chart.isLoading}
      isPlaceholderData={chart.isPlaceholderData}
      shownMetric={chart.shownInput.metric}
      metric={metric}
      setMetric={setMetric}
      scale={scale}
      setScale={setScale}
      highlightedChainId={undefined}
      highlightedUpgradeId={undefined}
      unit={unit}
      setUnit={setUnit}
      rangeControl={
        <ChartRangeControls
          name="ethereumGasFeesRange"
          value={range}
          setValue={setRange}
          options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
            value,
            label: RANGE_LABELS[value],
          }))}
        />
      }
    />
  )
}
