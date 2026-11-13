import { useState } from 'react'
import { cn } from '~/utils/cn'
import { formatFee } from './metrics'
import mock from './pageMock.json'

/** What paying more buys: one transaction moves in 12 second jumps, so the seconds are about how soon you can be sure */
export function GasFeesPriceOfSpeed() {
  const { extra, fromSure, toSure } = mock.speedHeadline
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">Price of speed</h3>
        <p className="font-medium text-base">
          Paying 2 gwei instead of our fast tip costs {formatFee(extra)} more on
          every transfer, and shortens the wait you can be 99% sure of from{' '}
          {fromSure} to {toSure} seconds.
        </p>
        <p className="text-secondary text-xs">
          From real transactions, {mock.period}. Each block you miss adds 12
          seconds. Each dot is the transactions in one narrow tip range, at
          their average tip.
        </p>
      </div>
      <SpeedCurve />
    </div>
  )
}

const CURVE = mock.speedCurve
const X_MAX =
  Math.max(
    ...CURVE.dots.map((dot) => dot.usd),
    ...CURVE.marks.map((mark) => mark.usd),
  ) * 1.05
const Y_MIN = 15
const Y_MAX = 55
const X_TICKS = [0, 0.05, 0.1, 0.15, 0.2, 0.25].filter(
  (value) => value <= X_MAX,
)
const Y_TICKS = [20, 30, 40, 50]
const left = (usd: number) => (usd / X_MAX) * 100
const top = (seconds: number) => (1 - (seconds - Y_MIN) / (Y_MAX - Y_MIN)) * 100
/** Ranges are 0.05 gwei wide from 0.1 gwei up, and narrower below */
const rangeEdge = (gwei: number) =>
  gwei < 0.1 ? `${Number(gwei.toPrecision(2))}` : gwei.toFixed(2)
const transactions = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** Dollars on a true scale, so the flat part looks as long as it is expensive */
function SpeedCurve() {
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap justify-between gap-x-4 text-secondary text-xs tabular-nums">
        <span>99% sure within</span>
        <span className={cn(!point && 'invisible')}>
          {point
            ? `${rangeEdge(point.from)} to ${rangeEdge(point.to)} gwei (${transactions.format(point.n)} transactions): ${formatFee(point.usd)}, ${point.seconds}s`
            : '0.000 to 0.000 gwei (000K transactions): $0.000, 00s'}
        </span>
      </div>
      <div className="pb-5 pl-8">
        <div
          className="relative h-56 touch-none md:h-64"
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until you can be 99% sure you're in, against the cost of an ERC-20 transfer: it falls quickly up to our fast tip, then barely moves"
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
          {X_TICKS.map((value) => (
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
              strokeWidth={2.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {CURVE.dots.map((dot) => (
            <span
              key={dot.usd}
              className={cn(
                '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-1.5 rounded-full',
                dot === point ? 'bg-primary' : 'bg-secondary/60',
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
          {CURVE.marks.map((mark, i) => (
            <div
              key={mark.name}
              className="pointer-events-none absolute"
              style={{
                left: `${left(mark.usd)}%`,
                top: `${top(mark.seconds)}%`,
              }}
            >
              <span
                className={cn(
                  '-translate-x-1/2 -translate-y-1/2 absolute size-3 rounded-full ring-2 ring-surface-primary',
                  mark.ours
                    ? 'bg-chart-stacked-blue'
                    : i === CURVE.marks.length - 1
                      ? 'bg-brand'
                      : 'bg-primary',
                )}
              />
              <span
                className={cn(
                  'absolute whitespace-nowrap text-xs tabular-nums',
                  mark.ours
                    ? 'font-bold max-md:bottom-2.5 md:top-2.5'
                    : 'bottom-2.5',
                  i === 0 || mark.ours
                    ? '-left-1'
                    : i === CURVE.marks.length - 1
                      ? '-right-1'
                      : 'md:-translate-x-1/2 max-md:hidden',
                )}
              >
                {mark.name}
                <span className="max-md:hidden">: {formatFee(mark.cost)}</span>,{' '}
                {mark.seconds}s
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="text-center text-2xs text-secondary">
        Cost on an ERC-20 transfer
      </span>
    </div>
  )
}
