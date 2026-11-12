import { useMemo } from 'react'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import {
  formatEthCompact,
  formatEthPrecise,
  formatInteger,
  formatPercent,
  formatSignedEth,
  formatUsd,
} from '../format'
import { useEthereumHead } from '../live/EthereumHeadContext'
import { findSection } from '../risk'
import { useHistory } from '../state/history'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { CadenceMark, Part, Section, Stat } from '../ui/Section'
import { Fig, Story } from '../ui/Story'
import { lastTwoWeeks, sumOf, type Weeks } from '../weekly'

const SUPPLY_METRICS: Metric[] = [
  {
    id: 'supply',
    label: 'Supply',
    pick: (p) => p.supplyEth,
    today: (_t, _block, totals) => totals.supplyEth,
    format: formatEthCompact,
    kind: 'snapshot',
    baseline: 'auto',
  },
  {
    id: 'burned',
    label: 'Burned per day',
    pick: (p) => p.burnedEth,
    today: (t) => t.burnedEth,
    format: formatEthCompact,
    kind: 'bucket',
    todayNote: 'Since 00:00 UTC: the day is not over, so it will end higher.',
  },
  {
    id: 'issued',
    label: 'Issued per day',
    pick: (p) => p.issuedEth,
    today: (t) => t.issuedEth,
    format: formatEthCompact,
    kind: 'bucket',
    todayNote: 'Since 00:00 UTC: the day is not over, so it will end higher.',
  },
  {
    id: 'staked',
    label: 'Staked',
    pick: (p) => p.stakedEth,
    today: (_t, _block, totals) => totals.stakedEth,
    format: formatEthCompact,
    kind: 'snapshot',
    baseline: 'auto',
  },
]

/**
 * ETH, the asset: how much exists, what today has burned and issued, and what
 * is staked to secure the chain, liquid staking included
 */
export function Economics({
  order,
  entry,
}: {
  order: number
  entry: EthereumProjectPageEntry
}) {
  const head = useEthereumHead()
  const { today, supplyEth, stakedEth: staked } = head
  const history = useHistory()
  const weeks = useMemo(() => lastTwoWeeks(history), [history])
  const net = today && today.issuedEth - today.burnedEth
  const stakedShare =
    staked !== undefined && supplyEth ? staked / supplyEth : undefined
  const liquidStaking = findSection(entry, 'LiquidStakingSection')

  return (
    <Section
      id="economics"
      order={order}
      title="ETH economics"
      story={<EconomicsStory weeks={weeks} />}
      lede="Every block burns its base fees and blob fees, and the beacon chain issues new ETH to validators. Which one wins sets whether supply grows or shrinks. Staking moves once per epoch, every 32 slots."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="flex flex-col gap-7">
          <Stat
            size="lg"
            label="Supply"
            cadence="block"
            value={
              <Rolling
                value={supplyEth}
                format={formatEthPrecise}
                placeholder="w-[12ch]"
              />
            }
            sub="At the newest block"
          />
          <BurnVsIssue
            burned={today?.burnedEth}
            issued={today?.issuedEth}
            net={net}
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Stat
              label="Staked"
              cadence="epoch"
              value={<Rolling value={staked} format={formatEthCompact} />}
              sub={
                stakedShare !== undefined &&
                `${formatPercent(stakedShare)} of supply`
              }
            />
            <Stat
              label="Active validators"
              cadence="epoch"
              value={
                <Rolling value={head.activeValidators} format={formatInteger} />
              }
              sub="Latest epoch"
            />
            {entry.header.economicSecurity !== undefined && (
              <Stat
                className="col-span-2"
                label="Economic security"
                cadence="day"
                value={formatUsd(entry.header.economicSecurity)}
                sub="What is slashable in a data withholding attack: two-thirds of the validating stake"
              />
            )}
          </div>
        </div>
        <Part title="History">
          <HistoryChart
            metrics={SUPPLY_METRICS}
            defaultRange="all"
            height={260}
          />
        </Part>
      </div>
      {liquidStaking && (
        <div className="mt-10">
          <ProjectDetails
            items={[liquidStaking]}
            nested
            parentSection={String(order)}
          />
        </div>
      )}
    </Section>
  )
}

function EconomicsStory({ weeks }: { weeks: Weeks | undefined }) {
  if (!weeks) return null
  const { current } = weeks
  const issued = sumOf(current, (p) => p.issuedEth)
  const burned = sumOf(current, (p) => p.burnedEth)
  const net = issued - burned
  const first = current[0]
  const last = current.at(-1)
  if (!first || !last) return null
  const supplyBefore = first.supplyEth - (first.issuedEth - first.burnedEth)
  const yearly = (net / supplyBefore) * (365 / current.length)
  const stakedChange =
    last.stakedEth - (weeks.previous.at(-1)?.stakedEth ?? last.stakedEth)
  return (
    <Story weeks={weeks}>
      Ethereum issued <Fig>{formatEthCompact(issued)}</Fig> and burned{' '}
      <Fig>{formatEthCompact(burned)}</Fig>, so supply{' '}
      {net >= 0 ? 'grew' : 'shrank'} by{' '}
      <Fig>{formatEthCompact(Math.abs(net))}</Fig>:{' '}
      <Fig>{formatPercent(Math.abs(yearly))}</Fig> a year at that pace. Staked
      ETH {stakedChange >= 0 ? 'rose' : 'fell'} by{' '}
      <Fig>{formatEthCompact(Math.abs(stakedChange))}</Fig> to{' '}
      <Fig>{formatEthCompact(last.stakedEth)}</Fig>,{' '}
      {formatPercent(last.stakedEth / last.supplyEth)} of supply.
    </Story>
  )
}

/** Today's burn against today's issuance, as two bars on one scale */
function BurnVsIssue({
  burned,
  issued,
  net,
}: {
  burned: number | undefined
  issued: number | undefined
  net: number | undefined
}) {
  const max = Math.max(burned ?? 0, issued ?? 0, 1e-9)
  const rows = [
    { label: 'Issued', value: issued, className: 'bg-chart-teal' },
    { label: 'Burned', value: burned, className: 'bg-brand' },
  ]
  return (
    <div className="rounded-lg bg-surface-secondary/60 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="font-medium text-label-value-13 text-secondary">
          Today so far
        </span>
        <CadenceMark cadence="block" />
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-label-value-14"
          >
            <span className="text-secondary">{r.label}</span>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-primary">
              <div
                className={cn(
                  'h-full origin-left rounded-full transition-transform duration-500 ease-out',
                  r.className,
                )}
                style={{ transform: `scaleX(${(r.value ?? 0) / max})` }}
              />
            </div>
            <span className="whitespace-nowrap text-right font-medium">
              <Rolling value={r.value} format={formatEthCompact} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between border-divider border-t pt-3">
        <span className="text-label-value-13 text-secondary">
          Net change to supply
        </span>
        <span className="font-bold text-label-value-16">
          <Rolling value={net} format={formatSignedEth} />
        </span>
      </div>
    </div>
  )
}
