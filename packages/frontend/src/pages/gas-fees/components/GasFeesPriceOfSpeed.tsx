import { useState } from 'react'
import type { GasFeesPriceOfSpeed as PriceOfSpeed } from '~/server/features/gas-fees/getGasFeesTipping'
import { cn } from '~/utils/cn'
import { formatFee } from './metrics'
import { formatPeriod, NoDataYet } from './parts'

/** What paying more buys: one transaction moves in 12 second jumps, so the seconds are about how soon you can be sure */
export function GasFeesPriceOfSpeed({
  speed,
}: {
  speed: PriceOfSpeed | undefined
}) {
  if (!speed) {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">Price of speed</h3>
        <NoDataYet />
      </div>
    )
  }
  const versus = speed.fastVsTwoGwei
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">Price of speed</h3>
        {versus && (
          <p className="font-medium text-base">
            Paying 2 gwei instead of our fast tip costs{' '}
            {formatFee(versus.extraUsd)} more on every transfer, and the wait
            you can be 99% sure of{' '}
            {seconds(versus.fastSeconds) === seconds(versus.twoGweiSeconds)
              ? `stays at ${seconds(versus.fastSeconds)}`
              : `goes from ${seconds(versus.fastSeconds)} to ${seconds(versus.twoGweiSeconds)}`}{' '}
            seconds.
          </p>
        )}
        <p className="text-secondary text-xs">
          From real transactions, {formatPeriod(speed.period)}. Each block you
          miss adds 12 seconds. Each dot is the transactions in one narrow tip
          range, at their average tip.
        </p>
      </div>
      <SpeedCurve speed={speed} />
    </div>
  )
}

const seconds = (value: number) => `${Math.round(value)}`
/** Ranges are 0.05 gwei wide from 0.1 gwei up, and narrower below */
const rangeEdge = (gwei: number) =>
  gwei < 0.1 ? `${Number(gwei.toPrecision(2))}` : gwei.toFixed(2)
const transactions = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** Dollars on a true scale, so the flat part looks as long as it is expensive */
function SpeedCurve({ speed }: { speed: PriceOfSpeed }) {
  const [hovered, setHovered] = useState<number>()
  const point = hovered === undefined ? undefined : speed.dots[hovered]
  const { xMax, xTicks, yMin, yMax, yTicks } = getAxes(speed)
  const left = (usd: number) => (usd / xMax) * 100
  const top = (wait: number) => (1 - (wait - yMin) / (yMax - yMin)) * 100

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const usd = ((event.clientX - box.left) / box.width) * xMax
    let nearest = 0
    speed.dots.forEach((candidate, i) => {
      const best = speed.dots[nearest]
      if (best && Math.abs(candidate.usd - usd) < Math.abs(best.usd - usd)) {
        nearest = i
      }
    })
    setHovered(nearest)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap justify-between gap-x-4 text-xs tabular-nums">
        <span className="text-secondary">99% sure within</span>
        <span className={cn(!point && 'invisible')}>
          {point
            ? `${rangeEdge(point.fromGwei)} to ${rangeEdge(point.toGwei)} gwei (${transactions.format(point.txCount)} transactions): ${formatFee(point.usd)}, ${point.seconds}s`
            : '0.000 to 0.000 gwei (000K transactions): $0.000, 00s'}
        </span>
      </div>
      <div className="pb-5 pl-8">
        <div
          className="relative h-56 touch-none md:h-64"
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until you can be 99% sure you're in, against what the tip adds to the cost of an ERC-20 transfer"
        >
          {yTicks.map((value) => (
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
              {value === 0 ? '$0' : formatFee(value)}
            </span>
          ))}
          <svg
            className="absolute inset-0 size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              points={speed.line
                .map((p) => `${left(p.usd)},${top(p.seconds)}`)
                .join(' ')}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* A thin tip range can sit minutes off the line: hovering still reads it out */}
          {speed.dots
            .filter((dot) => dot.seconds <= yMax)
            .map((dot) => (
              <span
                key={dot.fromGwei}
                className={cn(
                  '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-1.5 rounded-full',
                  dot === point ? 'bg-primary' : 'bg-secondary/60',
                )}
                style={{
                  left: `${left(dot.usd)}%`,
                  top: `${top(dot.seconds)}%`,
                }}
              />
            ))}
          {point && (
            <div
              className="pointer-events-none absolute inset-y-0 border-secondary border-l border-dashed"
              style={{ left: `${left(point.usd)}%` }}
            />
          )}
          {speed.marks.map((mark, i) => (
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
                    : i === speed.marks.length - 1
                      ? 'bg-brand'
                      : 'bg-primary',
                )}
              />
              <span
                className={cn(
                  'absolute whitespace-nowrap text-xs tabular-nums',
                  mark.ours ? 'top-2.5 font-bold' : 'bottom-2.5',
                  // Our fast tip can be close to a round one, and on a phone both labels sit above the line
                  mark.ours
                    ? '-left-1'
                    : i === speed.marks.length - 1
                      ? '-right-1'
                      : i === 0
                        ? '-left-1 max-md:hidden'
                        : 'md:-translate-x-1/2 max-md:hidden',
                )}
              >
                {mark.name}
                <span className="max-md:hidden">: {formatFee(mark.usd)}</span>,{' '}
                {seconds(mark.seconds)}s
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

/**
 * Room around the line and the marks, with ticks on round values. The dots
 * don't set the waits shown: one thin tip range can sit minutes off the line.
 */
function getAxes(speed: PriceOfSpeed) {
  const xMax =
    Math.max(...[...speed.dots, ...speed.marks].map((p) => p.usd)) * 1.05
  const waits = [...speed.line, ...speed.marks].map((p) => p.seconds)
  const yStep = Math.max(
    10,
    getRoundStep((Math.max(...waits) - Math.min(...waits)) / 5),
  )
  const yMin = Math.floor(Math.min(...waits) / yStep) * yStep - yStep / 2
  const yMax = Math.ceil(Math.max(...waits) / yStep) * yStep + yStep / 2
  const xStep = getRoundStep(xMax / 5)
  return {
    xMax,
    xTicks: getTicks(0, xMax, xStep),
    yMin,
    yMax,
    yTicks: getTicks(yMin + yStep / 2, yMax, yStep),
  }
}

/** 1, 2 or 5 times a power of ten, at least `smallest` */
function getRoundStep(smallest: number) {
  const power = 10 ** Math.floor(Math.log10(smallest))
  return [1, 2, 5, 10].map((m) => m * power).find((s) => s >= smallest) ?? power
}

function getTicks(from: number, to: number, step: number) {
  // Costs that are all zero leave no step to walk
  if (step <= 0) return [from]
  const ticks: number[] = []
  // Whole steps, so that sums of a step like 0.05 don't drift
  for (let i = 0; from + i * step <= to; i++) {
    ticks.push(Number((from + i * step).toPrecision(12)))
  }
  return ticks
}
