import { SLOT_SECONDS } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import type { LiveChain, SlotStatus } from '~/server/features/eth-supply/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { Figure, Tile, TileTitle, TYPE } from './ui'

/** One hue, more solid the more settled the slot. */
const STATUS: Record<
  SlotStatus,
  { label: string; className?: string; color?: string }
> = {
  finalized: { label: 'Finalized', color: 'var(--chart-ethereum)' },
  justified: {
    label: 'Justified',
    color:
      'color-mix(in oklab, var(--chart-ethereum) 55%, var(--surface-primary))',
  },
  proposed: {
    label: 'Proposed',
    color:
      'color-mix(in oklab, var(--chart-ethereum) 22%, var(--surface-primary))',
  },
  missed: { label: 'Missed', className: 'border-[1.5px] border-negative' },
}

/** The head slot and finality over the latest slots, refreshed each slot. */
export function ChainTile({ initialChain }: { initialChain: LiveChain }) {
  const trpc = useTRPC()
  const { data: chain, isError } = useQuery({
    ...trpc.ethSupply.liveChain.queryOptions(),
    initialData: initialChain,
    refetchInterval: SLOT_SECONDS * 1000,
    refetchIntervalInBackground: false,
  })
  // A failed refresh keeps the last slots, so they are no longer live.
  const live = chain.live && !isError
  const lag = chain.finalityLagEpochs

  return (
    <Tile area="chain" label="Chain head">
      <TileTitle
        right={
          <span className={cn(TYPE.label, 'flex items-center gap-1.5')}>
            <span
              aria-hidden
              className={cn(
                'size-2 rounded-full',
                live ? 'economics-pulse bg-positive' : 'bg-secondary',
              )}
            />
            {live ? 'Live' : 'Not live'}
          </span>
        }
      >
        Chain head
      </TileTitle>
      <Figure
        value={
          <span key={chain.headSlot} className="economics-roll inline-block">
            {chain.headSlot.toLocaleString('en-US')}
          </span>
        }
        sub={`Head slot · finality ${lag} epoch${lag === 1 ? '' : 's'} behind`}
      />
      <div className="mt-auto flex flex-col gap-3 pt-1">
        <div className={TYPE.label}>Latest {chain.slots.length} slots</div>
        <ol
          aria-label={`Latest ${chain.slots.length} slots`}
          className="grid h-6 gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${chain.slots.length}, minmax(0, 1fr))`,
          }}
        >
          {chain.slots.map((slot) => {
            const status = STATUS[slot.status]
            return (
              <li
                key={slot.slot}
                title={`Slot ${slot.slot.toLocaleString('en-US')}: ${status.label}`}
                className={cn(
                  'rounded-[2px] transition-colors duration-500',
                  status.className,
                )}
                style={{ backgroundColor: status.color }}
              />
            )
          })}
        </ol>
        <div className="grid grid-cols-[auto_auto] justify-start gap-x-6 gap-y-2">
          {Object.values(STATUS).map((status) => (
            <span
              key={status.label}
              className="flex items-center gap-1.5 whitespace-nowrap font-medium text-label-value-12 text-secondary"
            >
              <span
                aria-hidden
                className={cn('size-2.5 rounded-[3px]', status.className)}
                style={{ backgroundColor: status.color }}
              />
              {status.label}
            </span>
          ))}
        </div>
      </div>
    </Tile>
  )
}
