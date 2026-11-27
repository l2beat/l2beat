import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { ProjectIconList } from '~/components/ProjectIconList'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { GasFeesStats } from '~/server/features/gas-fees/daily/getGasFeesStats'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import type { GasFeesUpgrades } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import type { ChartRange } from '~/utils/range/range'
import { compareCosts } from '../../utils/compare'
import { formatDate, formatMissingDays, formatShare } from '../../utils/format'
import { Eyebrow } from '../Eyebrow'
import { CostTracks } from './CostTracks'
import { FeeChart } from './FeeChart'
import { FlowBars } from './FlowBars'

export function CompareCard({
  chains,
  stats,
  upgrades,
  initialRange,
}: {
  chains: GasFeesChain[]
  stats: GasFeesStats
  upgrades: GasFeesUpgrades
  initialRange: ChartRange
}) {
  const l2s = chains.filter((c) => c.id !== 'ethereum')
  // With one side missing, every figure here would read as 0% or 100%
  const hasBothSides = stats.txCount.l2s > 0 && stats.txCount.ethereum > 0
  const transfer =
    stats.latestErc20 &&
    compareCosts(stats.latestErc20.l2Median, stats.latestErc20.ethereum)
  const nameOf = (id: string) => chains.find((c) => c.id === id)?.name ?? id

  return (
    <PrimaryCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <Eyebrow>
          Ethereum vs {stats.l2Count} L2s{DOT_SEPARATOR}past year
        </Eyebrow>
        <ProjectIconList
          title="L2s"
          projects={l2s.map((c) => ({
            id: c.id,
            name: c.name,
            iconUrl: c.iconUrl,
            href: c.href,
          }))}
        />
      </div>
      {!hasBothSides && (
        <p className="text-secondary text-sm">
          No fees stored for both Ethereum and the L2s in the past year.
        </p>
      )}
      {hasBothSides && (
        <h2 className="font-bold text-2xl leading-tight md:text-3xl">
          L2s process{' '}
          <span className="text-brand-deep">
            {formatShare(stats.l2Share.txCount)}
          </span>{' '}
          of transactions and collect{' '}
          <span className="text-brand-deep">
            {formatShare(stats.l2Share.feesUsd)}
          </span>{' '}
          of the fees.{' '}
          {transfer && (
            <span className="lg:block">
              An ERC-20 transfer there costs{' '}
              <span className="text-brand-deep">{transfer.ratio}</span>{' '}
              {transfer.cheaper ? 'less' : 'more'}.
            </span>
          )}
        </h2>
      )}
      <div className="flex flex-col gap-0.5 text-2xs text-secondary">
        {stats.staleSince !== undefined && (
          <p className="text-warning">
            Fees are stored up to {formatDate(stats.staleSince)}.
          </p>
        )}
        {stats.missingDays.length > 0 && (
          <p>
            {formatMissingDays(
              stats.missingDays.map((m) => ({
                name: nameOf(m.chain),
                days: m.days,
              })),
            )}
          </p>
        )}
      </div>
      <HorizontalSeparator />
      {hasBothSides && (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-8">
            <div className="lg:border-divider lg:border-r lg:pr-8">
              <FlowBars stats={stats} />
            </div>
            <CostTracks stats={stats} />
          </div>
          <HorizontalSeparator />
        </>
      )}
      <FeeChart
        chains={chains}
        upgrades={upgrades}
        initialRange={initialRange}
      />
    </PrimaryCard>
  )
}
