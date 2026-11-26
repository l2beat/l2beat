import { useState } from 'react'
import type { GasFeesPriceOfSpeed as PriceOfSpeed } from '~/server/features/gas-fees/getGasFeesTipping'
import { cn } from '~/utils/cn'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import { formatFee, formatPeriod, formatPeriodDays } from './format'
import { Info, Label, NoDataYet } from './parts'
import { BandStrip, OURS, OVER, TIP_BANDS } from './tipParts'

/** What paying more buys: one transaction moves in 12 second jumps, so the seconds are about how soon you can be sure */
export function GasFeesPriceOfSpeed({
  speed,
}: {
  speed: PriceOfSpeed | undefined
}) {
  if (!speed) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label>Price of speed</Label>
        <NoDataYet />
      </div>
    )
  }
  const versus = speed.fastVsTwoGwei
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>
          Price of speed{DOT_SEPARATOR}
          {formatPeriodDays(speed.period)}
          <Info about="the price of speed">
            Seconds until you can be 99% sure you’re in, against what the tip
            adds to the cost of an ERC-20 transfer.
          </Info>
        </Label>
        {versus && (
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="whitespace-nowrap font-bold text-4xl text-brand-deep tabular-nums tracking-tight">
              +{formatFee(versus.extraUsd)}
            </span>
            <span className="text-secondary text-sm">
              a transfer for 2 gwei over our estimated fast tip gets you in{' '}
              <Sooner
                from={Math.round(versus.fastSeconds)}
                to={Math.round(versus.twoGweiSeconds)}
              />
              , 99% sure
            </span>
          </span>
        )}
      </div>
      <SpeedPlot speed={speed} />
      <p className="text-2xs text-secondary">
        {speed.period.missingDays > 0 && `${formatPeriod(speed.period)}. `}
        Each dot is the transactions in one narrow tip range. Each block you
        miss adds 12 seconds.
      </p>
    </div>
  )
}

function Sooner({ from, to }: { from: number; to: number }) {
  if (to >= from) {
    return (
      <>
        <b className="text-primary">no sooner</b>:{' '}
        {to === from ? `${from}s either way` : `${from}s against ${to}s`}
      </>
    )
  }
  return (
    <>
      <b className="text-primary">{from - to}s sooner</b>: {from}s to {to}s
    </>
  )
}

/** Ranges are 0.05 gwei wide from 0.1 gwei up, and narrower below */
const rangeEdge = (gwei: number) =>
  gwei < 0.1 ? `${Number(gwei.toPrecision(2))}` : gwei.toFixed(2)
