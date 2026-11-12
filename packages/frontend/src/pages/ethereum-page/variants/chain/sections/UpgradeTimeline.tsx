import { type ReactNode, useMemo } from 'react'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { UPGRADES } from '../../../live/simulatedHistory'
import {
  formatBlobsPerBlock,
  formatBlockNumber,
  formatEth,
  formatUsd,
} from '../format'
import { useAnchor } from '../state/anchor'
import { useHistory } from '../state/history'
import { useUpgradeFocus } from '../state/upgradeFocus'
import { Rolling } from '../ui/Rolling'
import {
  type Change,
  change,
  eipUrl,
  type Measure,
  type Stop,
  size,
  UPGRADE_EIPS,
  upgradeStops,
  WINDOW_DAYS,
} from '../upgradeStory'

const TRANSFER_GAS = 21_000

/**
 * Ethereum's recent history as a chain of forks: each upgrade is a stop where
 * the old rules branch off and dead-end, with what changed, a claim the data
 * makes about it, and the 60 days around it. It ends on today, live.
 */
export function UpgradeTimeline() {
  const history = useHistory()
  const stops = useMemo(() => upgradeStops(history, UPGRADES), [history])
  const last = stops.at(-1)

  return (
    <div>
      <div className="relative">
        <ChainLine />
        <ol className="relative grid xl:grid-cols-5">
          {stops.map((stop) => (
            <UpgradeStop key={stop.upgrade.name} stop={stop} />
          ))}
          {last && <TodayStop last={last} />}
        </ol>
      </div>
      <Methodology stops={stops} />
    </div>
  )
}

/** The chain the stops sit on: down the side on phones, across on wide screens */
function ChainLine() {
  return (
    <div
      aria-hidden
      className="absolute top-3 bottom-0 left-[11px] w-0.5 bg-linear-to-b from-primary/30 to-brand/60 xl:top-[21px] xl:right-0 xl:bottom-auto xl:left-0 xl:h-0.5 xl:w-auto xl:bg-linear-to-r"
    />
  )
}

function StopFrame({
  node,
  children,
  name,
}: {
  node: ReactNode
  children: ReactNode
  name?: string
}) {
  const { focused, focus } = useUpgradeFocus()
  return (
    <li
      tabIndex={name ? 0 : undefined}
      onMouseEnter={name ? () => focus(name) : undefined}
      onMouseLeave={name ? () => focus(undefined) : undefined}
      onFocus={name ? () => focus(name) : undefined}
      onBlur={name ? () => focus(undefined) : undefined}
      data-focused={name !== undefined && focused === name}
      className="group/stop relative rounded-xl pb-10 pl-12 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand xl:pt-14 xl:pr-5 xl:pb-2 xl:pl-0"
    >
      <div className="absolute top-0 left-0">{node}</div>
      {children}
    </li>
  )
}

function UpgradeStop({ stop }: { stop: Stop }) {
  const { upgrade } = stop
  const eips = UPGRADE_EIPS[upgrade.name] ?? []
  return (
    <StopFrame node={<ForkNode />} name={upgrade.name}>
      <time className="block text-label-value-12 text-secondary tabular-nums">
        {formatTimestamp(upgrade.timestamp)}
      </time>
      <h4 className="mt-1.5 font-bold text-heading-18 transition-colors group-data-[focused=true]/stop:text-chart-ethereum">
        {upgrade.name}
      </h4>
      <p className="mt-1 text-paragraph-13 text-secondary">{upgrade.summary}</p>
      <p className="mt-3 max-w-[46ch] font-bold text-paragraph-15 leading-snug">
        {stop.headline}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <Spark
          label="Sending ETH"
          measure={stop.transferEth}
          format={formatEth}
          scale="log"
          note={usdNote(stop.transferUsd)}
        />
        <Spark
          label="Blobs per block"
          measure={stop.blobs}
          format={formatBlobsPerBlock}
          scale="linear"
        />
      </div>
      {eips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {eips.map((eip) => (
            <li key={eip.number}>
              <a
                href={eipUrl(eip.number)}
                title={eip.title}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-divider px-1.5 py-0.5 font-medium text-label-value-12 text-link tabular-nums hover:border-link"
              >
                EIP-{eip.number}
              </a>
            </li>
          ))}
        </ul>
      )}
    </StopFrame>
  )
}

/**
 * The 60 days around an upgrade: each day faint, and the two 30-day medians
 * as bold steps either side of the fork, so the change reads as a drop or a
 * climb rather than two numbers to compare
 */
