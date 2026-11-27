import { type ReactNode, useRef } from 'react'
import { tooltipSurfaceClassName } from '~/components/core/tooltip/Tooltip'
import { useElementSize } from '~/hooks/useElementSize'
import { cn } from '~/utils/cn'

/**
 * The type scale, one class per role. Every tile draws from these and
 * nothing else, so a title, a figure or a unit reads the same everywhere.
 */
export const TYPE = {
  title: 'font-semibold text-heading-16 leading-5',
  meta: 'font-normal text-label-value-12 text-secondary',
  label: 'font-medium text-label-value-12 text-secondary leading-4',
  hero: 'font-bold @xl:text-heading-48 text-heading-40 leading-none tracking-[-0.02em] tabular-nums',
  figure:
    'font-bold text-heading-28 leading-none tracking-[-0.02em] tabular-nums',
  unit: 'font-medium text-label-value-14 text-secondary',
  value: 'font-medium text-label-value-14 tabular-nums',
  /** Text inside a chart: axis ticks, markers, annotations. */
  axis: 'fill-secondary text-[11px] tabular-nums',
}

/**
 * A bento cell: the card surface over the grid's divider colour, placed by
 * the grid area it sits in, and a size container for its own contents.
 */
export function Tile({
  area,
  className,
  children,
  label,
}: {
  area: string
  className?: string
  children: ReactNode
  label: string
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        'economics-tile @container relative flex min-w-0 flex-col gap-4',
        className,
      )}
      style={{ gridArea: area }}
    >
      {children}
    </section>
  )
}

export function TileTitle({
  children,
  meta,
  right,
}: {
  children: ReactNode
  meta?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="flex min-h-5 items-baseline justify-between gap-x-3">
      <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className={cn(TYPE.title, 'whitespace-nowrap')}>{children}</span>
        {meta && (
          <span className={cn(TYPE.meta, 'whitespace-nowrap')}>{meta}</span>
        )}
      </h3>
      {right}
    </div>
  )
}

/** A tile's figure: an optional label above, the number, its unit. */
export function Figure({
  label,
  value,
  unit,
  after,
  sub,
  className,
}: {
  label?: ReactNode
  value: ReactNode
  unit?: ReactNode
  after?: ReactNode
  sub?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('min-w-0', className)}>
      {label && <div className={cn(TYPE.label, 'mb-2')}>{label}</div>}
      <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <span className={cn(TYPE.figure, 'whitespace-nowrap')}>{value}</span>
        {unit && (
          <span className={cn(TYPE.unit, 'whitespace-nowrap')}>{unit}</span>
        )}
        {after}
      </div>
      {sub && <div className={cn(TYPE.label, 'mt-2')}>{sub}</div>}
    </div>
  )
}

export function Swatch({
  color,
  line,
  dashed,
  className,
}: {
  color: string
  line?: boolean
  dashed?: boolean
  className?: string
}) {
  if (line) {
    return (
      <svg
        width="14"
        height="4"
        viewBox="0 0 14 4"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M0 2h14"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? '3 2' : undefined}
        />
      </svg>
    )
  }
  return (
    <span
      aria-hidden
      className={cn('size-2.5 shrink-0 rounded-[3px]', className)}
      style={{ backgroundColor: color }}
    />
  )
}

/** A chart's legend: always under the chart, left-aligned. */
export function Legend({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-2">{children}</div>
}

export function Key({
  label,
  ...swatch
}: {
  color: string
  label: ReactNode
  line?: boolean
  dashed?: boolean
}) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap font-medium text-label-value-12 text-secondary">
      <Swatch {...swatch} />
      {label}
    </span>
  )
}

/**
 * A chart box's size, after mount; `fallbackWidth` on the server. For a box
 * whose size the layout sets (a flex child that grows), not its contents.
 */
export function useChartSize(minHeight: number, fallbackWidth: number) {
  const ref = useRef<HTMLDivElement>(null)
  const size = useElementSize(ref)
  const width = size.width || fallbackWidth
  const height = Math.max(minHeight, size.height)
  return [
    ref,
    { width, height, svg: chartSvgSize(size.width > 0, width, height) },
  ] as const
}

/**
 * The chart's `<svg>` size. Until the box is measured (server markup, and
 * the moments before the section hydrates) the fallback geometry stretches
 * to the box instead of overflowing it, with text and dots hidden since
 * they would stretch with it.
 */
function chartSvgSize(measured: boolean, width: number, height: number) {
  return measured
    ? { width, height }
    : {
        width: '100%',
        height: '100%',
        viewBox: `0 0 ${width} ${height}`,
        preserveAspectRatio: 'none',
        'data-unmeasured': true,
      }
}

/**
 * A tooltip anchored to a point inside a `relative` box; it flips to the
 * point's left past the box's middle. `contained` pins it to the box's far
 * edge instead, for a box too narrow to hold it beside the point.
 */
export function HoverTip({
  x,
  y,
  width,
  contained,
  children,
}: {
  x: number
  y: number
  width: number
  contained?: boolean
  children: ReactNode
}) {
  const flip = x > width / 2
  const side = contained
    ? { left: flip ? 0 : undefined, right: flip ? undefined : 0 }
    : {
        left: flip ? undefined : x + 14,
        right: flip ? width - x + 14 : undefined,
      }
  return (
    <div
      className={cn(
        tooltipSurfaceClassName,
        'pointer-events-none absolute w-max max-w-[240px]',
      )}
      style={{ top: y, ...side, transform: 'translateY(-50%)' }}
    >
      {children}
    </div>
  )
}

export function TipTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-medium text-label-value-14 text-primary">
      {children}
    </div>
  )
}

export function TipRow({
  color,
  label,
  value,
  line,
}: {
  color?: string
  label: ReactNode
  value: ReactNode
  line?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-x-4 py-0.5">
      <span className="flex items-center gap-1.5 font-medium text-label-value-13">
        {color && <Swatch color={color} line={line} />}
        {label}
      </span>
      <span className="font-medium text-label-value-14 tabular-nums">
        {value}
      </span>
    </div>
  )
}
