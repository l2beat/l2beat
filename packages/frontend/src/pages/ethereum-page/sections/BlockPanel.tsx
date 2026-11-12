import { cn } from '~/utils/cn'
import {
  formatBlockNumber,
  formatBlockTime,
  formatBytes,
  formatEth,
  formatGwei,
  formatInteger,
  formatMillions,
  formatPerSecond,
  formatSlotsAgo,
  formatWei,
  shortHash,
} from '../format'
import type { HeadBlock } from '../live/types'
import { blobFeeEth, blockMetrics, epochOf } from '../metrics'
import { useAnchor } from '../state/anchor'
import { BlobMeter, GasMeter } from '../ui/Meters'
import { Rolling } from '../ui/Rolling'
import { Stat } from '../ui/Section'

/**
 * One block close up: what it carried, what it cost, how settled it is. The
 * head while live; the picked block after a scrub. Each live number on the
 * page appears here once; the sections below tell the week instead.
 */
export function BlockPanel() {
  const { head, block, isLive, slotsBehind, orphaned } = useAnchor()
  const limits = head.limits
  const metrics = block && blockMetrics(block)

  return (
    <div aria-label="The block on show" className="mt-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div className="flex flex-col">
          <div
            className={cn(
              'flex items-center gap-2 font-medium text-label-value-14',
              isLive ? 'text-brand-deep' : 'text-chart-ethereum',
            )}
          >
            {isLive
              ? 'The head: the newest block'
              : orphaned
                ? 'Orphaned: no longer on the chain'
                : `${slotsBehind} ${slotsBehind === 1 ? 'slot' : 'slots'} (${formatSlotsAgo(slotsBehind)}) before the head`}
          </div>
          <div className="mt-2 font-bold text-[44px] leading-none tracking-[-0.02em] md:text-[64px]">
            <Rolling
              value={block?.number}
              format={formatBlockNumber}
              placeholder="w-[7ch]"
            />
          </div>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-label-value-14">
            <Meta label="Slot">
              {block ? formatInteger(block.slot) : '—'}
              <span className="text-secondary">
                {' '}
                in epoch {block ? formatInteger(epochOf(block.slot)) : '—'}
              </span>
            </Meta>
            <Meta label="Time">
              {block ? formatBlockTime(block.timestamp) : '—'}
            </Meta>
            <Meta label="Hash">
              <span className="font-mono text-[13px]">
                {shortHash(block?.hash)}
              </span>
            </Meta>
            <Meta label="Proposer">
              {block ? `Validator ${formatInteger(block.proposerIndex)}` : '—'}
            </Meta>
          </dl>
          <Settledness block={block} />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3">
          <Stat
            className="col-span-2 md:col-span-3"
            label="Blobs in this block"
            cadence="block"
            value={
              <span className="flex items-baseline gap-2">
                <Rolling
                  value={block?.blobCount}
                  format={formatInteger}
                  placeholder="w-[2ch]"
                />
                <span className="font-medium text-label-value-15 text-secondary">
                  of {limits.targetBlobs} target, {limits.maxBlobs} max
                </span>
              </span>
            }
            sub={
              <div className="flex flex-col gap-2 pt-1.5">
                <BlobMeter
                  block={block}
                  target={limits.targetBlobs}
                  max={limits.maxBlobs}
                />
                <span>
                  {metrics ? formatBytes(metrics.dataBytes) : '—'} of rollup
                  data.{' '}
                  <a href="#throughput" className="text-link hover:underline">
                    Who posted it
                  </a>
                </span>
              </div>
            }
          />
          <Stat
            className="col-span-2 md:col-span-3"
            label="Gas used"
            cadence="block"
            value={
              <span className="flex items-baseline gap-2">
                <Rolling value={block?.gasUsed} format={formatMillions} />
                <span className="font-medium text-label-value-15 text-secondary">
                  of {formatMillions(limits.gasLimit)} limit,{' '}
                  {formatMillions(limits.gasTarget)} target
                </span>
              </span>
            }
            sub={
              <div className="pt-1.5">
                <GasMeter
                  used={block?.gasUsed}
                  limit={limits.gasLimit}
                  target={limits.gasTarget}
                />
              </div>
            }
          />
          <Stat
            label="Base fee"
            cadence="block"
            value={<Rolling value={block?.baseFeeGwei} format={formatGwei} />}
            sub={block && `+ ${formatGwei(block.priorityFeeGwei)} median tip`}
          />
          <Stat
            label="Blob base fee"
            cadence="block"
            value={<Rolling value={block?.blobBaseFeeWei} format={formatWei} />}
            sub={block && `${formatEth(blobFeeEth(block))} a blob`}
          />
          <Stat
            label="Transactions"
            cadence="block"
            value={
              <span>
                <Rolling value={metrics?.tps} format={formatPerSecond} />
                <span className="font-medium text-label-value-15 text-secondary">
                  {' '}
                  tx/s
                </span>
              </span>
            }
            sub={block && `${formatInteger(block.txCount)} in this block`}
          />
        </div>
      </div>
    </div>
  )
}

