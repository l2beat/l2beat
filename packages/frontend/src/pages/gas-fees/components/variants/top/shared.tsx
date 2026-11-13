import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect, useRef, useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import { NextBlock } from '~/pages/blobs/components/live-blobs/NextBlock'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import mock from '../../pageMock.json'

/**
 * One colour story for every block of the top card variants:
 * - our tip is ink, what is paid above it is brand pink
 * - tip sizes run blue (small) → purple → pink (where wallets sit)
 */
export const OURS = 'var(--primary)'
/** What our fast tip covers: ink, a step back so the pink reads first */
export const FIT =
  'color-mix(in oklab, var(--primary) 78%, var(--surface-primary))'
export const OVER = 'var(--brand)'
/** Brand pink as text, readable on the card in both themes */
export const OVER_TEXT = 'var(--brand-deep)'

export const BANDS = [
  {
    key: 'low',
    label: 'Under 0.1 gwei',
    short: '<0.1',
    color: 'var(--chart-stacked-blue)',
    text: 'text-white',
    max: 0.1,
  },
  {
    key: 'middle',
    label: '0.1 to 1 gwei',
    short: '0.1–1',
    color: 'var(--chart-stacked-purple)',
    text: 'text-white',
    max: 1,
  },
  {
    key: 'high',
    label: '1 to 2.5 gwei',
    short: '1–2.5',
    color: 'var(--chart-stacked-pink)',
    text: 'text-black',
    max: Number.POSITIVE_INFINITY,
  },
] as const

export const WALLETS = [
  { name: 'Ambire', icon: '/icons/ambire.png' },
  { name: 'MetaMask', icon: '/icons/metamask.png' },
  { name: 'Rabby', icon: '/icons/rabby.png' },
] as const

const POLL_MS = 2_000

/** Two significant digits, never in e-notation: slow tips can be 1e-8 gwei */
export const gwei = (value: number) =>
  value.toLocaleString('en-US', {
    maximumSignificantDigits: 2,
    maximumFractionDigits: 12,
  })

export const multiple = (value: number) =>
  `${Number(value.toPrecision(2)).toLocaleString('en-US')}×`

export function usdM(value: number) {
  return `$${Math.round(value / 1e6)}M`
}

export interface TierRow {
  key: string
  name: string
  promise: string
  gwei: number | undefined
  usd: number | undefined
  wallets: {
    name: string
    icon: string
    option: string | undefined
    gwei: number | undefined
    multiple: number | undefined
  }[]
}

/** Our three tips and the wallets beside them, live, or replayed when the node is down */
export function useTips() {
  const trpc = useTRPC()
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useIsOnScreen(ref)
  const { data: live, isPending } = useQuery({
    ...trpc.gasFees.tips.queryOptions(),
    enabled: onScreen,
    refetchInterval: POLL_MS,
  })
  const rows: TierRow[] = mock.tiers.map((tier) => {
    const now = live?.tips.find((tip) => tip.key === tier.key)
    const ours = now?.gwei ?? (isPending ? undefined : tier.tip)
    return {
      key: tier.key,
      name: tier.name,
      promise: tier.promise,
      gwei: ours,
      usd: now?.usd ?? (isPending ? undefined : tier.usd),
      wallets: WALLETS.map((wallet) => {
        const theirs = live?.wallets.find(
          (row) => row.wallet === wallet.name && row.beside === tier.key,
        )
        return {
          ...wallet,
          option: theirs?.option,
          gwei: theirs?.gwei,
          multiple: theirs && ours ? theirs.gwei / ours : undefined,
        }
      }),
    }
  })
  const fast = rows.find((row) => row.key === 'fast')
  const fastMultiples = (fast?.wallets ?? []).flatMap((w) =>
    w.multiple ? [w.multiple] : [],
  )
  const status: 'live' | 'pending' | 'replayed' = live
    ? 'live'
    : isPending
      ? 'pending'
      : 'replayed'
  return {
    ref,
    rows,
    status,
    fastMin: fastMultiples.length > 0 ? Math.min(...fastMultiples) : undefined,
    fastMax: fastMultiples.length > 0 ? Math.max(...fastMultiples) : undefined,
  }
}

/** A pulsing dot and the next block's countdown, or why the numbers are old */
export function LiveStatus({
  status,
  className,
}: {
  status: 'live' | 'pending' | 'replayed'
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-xs',
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        <span
          className={
            status === 'live'
              ? 'size-2 animate-pulse rounded-full bg-negative motion-reduce:animate-none'
              : 'size-2 rounded-full bg-divider'
          }
        />
        {status === 'replayed'
          ? `Average on ${mock.asOf}, replayed`
          : 'Live from Ethereum'}
      </span>
      {status === 'live' && <NextBlock hidden={false} />}
    </span>
  )
}