function Spark({
  label,
  measure,
  format,
  scale,
  note,
}: {
  label: string
  measure: Measure
  format: (v: number) => string
  scale: 'linear' | 'log'
  note?: string
}) {
  const { days, before, after, forkIndex } = measure
  const values = [...days.map((d) => d.v), before ?? 0, after ?? 0].filter(
    (v) => scale === 'linear' || v > 0,
  )
  const lo = scale === 'log' ? Math.min(...values) : 0
  const hi = Math.max(...values, 1e-12)
  const y = (v: number) => {
    const share =
      scale === 'log'
        ? (Math.log(Math.max(v, lo)) - Math.log(lo)) /
          Math.max(1e-9, Math.log(hi) - Math.log(lo))
        : v / hi
    return 36 - share * 32
  }
  const x = (i: number) => (i / Math.max(1, days.length - 1)) * 200
  const mid = x(forkIndex - 0.5)
  const line = days
    .map(
      (d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`,
    )
    .join('')
  return (
    <div>
      <div className="mb-1 text-label-value-12 text-secondary">{label}</div>
      <svg
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        className="h-10 w-full overflow-visible"
        role="img"
        aria-label={`${label}: ${before !== undefined ? format(before) : 'no data'} before, ${after !== undefined ? format(after) : 'no data'} after`}
      >
        <line
          x1={mid}
          x2={mid}
          y1={0}
          y2={40}
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
          className="stroke-primary/40"
        />
        <path
          d={line}
          fill="none"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          className="stroke-secondary/50"
        />
        {before !== undefined && (
          <line
            x1={0}
            x2={mid - 3}
            y1={y(before)}
            y2={y(before)}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-primary/70"
          />
        )}
        {after !== undefined && (
          <line
            x1={mid + 3}
            x2={200}
            y1={y(after)}
            y2={y(after)}
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="stroke-chart-ethereum"
          />
        )}
      </svg>
      <div className="mt-1 text-label-value-13 tabular-nums">
        <span className="text-secondary">
          {before !== undefined ? format(before) : 'n/a'}
        </span>
        <span className="px-1 text-secondary">to</span>
        <span className="font-bold">
          {after !== undefined ? format(after) : 'not yet'}
        </span>
      </div>
      {note && (
        <div className="mt-0.5 text-label-value-12 text-secondary">{note}</div>
      )}
    </div>
  )
}

function usdNote(usd: Measure) {
  if (usd.before === undefined || usd.after === undefined) return undefined
  return `${formatUsd(usd.before)} to ${formatUsd(usd.after)} at each day's ETH price`
}

/**
 * The end of the line: today so far, as of the block on show, against the
 * last upgrade's first 30 days. It moves with every block.
 */
function TodayStop({ last }: { last: Stop }) {
  const { today, block, isLive } = useAnchor()
  const fee =
    today && today.gasUsed > 0
      ? ((today.burnedEth * 1e9) / today.gasUsed) * (TRANSFER_GAS / 1e9)
      : undefined
  const blobs =
    today && today.blocks > 0 ? today.blobs / today.blocks : undefined
  const name = last.upgrade.name
  const claim = todayClaim(
    change({ before: last.transferEth.after, after: fee }),
    change({ before: last.blobs.after, after: blobs }),
  )

  return (
    <StopFrame node={<LiveNode isLive={isLive} />}>
      <div className="text-label-value-12 text-secondary tabular-nums">
        {isLive ? 'Today so far' : 'Today, up to'}{' '}
        {block?.number !== undefined && formatBlockNumber(block.number)}
      </div>
      <h4 className="mt-1.5 font-bold text-brand-deep text-heading-18">Now</h4>
      <p className="mt-1 text-paragraph-13 text-secondary">
        Against {name}&apos;s first 30 days
      </p>
      <p className="mt-3 min-h-[3lh] max-w-[46ch] font-bold text-paragraph-15 leading-snug">
        {claim}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <BarPair
          label="Sending ETH"
          then={last.transferEth.after}
          now={fee}
          format={formatEth}
          thenLabel={`${name} month`}
        />
        <BarPair
          label="Blobs per block"
          then={last.blobs.after}
          now={blobs}
          format={formatBlobsPerBlock}
          thenLabel={`${name} month`}
        />
      </div>
      <p className="mt-3 text-label-value-12 text-secondary leading-snug">
        Today is a gas-weighted average of the day so far, not a median.
      </p>
    </StopFrame>
  )
}

function todayClaim(fee: Change, blobs: Change) {
  if (fee.kind === 'unknown' || blobs.kind === 'unknown') {
    return 'Waiting for today’s first blocks'
  }
  const feeText =
    fee.kind === 'up' || fee.kind === 'down'
      ? `sending ETH is ${size(fee.ratio, 'dearer', 'cheaper')}`
      : 'sending ETH costs about the same'
  const blobText =
    blobs.kind === 'up' || blobs.kind === 'down'
      ? `blocks carry ${size(blobs.ratio, 'more', 'fewer')} blobs`
      : 'blob use is level'
  return `${feeText.charAt(0).toUpperCase()}${feeText.slice(1)}, and ${blobText}.`
}

/** The last upgrade's month against today so far, on one scale; today's bar ticks with each block */
function BarPair({
  label,
  then,
  now,
  format,
  thenLabel,
}: {
  label: string
  then: number | undefined
  now: number | undefined
  format: (v: number) => string
  thenLabel: string
}) {
  const max = Math.max(then ?? 0, now ?? 0, 1e-12)
  const rows = [
    { key: 'then', label: thenLabel, value: then, live: false },
    { key: 'now', label: 'Today', value: now, live: true },
  ]
  return (
    <div>
      <div className="mb-1.5 text-label-value-12 text-secondary">{label}</div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => (
          <div
            key={r.key}
            className="grid grid-cols-[4.75rem_1fr] items-center gap-2"
          >
            <span className="truncate text-label-value-12 text-secondary">
              {r.label}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-secondary">
                <div
                  className={cn(
                    'h-full origin-left rounded-full transition-transform duration-500 ease-out',
                    r.live ? 'bg-brand' : 'bg-chart-ethereum',
                  )}
                  style={{ transform: `scaleX(${(r.value ?? 0) / max})` }}
                />
              </div>
              <span
                className={cn(
                  'w-[12ch] shrink-0 whitespace-nowrap text-right text-label-value-12 tabular-nums',
                  r.live && 'font-bold',
                )}
              >
                {r.live ? (
                  <Rolling value={r.value} format={format} />
                ) : r.value !== undefined ? (
                  format(r.value)
                ) : (
                  'n/a'
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * A block on the chain with the old rules branching off it and dead-ending:
 * a hard fork, which nodes that didn't upgrade would follow alone
 */
function ForkNode() {
  return (
    <svg viewBox="0 0 44 44" className="size-11 overflow-visible" aria-hidden>
      <path
        d="M 18 16 C 24 6, 30 4, 35 4"
        fill="none"
        strokeWidth={1.5}
        strokeDasharray="2.5 2"
        className="stroke-chart-ethereum/70"
      />
      <rect
        x={35}
        y={0}
        width={8}
        height={10}
        rx={2}
        strokeWidth={1.2}
        strokeDasharray="2 1.5"
        className="fill-surface-primary stroke-chart-ethereum/70"
      />
      <rect
        x={3}
        y={11}
        width={17}
        height={22}
        rx={3.5}
        strokeWidth={1.5}
        className="fill-surface-secondary stroke-primary transition-colors group-data-[focused=true]/stop:stroke-chart-ethereum"
      />
      <rect x={5} y={17} width={13} height={4.5} className="fill-primary/60" />
      <rect x={5} y={22.5} width={13} height={4} className="fill-chart-teal" />
    </svg>
  )
}

/** The head: the one block still being built on, breathing in the brand colour */
function LiveNode({ isLive }: { isLive: boolean }) {
  return (
    <svg viewBox="0 0 44 44" className="size-11 overflow-visible" aria-hidden>
      <rect
        x={1}
        y={9}
        width={21}
        height={26}
        rx={5}
        className={cn('fill-brand/15', isLive && 'motion-safe:animate-pulse')}
      />
      <rect
        x={3}
        y={11}
        width={17}
        height={22}
        rx={3.5}
        strokeWidth={2}
        className="fill-surface-secondary stroke-brand"
      />
      <rect x={5} y={17} width={13} height={4.5} className="fill-primary/60" />
      <rect x={5} y={22.5} width={13} height={4} className="fill-chart-teal" />
    </svg>
  )
}

/** The method, quietly: enough to redo every number above */
function Methodology({ stops }: { stops: Stop[] }) {
  const overlaps = stops.filter((s) => s.overlapsWith)
  return (
    <p className="mt-6 max-w-[90ch] border-divider border-t pt-4 text-label-value-12 text-secondary leading-relaxed">
      Each stop compares the median of the {WINDOW_DAYS} complete days before
      the upgrade with the {WINDOW_DAYS} complete days from it. Sending ETH is
      21,000 gas at the day&apos;s median base fee, in ETH, so the price of ETH
      doesn&apos;t move it; the USD figure uses each day&apos;s price.{' '}
      {overlaps.map((s) => (
        <span key={s.upgrade.name}>
          {s.upgrade.name}&apos;s days after overlap {s.overlapsWith}&apos;s
          days before, so those two stops share days.{' '}
        </span>
      ))}
      A window catches everything else that happened that month too, so a change
      around an upgrade is not proof the upgrade caused it.
    </p>
  )
}
