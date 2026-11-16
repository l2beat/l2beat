import { useState } from 'react'
import { cn } from '~/utils/cn'
import { formatFee } from '../../metrics'
import mock from '../../pageMock.json'
import { BANDS, OURS } from './shared'

/**
 * A copy of GasFeesPriceOfSpeed's curve for the top card variants: the marks
 * take the tip band colours and their labels are short and kept apart
 */
const CURVE = mock.speedCurve
const X_MAX =
  Math.max(
    ...CURVE.dots.map((dot) => dot.usd),
    ...CURVE.marks.map((mark) => mark.usd),
  ) * 1.04
const Y_MIN = 15
const Y_MAX = 55
const X_TICKS = [0, 0.05, 0.1, 0.15, 0.2].filter((value) => value <= X_MAX)
const Y_TICKS = [20, 30, 40, 50]
const left = (usd: number) => (usd / X_MAX) * 100
const top = (seconds: number) => (1 - (seconds - Y_MIN) / (Y_MAX - Y_MIN)) * 100
const rangeEdge = (gwei: number) =>
  gwei < 0.1 ? `${Number(gwei.toPrecision(2))}` : gwei.toFixed(2)
const transactions = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

export type SpeedMark = (typeof CURVE.marks)[number] & { color: string }

/** The marks in their colours: ours in ink, the round tips in their band's */
export const SPEED_MARKS: SpeedMark[] = (() => {
  let band = 0
  return CURVE.marks.map((mark) => ({
    ...mark,
    color: mark.ours ? OURS : (BANDS[band++]?.color ?? OURS),
  }))
})()

export function SpeedCurve({
  className,
  detail = false,
  readout = true,
  compact = false,
}: {
  /** Height of the plot */
  className?: string
  /** Writes each mark's cost and seconds beside its name */
  detail?: boolean
  /** The hovered tip range above the plot */
  readout?: boolean
  /** Fewer ticks, no axis title, for a narrow column */
  compact?: boolean
}) {
  const [hovered, setHovered] = useState<number>()
  const point = hovered === undefined ? undefined : CURVE.dots[hovered]

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const usd = ((event.clientX - box.left) / box.width) * X_MAX
    let nearest = 0
    CURVE.dots.forEach((candidate, i) => {
      const best = CURVE.dots[nearest]
      if (best && Math.abs(candidate.usd - usd) < Math.abs(best.usd - usd)) {
        nearest = i
      }
    })
    setHovered(nearest)
  }

  const xTicks = compact ? X_TICKS.filter((_, i) => i % 2 === 0) : X_TICKS

  return (
    <div className="flex flex-col gap-2">
      {readout && (
        <div className="flex flex-wrap justify-between gap-x-4 text-2xs text-secondary tabular-nums">
          <span>99% sure you’re in within</span>
          <span className={cn(!point && 'invisible')}>
            {point
              ? `${rangeEdge(point.from)}–${rangeEdge(point.to)} gwei · ${transactions.format(point.n)} txs · ${formatFee(point.usd)} · ${point.seconds}s`
              : '0.000–0.000 gwei · 000K txs · $0.000 · 00s'}
          </span>
        </div>
      )}
      <div className="pb-5 pl-7">
        <div
          className={cn('relative h-56 touch-none', className)}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until you can be 99% sure you're in, against the cost of an ERC-20 transfer: it falls quickly up to our estimated fast tip, then barely moves"
        >
          {Y_TICKS.map((value) => (
            <div
              key={value}
              className="absolute inset-x-0 border-divider border-t"
              style={{ top: `${top(value)}%` }}
            >
              <span className="-translate-y-1/2 absolute right-full mr-2 text-2xs text-secondary tabular-nums">
                {value}s
              </span>
            </div>
          ))}
          {xTicks.map((value) => (
            <span
              key={value}
              className="-translate-x-1/2 absolute top-full mt-1 text-2xs text-secondary tabular-nums"
              style={{ left: `${left(value)}%` }}
            >
              {value === 0 ? '$0' : `$${value.toFixed(2)}`}
            </span>
          ))}
          <svg
            className="absolute inset-0 size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              points={CURVE.line
                .map((p) => `${left(p.usd)},${top(p.seconds)}`)
                .join(' ')}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {CURVE.dots.map((dot) => (
            <span
              key={dot.usd}
              className={cn(
                '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-1.5 rounded-full',
                dot === point ? 'bg-primary' : 'bg-secondary/45',
              )}
              style={{ left: `${left(dot.usd)}%`, top: `${top(dot.seconds)}%` }}
            />
          ))}
          {point && (
            <div
              className="pointer-events-none absolute inset-y-0 border-secondary border-l border-dashed"
              style={{ left: `${left(point.usd)}%` }}
            />
          )}
          {SPEED_MARKS.map((mark, i) => {
            const last = i === SPEED_MARKS.length - 1
            return (
              <div
                key={mark.name}
                className="pointer-events-none absolute"
                style={{
                  left: `${left(mark.usd)}%`,
                  top: `${top(mark.seconds)}%`,
                }}
              >
                <span
                  className="-translate-x-1/2 -translate-y-1/2 absolute size-3.5 rounded-full ring-[2.5px] ring-surface-primary"
                  style={{ background: mark.color }}
                />
                <span
                  className={cn(
                    'absolute whitespace-nowrap text-2xs tabular-nums leading-none',
                    mark.ours ? 'top-3 font-bold' : 'bottom-3 font-semibold',
                    i === 0 || mark.ours
                      ? '-left-1.5'
                      : last
                        ? '-right-1.5'
                        : '-translate-x-1/2',
                  )}
                >
                  {mark.ours ? 'Our estimated fast tip' : mark.name}
                  {detail && (
                    <span className="font-normal text-secondary max-md:hidden">
                      {' '}
                      {formatFee(mark.cost)} · {mark.seconds}s
                    </span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      {!compact && (
        <span className="text-center text-2xs text-secondary">
          Cost of an ERC-20 transfer
        </span>
      )}
    </div>
  )
}
