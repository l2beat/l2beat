import { useCallback, useState } from 'react'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesTipping as Tipping } from '~/server/features/gas-fees/getGasFeesTipping'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { GasFeesChart } from './GasFeesChart'
import { GasFeesComparedL2s, GasFeesStats } from './GasFeesStats'
import { GasFeesTable } from './GasFeesTable'
import { GasFeesTipping } from './GasFeesTipping'
import { GasFeesUpgrades } from './GasFeesUpgrades'
import {
  GAS_FEES_RANGE_LABELS,
  GAS_FEES_RANGE_OPTIONS,
  getPeriodLabel,
} from './metrics'
import { SPLIT, StoredUntil } from './parts'
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
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
  const [tableRange, setTableRange] = useState(initialTableRange)
  // The chain hovered in the table is highlighted on the chart
  const [highlightedChainId, setHighlightedChainId] = useState<string>()
  const [highlightedUpgradeId, setHighlightedUpgradeId] = useState<string>()
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string>()

  const summary = useChartQuery(trpc.gasFees.summary, { range: statsRange })
  const tableSummary = useChartQuery(trpc.gasFees.summary, {
    range: tableRange,
  })
  const showWholeHistory = useCallback(() => setRange(optionToRange('max')), [])

  return (
    // On mobile the sections run edge to edge, split by a line
    <div className="flex flex-col md:gap-4 [&_.primary-card]:max-md:border-divider [&_.primary-card]:max-md:border-b">
      <PrimaryCard>
        <GasFeesTipping tipping={tipping} walletIcons={walletIcons} />
      </PrimaryCard>
      <PrimaryCard>
        <div className="@container flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h2 className="font-bold text-xl md:text-2xl">Ethereum vs L2s</h2>
              <GasFeesComparedL2s chains={chains} summary={summary.data} />
            </div>
            <p className="mt-1 text-secondary text-sm">
              Where transactions happen and who collects the fees, what fees
              have cost over time, and the Ethereum upgrades along the way.
            </p>
            <StoredUntil lastDay={summary.data?.lastDay} />
          </div>
          <GasFeesStats
            chains={chains}
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
                range={range}
                setRange={setRange}
                highlightedChainId={highlightedChainId}
                highlightedUpgradeId={highlightedUpgradeId}
                selectedUpgradeId={selectedUpgradeId}
              />
            </div>
            <div className={cn(SPLIT.side, 'relative @max-3xl:h-[480px]')}>
              <div className={cn(SPLIT.sidePad, 'absolute inset-0')}>
                <GasFeesUpgrades
                  upgrades={upgrades}
                  range={range}
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
                  {GAS_FEES_RANGE_LABELS[option]}
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
