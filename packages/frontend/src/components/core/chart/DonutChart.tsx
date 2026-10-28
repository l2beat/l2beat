import { arc, type PieArcDatum, pie } from 'd3-shape'
import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { cn } from '~/utils/cn'
import { ChartContext, type ChartMeta } from './ChartContext'

export interface DonutChartEntry {
  name: string
  value: number
  fill: string
}

const TOOLTIP_OFFSET = 16
/** The least room left between a tooltip and the window's edge. */
const TOOLTIP_WINDOW_MARGIN = 8

/**
 * A donut whose first slice starts at 3 o'clock
 * and the slices go counter-clockwise, in data order. Hovering a slice shows
 * the tooltip next to the slice's middle (left of it on the right half), or
 * at `tooltipPosition`, relative to the chart's top-left corner.
 */
export function DonutChart<T extends DonutChartEntry>({
  meta,
  data,
  innerRadius,
  outerRadius,
  center,
  className,
  tooltipPosition,
  ariaLabel,
  renderTooltip,
}: {
  meta: ChartMeta
  ariaLabel: string
  data: T[]
  innerRadius: number
  outerRadius: number
  /** SVG content drawn over the donut, e.g. `<text x="50%" y="50%">`. */
  center?: ReactNode
  /** Sizes the chart; the donut is centred in it. */
  className?: string
  tooltipPosition?: { x: number; y: number }
  renderTooltip: (entry: T) => ReactNode
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const { arcs, path } = useMemo(() => {
    const total = data.reduce((acc, entry) => acc + entry.value, 0)
    // d3 measures clockwise from 12 o'clock; starting at 3 o'clock and going
    // counter-clockwise is d3's π/2..π/2-2π.
    const arcs =
      total > 0
        ? pie<T>()
            .value((entry) => entry.value)
            .sort(null)
            .startAngle(Math.PI / 2)
            .endAngle(Math.PI / 2 - 2 * Math.PI)(data)
        : []
    const path = arc<PieArcDatum<T>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
    return { arcs, path }
  }, [data, innerRadius, outerRadius])

  const active = activeIndex !== null ? arcs[activeIndex] : undefined

  // biome-ignore lint/correctness/useExhaustiveDependencies: placed for each newly hovered slice
  useLayoutEffect(() => {
    const root = rootRef.current
    const tooltip = tooltipRef.current
    if (!active || !root || !tooltip) return
    const width = root.offsetWidth
    const height = root.offsetHeight
    let left: number
    let top: number
    if (tooltipPosition) {
      left = tooltipPosition.x
      top = tooltipPosition.y
    } else {
      const [dx, dy] = path.centroid(active)
      const x = width / 2 + dx
      const y = height / 2 + dy
      left =
        x > width / 2
          ? x - TOOLTIP_OFFSET - tooltip.offsetWidth
          : x + TOOLTIP_OFFSET
      top = y + TOOLTIP_OFFSET
    }
    // The tooltip may leave the chart but not the window.
    const rootLeft = root.getBoundingClientRect().left
    const max = document.documentElement.clientWidth - TOOLTIP_WINDOW_MARGIN
    if (rootLeft + left + tooltip.offsetWidth > max) {
      left = max - tooltip.offsetWidth - rootLeft
    }
    if (rootLeft + left < TOOLTIP_WINDOW_MARGIN) {
      left = TOOLTIP_WINDOW_MARGIN - rootLeft
    }
    tooltip.style.transform = `translate(${left}px, ${top}px)`
  }, [active, path, tooltipPosition?.x, tooltipPosition?.y])

  // A tap leaves a touch tooltip open until a tap elsewhere.
  const isActive = active !== undefined
  useEffect(() => {
    if (!isActive) return
    const closeOutside = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setActiveIndex(null)
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [isActive])

  function onLeave(event: PointerEvent) {
    if (event.pointerType !== 'touch') setActiveIndex(null)
  }

  function onKeyDown(event: KeyboardEvent) {
    // Modified arrows are the browser's, e.g. Alt+Left goes back.
    if (event.altKey || event.ctrlKey || event.metaKey) return
    const step =
      event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (step === 0 || arcs.length === 0) return
    event.preventDefault()
    const from = activeIndex ?? (step > 0 ? -1 : 0)
    setActiveIndex((from + step + arcs.length) % arcs.length)
  }

  return (
    <ChartContext.Provider value={{ meta }}>
      <div
        ref={rootRef}
        role="application"
        aria-label={ariaLabel}
        tabIndex={0}
        data-chart-hover=""
        className={cn('relative select-none text-xs outline-none', className)}
        onKeyDown={onKeyDown}
        onBlur={() => setActiveIndex(null)}
      >
        <svg className="absolute inset-0 size-full" aria-hidden>
          <svg x="50%" y="50%" overflow="visible">
            {arcs.map((d, i) => (
              <path
                key={d.data.name}
                d={path(d) ?? undefined}
                fill={d.data.fill}
                onPointerEnter={() => setActiveIndex(i)}
                onPointerDown={() => setActiveIndex(i)}
                onPointerLeave={onLeave}
              />
            ))}
          </svg>
          {center}
        </svg>
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute top-0 left-0 z-110"
          style={{ visibility: active ? 'visible' : 'hidden' }}
        >
          {active && renderTooltip(active.data)}
        </div>
      </div>
    </ChartContext.Provider>
  )
}
