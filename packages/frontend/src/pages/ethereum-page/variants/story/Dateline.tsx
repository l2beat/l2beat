import { useEffect, useRef, useState } from 'react'
import { LiveIndicator } from '~/components/LiveIndicator'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import type { EthereumHead } from '../../live/types'
import { ValueSlot } from './Article'
import { getFinalized, SLOT_SECONDS } from './facts'
import { formatInteger } from './format'

/** How long the dateline says a rewind happened */
const REWOUND_MS = 8000

/**
 * The story's dateline: where on the chain the text was written. It sticks
 * under the reader while they scroll, so every number below is always next to
 * the block it is from. Its bottom rule fills over the slot, as a clock.
 */
export function Dateline({ head }: { head: EthereumHead }) {
  const now = useNow()
  const block = head.head
  const finalized = getFinalized(head)
  const secondsLeft =
    head.nextSlotAt !== undefined
      ? Math.max(0, Math.ceil((head.nextSlotAt - now) / 1000))
      : undefined
  const rewound =
    head.lastReorg !== undefined && now - head.lastReorg.seenAt < REWOUND_MS
      ? head.lastReorg.depth
      : undefined
  const behind =
    block && head.finalizedSlot !== undefined
      ? Math.round(((block.slot - head.finalizedSlot) * SLOT_SECONDS) / 60)
      : undefined

  return (
    <div className="sticky top-0 z-20 border-divider border-b bg-surface-primary/92 font-inter backdrop-blur-md md:rounded-t-xl">
      <div className="flex h-11 items-center gap-x-4 overflow-hidden px-4 text-[13px] text-secondary md:gap-x-6 md:px-8 xl:px-12">
        <Status status={head.status} rewound={rewound} />
        <Item label="Block">
          {block?.number !== undefined ? (
            <a
              href={`https://etherscan.io/block/${block.number}`}
              className="hover:underline"
            >
              <RollingNumber value={block.number} format={formatInteger} />
            </a>
          ) : block ? (
            <span>missed</span>
          ) : (
            <ValueSlot chars={10} />
          )}
        </Item>
        <Item label="Slot" className="max-sm:hidden">
          {block ? (
            <a
              href={`https://beaconcha.in/slot/${block.slot}`}
              className="hover:underline"
            >
              <RollingNumber value={block.slot} format={formatInteger} />
            </a>
          ) : (
            <ValueSlot chars={10} />
          )}
        </Item>
        <Item label="Next in">
          {secondsLeft !== undefined ? (
            <span className="tabular-nums">{secondsLeft} s</span>
          ) : (
            <ValueSlot chars={3} />
          )}
        </Item>
        <Item label="Finalized" className="max-md:hidden">
          {finalized ? (
            <span className="tabular-nums">
              {finalized.kind === 'slot' && 'slot '}
              {formatInteger(finalized.value)}
              {behind !== undefined && (
                <span className="text-secondary"> ({behind} min ago)</span>
              )}
            </span>
          ) : (
            <ValueSlot chars={10} />
          )}
        </Item>
      </div>
      <SlotRule nextSlotAt={head.nextSlotAt} />
    </div>
  )
}

function Status({
  status,
  rewound,
}: {
  status: EthereumHead['status']
  /** Slots rewound, while the chip is up */
  rewound: number | undefined
}) {
  if (rewound !== undefined) {
    return (
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-2 py-0.5 font-semibold text-[12px] text-white">
        <RewindGlyph />
        Rewound {rewound} slot{rewound === 1 ? '' : 's'}
      </span>
    )
  }
  return (
    <span className="flex shrink-0 items-center gap-2 font-medium text-primary">
      <LiveIndicator disabled={status !== 'live'} />
      {status === 'live'
        ? 'Live'
        : status === 'connecting'
          ? 'Connecting'
          : 'Reconnecting'}
    </span>
  )
}

function Item({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-baseline gap-1.5 whitespace-nowrap',
        className,
      )}
    >
      <span>{label}</span>
      <span className="font-semibold text-primary tabular-nums">
        {children}
      </span>
    </span>
  )
}

/** Fills across the slot, restarting as each block lands */
function SlotRule({ nextSlotAt }: { nextSlotAt: number | undefined }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || nextSlotAt === undefined) return
    const animation = element.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      {
        duration: Math.max(1, nextSlotAt - Date.now()),
        easing: 'linear',
        fill: 'forwards',
      },
    )
    return () => animation.cancel()
  }, [nextSlotAt])
  return (
    <div
      ref={ref}
      aria-hidden
      className="-bottom-px absolute inset-x-0 h-px origin-left scale-x-0 bg-brand/70"
    />
  )
}

function RewindGlyph() {
  return (
    <svg viewBox="0 0 12 8" className="h-2 w-3 fill-current" aria-hidden>
      <path d="M6 0v8L0 4zM12 0v8L6 4z" />
    </svg>
  )
}

function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(timer)
  }, [])
  return now
}
