import { useCallback, useState } from 'react'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import type { GasFeesChain } from './types'
import { useUpgradeSelection } from './useUpgradeSelection'

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  initialRange: ChartRange
  /** Hovered in the table: its line stands out on the chart */
  highlightedChainId: string | undefined
}

/** The fee chart with Ethereum's upgrades flagged on it and described under it */
export function GasFeesHistory({
  chains,
  upgrades,
  initialRange,
  highlightedChainId,
}: Props) {
  const [range, setRange] = useState(initialRange)
  const selection = useUpgradeSelection()
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])
  return (
    <div className="flex flex-col gap-4">
      <GasFeesChart
        chains={chains}
        upgrades={upgrades}
        range={range}
        setRange={setRange}
        highlightedChainId={highlightedChainId}
        selection={selection}
      />
      <GasFeesUpgrades
        upgrades={upgrades}
        range={range}
        selection={selection}
        showWholeHistory={showWholeHistory}
      />
    </div>
  )
}
