import { Skeleton } from '~/components/core/Skeleton'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead, HeadBlock } from '../../../live/types'
import {
  BLOB_BYTES,
  formatFixed,
  formatGas,
  formatInteger,
  formatSmart,
  formatUsd,
  shortHash,
} from '../format'
import { Heartbeat } from '../heartbeat/Heartbeat'
import { getWindowRates } from '../liveMetrics'
import { RiskVerdict } from '../risk/RiskVerdict'
import type { Verdict } from '../risk/verdict'
import { BigNumber, Stat } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'
import { Odometer } from '../ui/Odometer'
import { type Rewind, shownHead } from '../useRewind'
import type { SlotClock } from '../useSlotClock'
import { Countdown } from './Countdown'
import { ReorgNotice } from './ReorgNotice'

const ETH_TRANSFER_GAS = 21_000
const SLOTS_PER_EPOCH = 32
/** Holds a line's height before its value arrives */
const NBSP = '\u00a0'

/**
 * The first screen: the newest block, huge, and the heartbeat it adds to.
 * Five numbers say what the block carried and cost, in words anyone can
 * read, and our verdict sits right under them.
 */
export function PulseHero({
  live,
  clock,
  rewind,
  verdict,
}: {
  live: EthereumHead
  clock: SlotClock
  rewind: Rewind
  verdict: Verdict
}) {
  const head = shownHead(live.head, rewind)
  const isLive = live.status !== 'connecting' && head !== undefined
  // a missed slot has no block of its own, so the newest block is an older one
  const number = isLive
    ? (head.number ??
      live.blocks.findLast((b) => b.number !== undefined)?.number)
    : undefined

  return (
    <section
      id="pulse"
      aria-label="Ethereum right now"
      className="overflow-hidden bg-surface-primary md:mt-1 md:rounded-2xl"
    >
      <div className="px-4 pt-6 md:px-10 md:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <img src="/icons/ethereum.png" alt="" className="size-7" />
            <h1 className="text-heading-24 md:text-heading-28">Ethereum</h1>
            <LiveChip status={live.status} />
          </div>
          <Finality live={live} />
        </div>

        <div className="mt-8 flex items-end justify-between gap-x-8 md:mt-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-4">
              <Explain
                className="text-label-value-14 text-secondary"
                explainer="Every 12 seconds a validator adds a block to the chain. This is the newest one, the head. It can still be replaced by a reorg until it is finalized."
              >
                Newest block
              </Explain>
              <Countdown
                clock={clock}
                live={isLive}
                compact
                className="md:hidden"
              />
            </div>
            <div className="mt-2 font-extralight text-[clamp(52px,15.5vw,136px)] text-primary leading-none tracking-[-0.045em]">
              {number !== undefined ? (
                <Odometer
                  text={formatInteger(number)}
                  animate={!rewind.reducedMotion}
                />
              ) : (
                <Skeleton className="h-[0.86em] w-[5em]" />
              )}
            </div>
            <BlockMeta head={isLive ? head : undefined} />
          </div>
          <Countdown
            clock={clock}
            live={isLive}
            className="pb-1 max-md:hidden"
          />
        </div>
      </div>

      <div className="relative mt-6 md:mt-8">
        <Heartbeat
          blocks={live.blocks}
          limits={live.limits}
          clock={clock}
          rewind={rewind}
          className="h-[156px] md:h-[220px]"
        />
        {rewind.notice && !rewind.playing && (
          <ReorgNotice
            reorg={rewind.notice}
            finalizedBlock={live.finalizedBlock}
            onDismiss={rewind.dismiss}
          />
        )}
      </div>
      <Legend />

      <HeroStats live={live} head={isLive ? head : undefined} />

      <RiskVerdict
        verdict={verdict}
        className="border-divider border-t bg-surface-secondary/40 px-4 py-7 md:px-10 md:py-9 dark:bg-surface-secondary/25"
      />
    </section>
  )
}

