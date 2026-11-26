import { useState } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesTipping as Tipping } from '~/server/features/gas-fees/getGasFeesTipping'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import type { ChartRange } from '~/utils/range/range'
import { GasFeesHistory } from './GasFeesHistory'
import { GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesTipping } from './GasFeesTipping'
import type { GasFeesChain, GasFeesWalletIcons } from './types'

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  tipping: Tipping
  walletIcons: GasFeesWalletIcons
  /** The chart opens on everything stored, the table on recent fees */
  initialRange: ChartRange
  initialTableRange: ChartRange
  /** The past year, fixed: the stats don't follow the chart's range */
  statsRange: ChartRange
}

export function GasFeesView({
  chains,
  upgrades,
  tipping,
  walletIcons,
  initialRange,
  initialTableRange,
  statsRange,
}: Props) {
  // The chain hovered in the table is highlighted on the chart
  const [highlightedChainId, setHighlightedChainId] = useState<string>()

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <GasFeesTipping tipping={tipping} walletIcons={walletIcons} />
      </PrimaryCard>
      <PrimaryCard>
        <div className="@container flex flex-col gap-6">
          <GasFeesStats chains={chains} range={statsRange} />
          {/* The fee history across the whole card */}
          <div className="border-divider border-t pt-6">
            <GasFeesHistory
              chains={chains}
              upgrades={upgrades}
              initialRange={initialRange}
              highlightedChainId={highlightedChainId}
            />
          </div>
        </div>
      </PrimaryCard>
      <PrimaryCard>
        <GasFeesTable
          chains={chains}
          initialRange={initialTableRange}
          highlightedChainId={highlightedChainId}
          setHighlightedChainId={setHighlightedChainId}
        />
      </PrimaryCard>
    </div>
  )
}