/** Holds the space of what is coming, so nothing moves when it does */
export function TextSkeleton({
  sizedAs,
  className,
}: {
  sizedAs: string
  className?: string
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span className="invisible">{sizedAs}</span>
      <Skeleton className="absolute inset-0" />
    </span>
  )
}

/** "0.0000093" → the zeros, quiet, then the digits that matter */
function splitZeros(text: string): [string, string] {
  const match = text.match(/^(0\.0*)(\d.*)$/)
  return match ? [match[1] ?? '', match[2] ?? ''] : ['', text]
}

/** A gwei value with its leading zeros dimmed, so 0.0000093 reads as 93 */
export function Gwei({
  value,
  className,
  zerosClassName = 'opacity-35',
}: {
  value: number
  className?: string
  zerosClassName?: string
}) {
  const [zeros, digits] = splitZeros(gwei(value))
  return (
    <span className={cn('tabular-nums', className)}>
      <span className={zerosClassName}>{zeros}</span>
      {digits}
    </span>
  )
}

/** As RollingNumber, counting to each new tip, with the zeros dimmed */
export function RollingGwei({
  value,
  className,
  zerosClassName = 'opacity-35',
}: {
  value: number
  className?: string
  zerosClassName?: string
}) {
  const zerosRef = useRef<HTMLSpanElement>(null)
  const digitsRef = useRef<HTMLSpanElement>(null)
  const shown = useRef(value)
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    const zeros = zerosRef.current
    const digits = digitsRef.current
    if (!zeros || !digits) return
    const write = (v: number) => {
      const [z, d] = splitZeros(gwei(v))
      if (zeros.textContent !== z) zeros.textContent = z
      if (digits.textContent !== d) digits.textContent = d
    }
    const from = shown.current
    if (from === value || reducedMotion) {
      shown.current = value
      write(value)
      return
    }
    const start = performance.now()
    // Counts on a log scale: tips move by powers of ten, not by steps
    const lf = Math.log(Math.max(from, 1e-12))
    const lt = Math.log(Math.max(value, 1e-12))
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / 900)
      shown.current = Math.exp(lf + (lt - lf) * (1 - (1 - t) ** 3))
      if (t === 1) shown.current = value
      write(shown.current)
      if (t < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [value, reducedMotion])

  return (
    <span className={cn('tabular-nums', className)}>
      <span ref={zerosRef} className={zerosClassName} />
      <span ref={digitsRef} />
    </span>
  )
}

export function WalletIcon({
  icon,
  className,
}: {
  icon: string
  className?: string
}) {
  return (
    <img
      src={icon}
      alt=""
      width={16}
      height={16}
      className={cn('size-4 shrink-0 rounded-xs', className)}
    />
  )
}

export function Swatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      className={cn('inline-block size-2.5 shrink-0 rounded-xs', className)}
      style={{ background: color }}
    />
  )
}

export interface BarPart {
  key: string
  label: string
  value: number
  color: string
  /** Text written inside the slice, when it fits */
  inside?: string
  text?: string
}

/**
 * The prototype's thick bar: one whole, parts labelled inside, keyed below
 * with bold percents
 */
export function ThickBar({
  parts,
  legend = true,
  className,
  height = 'h-11',
}: {
  parts: BarPart[]
  legend?: boolean
  className?: string
  height?: string
}) {
  const total = parts.reduce((sum, p) => sum + p.value, 0)
  const share = (v: number) => (total > 0 ? (v / total) * 100 : 0)
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div
        className={cn(
          'flex gap-[3px] font-semibold text-sm tabular-nums',
          height,
        )}
      >
        {parts.map((p) => {
          const pct = share(p.value)
          return (
            <span
              key={p.key}
              className={cn(
                'relative flex min-w-[3px] items-center whitespace-nowrap first:rounded-l-lg last:rounded-r-lg',
                p.text ?? 'text-black',
                pct >= 7 && 'overflow-hidden px-3',
              )}
              style={{ width: `${pct}%`, background: p.color }}
            >
              {pct >= 7 ? (
                (p.inside ?? `${Math.round(pct)}%`)
              ) : (
                // Too thin to hold its number, so it is written just past the bar's end
                <span className="absolute top-full left-0 mt-0.5 font-semibold text-2xs text-primary">
                  {p.inside ?? `${Math.round(pct)}%`}
                </span>
              )}
            </span>
          )
        })}
      </div>
      {legend && (
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs">
          {parts.map((p) => (
            <span key={p.key} className="flex items-center gap-1.5">
              <Swatch color={p.color} className="size-2" />
              <span className="text-secondary">{p.label}</span>
              <b className="tabular-nums">{Math.round(share(p.value))}%</b>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Width of an element, for layouts that place things in pixels */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

export const PAYERS = mock.payers
export const TIPS = mock.tips
export const PERIOD = mock.period
export const SPEED = mock.speedHeadline
