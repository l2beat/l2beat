import type { RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import type { HeadBlock } from '../../../live/types'
import {
  formatBlockNumber,
  formatBlockTime,
  formatEth,
  formatGwei,
  formatInteger,
  formatMillions,
  formatPerSecond,
  formatSlotsAgo,
  formatUsd,
  formatWei,
  shortHash,
} from '../format'
import { blobFeeEth, blockMetrics, epochOf } from '../metrics'
import { useAnchor } from '../state/anchor'
import { BlobMeter, GasMeter } from '../ui/Meters'
import { Rolling } from '../ui/Rolling'
import { CadenceMark, Stat } from '../ui/Section'

/**
 * The block the page is anchored to, close up: what it carried, what it cost,
 * how settled it is. The head while live; the picked block after a scrub.
 */
export function Inspector({ verdicts }: { verdicts: RosetteValue[] }) {
  const { head, block, isLive, slotsBehind } = useAnchor()
  const limits = head.limits
  const metrics = block && blockMetrics(block)

  return (
    <section
      id="pulse"
      aria-label="The block on show"
      className="scroll-mt-48 bg-surface-primary px-4 py-6 max-md:border-divider max-md:border-b md:rounded-xl md:p-6"
    >
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
              <div className="pt-1.5">
                <BlobMeter
                  block={block}
                  target={limits.targetBlobs}
                  max={limits.maxBlobs}
                />
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
      <Verdict verdicts={verdicts} ethPrice={block?.ethPriceUsd} />
    </section>
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
  const { head } = useAnchor()
  const { finalizedSlot, justifiedSlot } = head
  if (!block || finalizedSlot === undefined || justifiedSlot === undefined) {
    return <div className="mt-6 h-[66px]" />
  }
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
        Finalized up to slot{' '}
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
 * The risk assessment's verdicts in one line each, linking to the summary:
 * a reader who stops at the top still learns what they have to trust
 */
function Verdict({
  verdicts,
  ethPrice,
}: {
  verdicts: RosetteValue[]
  ethPrice: number | undefined
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 border-divider border-t pt-5 lg:flex-row lg:items-start lg:gap-10">
      <div className="shrink-0 lg:w-[220px]">
        <div className="font-bold text-heading-16">What you trust</div>
        <a
          href="#risk-summary"
          className="mt-1 inline-block font-medium text-label-value-13 text-link underline-offset-2 hover:underline"
        >
          Read the risk summary
        </a>
      </div>
      <ul className="grid flex-1 gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
        {verdicts.map((v) => (
          <li key={v.name} className="flex gap-2.5">
            <span
              className={cn(
                'mt-0.5 w-1 shrink-0 self-stretch rounded-full',
                sentimentToOpaqueBgColor(v.sentiment ?? 'neutral'),
              )}
            />
            <div className="min-w-0">
              <div className="text-label-value-12 text-secondary">{v.name}</div>
              <div className="mt-1 font-bold text-label-value-14">
                {v.value}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="shrink-0 text-label-value-13 text-secondary lg:text-right">
        <div className="flex items-center gap-2 lg:justify-end">
          ETH price <CadenceMark cadence="minute" />
        </div>
        <div className="mt-1 font-bold text-label-value-16 text-primary">
          <Rolling value={ethPrice} format={formatUsd} />
        </div>
      </div>
    </div>
  )
}