const transactions = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** Dollars on a true scale, so the flat part looks as long as it is expensive */
function SpeedPlot({ speed }: { speed: PriceOfSpeed }) {
  const [hovered, setHovered] = useState<number>()
  const point = hovered === undefined ? undefined : speed.dots[hovered]
  const { xMax, xTicks, yMin, yMax, yTicks } = getAxes(speed)
  const left = (usd: number) =>
    xMax > 0 ? Math.min(100, (usd / xMax) * 100) : 0
  const top = (wait: number) => (1 - (wait - yMin) / (yMax - yMin)) * 100
  const ours = speed.fastTip
  // The line keeps falling past our mark, so our name goes under it as far along as the name runs
  const pastOurName =
    ours &&
    (lineFrom(speed.line, ours.usd + xMax * 0.3)[0] ?? speed.line.at(-1))
  const toPoints = (line: PriceOfSpeed['line']) =>
    line.map((p) => `${left(p.usd)},${top(p.seconds)}`).join(' ')

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
      <div className="flex flex-wrap justify-between gap-x-4 text-2xs tabular-nums">
        <span className="text-secondary">99% sure you’re in within</span>
        <span className={cn(!point && 'invisible')}>
          {(point
            ? [
                `${rangeEdge(point.fromGwei)}–${rangeEdge(point.toGwei)} gwei`,
                `${transactions.format(point.txCount)} txs`,
                formatFee(point.usd),
                `${point.seconds}s`,
              ]
            : // Holds the room of a readout, so hovering moves nothing
              ['0.000–0.000 gwei', '000K txs', '$0.000', '00s']
          ).join(DOT_SEPARATOR)}
        </span>
      </div>
      <div className="pb-5 pl-8">
        <div
          className="relative h-64 touch-pan-y md:h-[340px]"
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(undefined)}
          role="img"
          aria-label="Seconds until you can be 99% sure you're in, against what the tip adds to the cost of an ERC-20 transfer"
        >
          {ours && (
            <div
              className="absolute inset-y-0 right-0"
              style={{
                left: `${left(ours.usd)}%`,
                background: `linear-gradient(90deg, color-mix(in oklab, ${OVER} 9%, transparent), color-mix(in oklab, ${OVER} 3%, transparent))`,
              }}
            >
              <span className="absolute top-2 left-3 font-semibold text-2xs text-brand-deep uppercase tracking-wider">
                Above our estimated fast tip
              </span>
            </div>
          )}
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
              className={cn(
                'absolute top-full mt-1.5 text-2xs text-secondary tabular-nums',
                value > 0 && '-translate-x-1/2',
              )}
              style={{ left: `${left(value)}%` }}
            >
              {value === 0 ? '$0' : formatFee(value)}
            </span>
          ))}
          <svg
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              points={toPoints(speed.line)}
              fill="none"
              stroke={OURS}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {ours && (
              <polyline
                points={toPoints(lineFrom(speed.line, ours.usd))}
                fill="none"
                stroke={OVER}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
          {/* The tip bands along the floor, in the colours of the marks */}
          <BandStrip
            toX={(gwei) => left(gwei * speed.usdPerGwei)}
            className="absolute inset-x-0 bottom-0 h-1 translate-y-1/2"
          />
          {/* A thin tip range can sit minutes off the line: hovering still reads it out */}
          {speed.dots
            .filter((dot) => dot.seconds >= yMin && dot.seconds <= yMax)
            .map((dot) => (
              <span
                key={dot.fromGwei}
                className={cn(
                  '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute size-1.5 rounded-full',
                  dot === point ? 'bg-primary' : 'bg-secondary/45',
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
          {speed.roundTips.map((tip, i) => (
            <Mark
              key={tip.gwei}
              name={`${tip.gwei} gwei`}
              point={tip}
              left={left(tip.usd)}
              top={top(tip.seconds)}
              // The band a round tip closes: 0.1 gwei is the top of the lowest
              color={
                (
                  TIP_BANDS.find((band) => tip.gwei <= band.maxGwei) ??
                  TIP_BANDS[2]
                ).color
              }
              className="size-4"
              labelClassName={cn(
                'bottom-4',
                i === 0
                  ? '-left-2'
                  : i === speed.roundTips.length - 1
                    ? '-right-2 items-end'
                    : '-translate-x-1/2 items-center',
              )}
            />
          ))}
          {ours && (
            <Mark
              name="Our estimated fast tip"
              point={ours}
              left={left(ours.usd)}
              top={top(ours.seconds)}
              labelTop={Math.max(
                top(ours.seconds),
                pastOurName ? top(pastOurName.seconds) : 0,
              )}
              color={OURS}
              className="size-[18px]"
              labelClassName="top-4 -left-2"
            />
          )}
        </div>
      </div>
      <span className="text-center text-2xs text-secondary">
        What the tip adds to an ERC-20 transfer
      </span>
    </div>
  )
}

/** A dot on the plot and its name, which sits at the dot unless given its own height */
function Mark({
  name,
  point,
  left,
  top,
  labelTop = top,
  color,
  className,
  labelClassName,
}: {
  name: string
  point: PriceOfSpeed['line'][number]
  /** In percent of the plot */
  left: number
  top: number
  labelTop?: number
  color: string
  className: string
  labelClassName: string
}) {
  return (
    <>
      <span
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute rounded-full ring-[3px] ring-surface-primary',
          className,
        )}
        style={{ left: `${left}%`, top: `${top}%`, background: color }}
      />
      <div
        className="pointer-events-none absolute"
        style={{ left: `${left}%`, top: `${labelTop}%` }}
      >
        <span
          className={cn(
            'absolute flex flex-col whitespace-nowrap text-xs tabular-nums leading-tight',
            labelClassName,
          )}
        >
          <b>{name}</b>
          <span className="text-2xs text-secondary max-md:hidden">
            {formatFee(point.usd)}
            {DOT_SEPARATOR}
            {Math.round(point.seconds)}s
          </span>
        </span>
      </div>
    </>
  )
}

/** The line from a cost on, starting exactly there */
function lineFrom(line: PriceOfSpeed['line'], usd: number) {
  const i = line.findIndex((p) => p.usd >= usd)
  const after = line[i]
  const before = line[i - 1]
  if (!after) return []
  if (!before) return line.slice(i)
  const t = (usd - before.usd) / (after.usd - before.usd)
  const start = {
    usd,
    seconds: before.seconds + (after.seconds - before.seconds) * t,
  }
  return [start, ...line.slice(i)]
}

/**
 * Room around the line and the marks, with ticks on round values. The dots
 * don't set the waits shown: one thin tip range can sit minutes off the line.
 */
function getAxes(speed: PriceOfSpeed) {
  const marks = [...speed.roundTips, ...(speed.fastTip ? [speed.fastTip] : [])]
  const xMax = Math.max(...[...speed.dots, ...marks].map((p) => p.usd)) * 1.05
  const waits = [...speed.line, ...marks].map((p) => p.seconds)
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
