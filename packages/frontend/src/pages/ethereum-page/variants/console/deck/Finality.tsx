import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../../live/types'
import { epochOf, SLOT_SECONDS, SLOTS_PER_EPOCH } from '../derive'
import { fmtDuration, fmtNumber } from '../format'
import { Panel } from '../ui/Panel'

const EPOCHS = 4

/**
 * The last four epochs, one row of 32 slots each. Green is final and can no
 * longer change; everything after it is the head, which a reorg can still
 * rewrite. Every live number on the page is read from that unfinalized part
 */
export function Finality({
  head,
  className,
}: {
  head: EthereumHead
  className?: string
}) {
  const headSlot = head.head?.slot
  const missed = new Set(
    head.blocks.filter((b) => b.status === 'missed').map((b) => b.slot),
  )
  const headEpoch = headSlot === undefined ? undefined : epochOf(headSlot)
  const behind =
    headSlot !== undefined && head.finalizedSlot !== undefined
      ? headSlot - head.finalizedSlot
      : undefined

  return (
    <Panel
      title="Finality"
      cadence="epoch"
      className={className}
      accessory={
        <span className="font-mono text-[10.5px] text-secondary tabular-nums">
          {behind === undefined
            ? '—'
            : `${fmtNumber(behind)} slots · ${fmtDuration(behind * SLOT_SECONDS)} behind head`}
        </span>
      }
      bodyClassName="flex flex-col gap-1 px-3 py-2"
    >
      {Array.from({ length: EPOCHS }, (_, row) => {
        const epoch =
          headEpoch === undefined ? undefined : headEpoch - (EPOCHS - 1 - row)
        return (
          <div key={row} className="flex items-center gap-2">
            <span className="w-[92px] shrink-0 font-mono text-[10.5px] text-secondary tabular-nums">
              {epoch === undefined ? 'epoch —' : `epoch ${fmtNumber(epoch)}`}
            </span>
            <div className="flex h-2.5 flex-1 gap-px" aria-hidden>
              {Array.from({ length: SLOTS_PER_EPOCH }, (_, i) => {
                const slot =
                  epoch === undefined ? undefined : epoch * SLOTS_PER_EPOCH + i
                return (
                  <span
                    key={i}
                    title={
                      slot !== undefined && missed.has(slot)
                        ? `Slot ${fmtNumber(slot)} missed`
                        : undefined
                    }
                    className={cn(
                      'flex-1 rounded-[1px]',
                      slotClass(slot, headSlot, head, missed),
                      slot === headSlot &&
                        'ring-1 ring-brand motion-safe:animate-pulse',
                    )}
                  />
                )
              })}
            </div>
            <EpochLabel epoch={epoch} head={head} />
          </div>
        )
      })}
    </Panel>
  )
}

function slotClass(
  slot: number | undefined,
  headSlot: number | undefined,
  head: EthereumHead,
  missed: Set<number>,
) {
  if (slot === undefined || headSlot === undefined)
    return 'bg-surface-secondary'
  if (slot > headSlot) return 'bg-surface-secondary/60'
  if (missed.has(slot)) return 'bg-warning/80'
  if (head.finalizedSlot !== undefined && slot <= head.finalizedSlot)
    return 'bg-positive'
  if (head.justifiedSlot !== undefined && slot <= head.justifiedSlot)
    return 'bg-positive/45'
  return 'bg-chart-ethereum/70'
}

/** Named in its cells' colour, so the rows explain the colours without a legend */
function EpochLabel({
  epoch,
  head,
}: {
  epoch: number | undefined
  head: EthereumHead
}) {
  const state = epoch === undefined ? undefined : epochState(epoch, head)
  return (
    <span
      className={cn(
        'w-[74px] shrink-0 text-right text-[10.5px]',
        state === 'finalized' && 'text-positive',
        state === 'justified' && 'text-positive/70',
        (state === 'in progress' || state === 'at the head') &&
          'text-chart-ethereum',
        state === undefined && 'text-secondary',
      )}
    >
      {state ?? ''}
    </span>
  )
}

function epochState(epoch: number, head: EthereumHead) {
  const last = (epoch + 1) * SLOTS_PER_EPOCH - 1
  if (head.finalizedSlot !== undefined && last <= head.finalizedSlot)
    return 'finalized'
  if (head.justifiedSlot !== undefined && last <= head.justifiedSlot)
    return 'justified'
  if (head.head && epochOf(head.head.slot) === epoch) return 'in progress'
  return 'at the head'
}
