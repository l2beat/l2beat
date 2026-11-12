import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import {
  formatEth,
  formatEthCompact,
  formatEthPrecise,
  formatInteger,
  formatPercent,
  formatSignedEth,
  formatUsd,
} from '../format'
import { useAnchor } from '../state/anchor'
import { HistoryChart, type Metric } from '../ui/HistoryChart'
import { Rolling } from '../ui/Rolling'
import { CadenceMark, Part, Section, Stat } from '../ui/Section'

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
 * ETH, the asset: how much exists as of the anchored block, what today has
 * burned and issued up to it, and what is staked to secure the chain
 */
export function Economics({
  order,
  entry,
}: {
  order: number
  entry: EthereumProjectPageEntry
}) {
  const { block, head, today, supplyEth } = useAnchor()
  const net = today && today.issuedEth - today.burnedEth
  const staked = head.stakedEth
  const stakedShare =
    staked !== undefined && supplyEth ? staked / supplyEth : undefined

  return (
    <Section
      id="economics"
      order={order}
      title="ETH economics"
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
            sub="As of the block on show: the head's supply, less what every later block changed"
          />
          <BurnVsIssue
            burned={today?.burnedEth}
            issued={today?.issuedEth}
            net={net}
          />
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <Stat
              label="This block burned"
              cadence="block"
              value={<Rolling value={block?.burnedEth} format={formatEth} />}
            />
            <Stat
              label="This block issued"
              cadence="block"
              value={<Rolling value={block?.issuedEth} format={formatEth} />}
            />
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
              sub="Latest epoch: not rewound with the block"
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
    </Section>
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
          Today so far, up to this block
        </span>
        <CadenceMark cadence="block" />
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="grid grid-cols-[4.5rem_1fr_8ch] items-center gap-3 text-label-value-14"
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
            <span className="text-right font-medium">
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