function Meta({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <>
      <dt className="text-secondary">{label}</dt>
      <dd className="min-w-0 truncate tabular-nums">{children}</dd>
    </>
  )
}

/** How far this block is from final: the question a reorg makes real */
function Settledness({ block }: { block: HeadBlock | undefined }) {
  const { head, orphaned } = useAnchor()
  const { finalizedSlot, justifiedSlot } = head
  if (!block || finalizedSlot === undefined || justifiedSlot === undefined) {
    return <div className="mt-6 h-[66px]" />
  }
  if (orphaned) return <OrphanCallout block={block} />
  const state =
    block.slot <= finalizedSlot
      ? 'finalized'
      : block.slot <= justifiedSlot
        ? 'justified'
        : 'pending'
  const headSlot = head.head?.slot ?? block.slot
  return (
    <div className="mt-6 rounded-lg border border-divider p-3 text-label-value-13">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-[3px] w-6 rounded-full',
            state === 'pending'
              ? 'border-secondary border-t-[3px] border-dotted'
              : 'bg-primary',
          )}
        />
        <span className="font-bold">
          {state === 'finalized'
            ? 'Finalized'
            : state === 'justified'
              ? 'Justified: finalizes with the next checkpoint'
              : 'Not yet justified: can still be reorged'}
        </span>
      </div>
      <div className="mt-1.5 text-secondary leading-snug">
        Finalized up to{' '}
        {head.finalizedBlock !== undefined && (
          <>
            block{' '}
            <span className="text-primary tabular-nums">
              {formatBlockNumber(head.finalizedBlock)}
            </span>{' '}
            in{' '}
          </>
        )}
        slot{' '}
        <span className="text-primary tabular-nums">
          {formatInteger(finalizedSlot)}
        </span>
        , {formatSlotsAgo(headSlot - finalizedSlot)} behind the head. Reverting
        a finalized block would get at least a third of all staked ETH slashed.
      </div>
    </div>
  )
}

/**
 * The reader picked this block, then a reorg rewrote its slot. The page stays
 * on it, since that's what they were reading, and says what happened.
 */
function OrphanCallout({ block }: { block: HeadBlock }) {
  const { orphaned, viewReplacement } = useAnchor()
  if (!orphaned) return null
  const { reorg, replacement } = orphaned
  const missed = replacement?.status !== 'proposed'
  return (
    <div className="mt-6 rounded-lg border border-chart-ethereum/50 border-dashed bg-chart-ethereum/5 p-3 text-label-value-13">
      <div className="font-bold">
        Replaced by a reorg {reorg.depth} {reorg.depth === 1 ? 'slot' : 'slots'}{' '}
        deep
      </div>
      <div className="mt-1.5 text-secondary leading-snug">
        Slot {formatInteger(block.slot)} now{' '}
        {missed ? (
          'has no block on the winning branch: it was missed.'
        ) : (
          <>
            holds{' '}
            <span className="font-mono text-primary">
              {shortHash(replacement?.hash)}
            </span>{' '}
            instead. The numbers below are still this orphaned block's.
          </>
        )}
      </div>
      <button
        type="button"
        onClick={viewReplacement}
        className="mt-2.5 rounded-full bg-chart-ethereum px-3 py-1.5 font-bold text-label-value-13 text-white transition-transform hover:scale-[1.03] active:scale-95"
      >
        {missed ? 'Back to live' : 'View the replacement'}
      </button>
    </div>
  )
}