function LiveChip({ status }: { status: EthereumHead['status'] }) {
  const label =
    status === 'live'
      ? 'Live'
      : status === 'reconnecting'
        ? 'Reconnecting'
        : 'Connecting'
  return (
    <Explain
      className="no-underline"
      explainer="Every number on this page follows the newest block, as it arrives. Each one says how often it changes."
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-medium text-brand-deep text-label-value-13">
        <span className="relative flex size-2">
          {status === 'live' && (
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/60 motion-reduce:hidden" />
          )}
          <span
            className={cn(
              'relative size-2 rounded-full',
              status === 'live' ? 'bg-brand' : 'bg-secondary',
            )}
          />
        </span>
        {label}
      </span>
    </Explain>
  )
}

function Finality({ live }: { live: EthereumHead }) {
  const { head, finalizedSlot, finalizedBlock } = live
  if (!head || finalizedSlot === undefined || finalizedBlock === undefined) {
    return <Skeleton className="h-9 w-56" />
  }
  const behind = head.slot - finalizedSlot
  const minutes = Math.round((behind * 12) / 60)
  return (
    <div className="text-right max-md:text-left">
      <Explain
        className="text-label-value-14 text-secondary"
        explainer="Once two thirds of staked ETH has voted for a checkpoint twice, every block up to it is final: changing one would cost validators billions in slashed stake. Newer blocks can still be replaced."
      >
        Final up to block
      </Explain>
      <div className="mt-1 font-medium text-label-value-16 text-primary tabular-nums">
        {formatInteger(finalizedBlock)}
        <span className="ml-2 font-normal text-secondary">
          {minutes} min, {Math.round(behind / SLOTS_PER_EPOCH)} epochs behind
        </span>
      </div>
    </div>
  )
}

function BlockMeta({ head }: { head: HeadBlock | undefined }) {
  if (!head) return <Skeleton className="mt-4 h-4 w-64" />
  if (head.status === 'missed') {
    return (
      <div className="mt-4 text-label-value-14 text-secondary tabular-nums">
        Slot <span className="text-primary">{formatInteger(head.slot)}</span>{' '}
        passed without a block; the next one carries on.
      </div>
    )
  }
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-label-value-14 text-secondary tabular-nums">
      <span>
        Slot <span className="text-primary">{formatInteger(head.slot)}</span>
      </span>
      <span>
        Hash <span className="text-primary">{shortHash(head.hash)}</span>
      </span>
      <span>
        <span className="text-primary">{formatInteger(head.txCount)}</span>{' '}
        transactions
      </span>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 pt-3 text-label-value-13 text-secondary md:px-10">
      <span className="flex items-center gap-2">
        <svg width="18" height="12" aria-hidden className="shrink-0">
          <path
            d="M0 9H5L7 11L9 1L11 11L13 9H18"
            className="fill-none stroke-brand"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
        </svg>
        Spike: how full the block is
      </span>
      <span className="flex items-center gap-2">
        <svg width="18" height="12" aria-hidden className="shrink-0">
          <path
            d="M1 11C4 1 14 1 17 11Z"
            className="fill-chart-ethereum/25 stroke-chart-ethereum"
            strokeWidth={1.6}
          />
        </svg>
        Wave: rollup data it carried
      </span>
      <span className="flex items-center gap-2">
        <svg width="18" height="12" aria-hidden className="shrink-0">
          <path
            d="M0 6H18"
            className="stroke-secondary"
            strokeDasharray="3 3"
            strokeWidth={1.2}
          />
        </svg>
        Above the line, fees go up
      </span>
    </div>
  )
}

const formatInt = (v: number) => formatInteger(v)
const formatPct = (v: number) => formatFixed(v, 0)
const formatGwei = (v: number) => formatSmart(v)
const formatRate = (v: number) => formatFixed(v, 1)

function HeroStats({
  live,
  head,
}: {
  live: EthereumHead
  head: HeadBlock | undefined
}) {
  const { limits } = live
  const rates = getWindowRates(live.blocks)
  const ready = head && rates
  const blobCost = head ? (head.blobBaseFeeWei * BLOB_BYTES) / 1e18 : 0
  const transferUsd = head
    ? ((head.baseFeeGwei + head.priorityFeeGwei) *
        ETH_TRANSFER_GAS *
        head.ethPriceUsd) /
      1e9
    : 0

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 px-4 pt-10 pb-10 md:grid-cols-3 md:gap-x-10 md:gap-y-12 md:px-10 md:pt-12 md:pb-12">
      <Stat
        label={
          <Explain explainer="Rollups, the layer 2s, post their transactions to Ethereum in blobs of 128 KiB, so anyone can check them. A block has room for a fixed number; the network aims for fewer, so there is room for bursts.">
            Rollup data
          </Explain>
        }
        cadence={<CadenceTag cadence="every block" />}
        sub={`of ${limits.maxBlobs} max, target ${limits.targetBlobs}`}
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber value={head.blobCount} format={formatInt} />
            ) : (
              <Dash />
            )
          }
          unit="blobs"
        />
      </Stat>
      <Stat
        label={
          <Explain explainer="What rollups pay per byte of blob space, and it is burned. It rises while blocks carry more blobs than the target and falls back when they carry fewer. One wei is the floor: a billionth of a billionth of an ETH.">
            Blob price
          </Explain>
        }
        cadence={<CadenceTag cadence="every block" />}
        sub={
          ready ? `${formatUsd(blobCost * head.ethPriceUsd)} per blob` : NBSP
        }
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber value={head.blobBaseFeeWei} format={formatInt} />
            ) : (
              <Dash />
            )
          }
          unit="wei"
        />
      </Stat>
      <Stat
        label={
          <Explain explainer="Every transaction needs gas, a measure of computation. A block can hold a fixed amount of gas. Half of it is the target: above it, the base fee rises.">
            Block space used
          </Explain>
        }
        cadence={<CadenceTag cadence="every block" />}
        sub={
          ready
            ? `${formatGas(head.gasUsed)} of ${formatGas(head.gasLimit)} gas, target ${formatGas(limits.gasTarget)}`
            : NBSP
        }
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber
                value={(head.gasUsed / head.gasLimit) * 100}
                format={formatPct}
              />
            ) : (
              <Dash />
            )
          }
          unit="%"
        />
      </Stat>
      <Stat
        label={
          <Explain explainer="The price of one unit of gas that every transaction pays on top of its tip, and which is burned. It moves by up to 12.5% a block: up when blocks are fuller than the target, down when emptier.">
            Base fee
          </Explain>
        }
        cadence={<CadenceTag cadence="every block" />}
        sub={ready ? `ETH transfer ≈ ${formatUsd(transferUsd)}` : NBSP}
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber value={head.baseFeeGwei} format={formatGwei} />
            ) : (
              <Dash />
            )
          }
          unit="gwei"
        />
      </Stat>
      <Stat
        label={
          <Explain explainer="Transactions Ethereum itself processed per second, averaged over the last 64 slots, about 13 minutes. Rollups process many more on top, and post them here as blobs.">
            Transactions per second
          </Explain>
        }
        cadence={<CadenceTag cadence="last 64 blocks" />}
        sub={
          ready ? `${formatRate(rates.uops)} user operations per second` : NBSP
        }
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber value={rates.tps} format={formatRate} />
            ) : (
              <Dash />
            )
          }
          unit="tx/s"
        />
      </Stat>
      <Stat
        label={
          <Explain explainer="Blob bytes posted per second over the last 64 slots: the data rollups put on Ethereum for anyone to check.">
            Data throughput
          </Explain>
        }
        cadence={<CadenceTag cadence="last 64 blocks" />}
        sub={
          ready
            ? `${formatFixed(rates.blobsPerBlock, 1)} blobs per block on average`
            : NBSP
        }
      >
        <BigNumber
          value={
            ready ? (
              <RollingNumber
                value={rates.bytesPerSecond / 1000}
                format={formatInt}
              />
            ) : (
              <Dash />
            )
          }
          unit="KB/s"
        />
      </Stat>
    </div>
  )
}

function Dash() {
  return <Skeleton className="h-[0.8em] w-[2.4em]" />
}
