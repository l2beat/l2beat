import { useMemo, useRef } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import type { UpgradeSelection } from './useUpgradeSelection'

interface Props {
  upgrades: GasFeesUpgrade[]
  /** The first and last timestamps on the chart's x axis */
  domain: [number, number] | undefined
  selection: UpgradeSelection
}

/** The gap from the flags' bottom edge to the plot's top, which the stems cross */
const STEM_REACH = 32
const GAP = 8
const LANES = 2
const LANE_HEIGHT = 20
const FONT = '500 12px'
/** Room beside a name for its dot */
const NAME_PAD = 12

interface Flag {
  upgrade: GasFeesUpgrade & { timestamp: number }
  x: number
  /** null: no room for its name, so only its stem and dot show */
  lane: number | null
  left: number
}

/**
 * The upgrades as flags over the plot, at their dates on its x axis, each a
 * name on a stem that runs down to the plot. A name takes a free lane, and
 * one that fits none keeps only its dot. Gas limit raises are dots.
 */
export function GasFeesUpgradeFlags({ upgrades, domain, selection }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const flags = useMemo(() => {
    if (!width || !domain) return []
    const measure = getTextMeasurer(ref.current)
    return placeFlags(upgrades, domain, width, (title) =>
      Math.ceil(measure(title) + NAME_PAD),
    )
  }, [upgrades, domain, width])
  // Only as many lanes as the names need at this width
  const usedLanes = Math.max(1, ...flags.map((f) => (f.lane ?? -1) + 1))
  const height = LANE_HEIGHT * usedLanes + 10

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {flags.map((flag) => {
        const { upgrade } = flag
        const isSelected = selection.isSelected(upgrade.id)
        const isActive = selection.isActive(upgrade.id)
        const isGasLimit = upgrade.kind === 'gasLimit'
        const name = `${upgrade.title}${DOT_SEPARATOR}${formatTimestamp(upgrade.timestamp)}`
        const handlers = {
          onMouseEnter: () => selection.highlight(upgrade.id),
          onMouseLeave: () => selection.highlight(undefined),
          onFocus: () => selection.highlight(upgrade.id),
          onBlur: () => selection.highlight(undefined),
          onClick: () => selection.select(isSelected ? undefined : upgrade.id),
          'aria-pressed': isSelected,
          'aria-label': name,
          title: name,
        }
        const top = flag.lane === null ? height - 8 : flag.lane * LANE_HEIGHT

        return (
          <div key={upgrade.id} className={cn(isActive && 'z-10')}>
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute w-px',
                isActive
                  ? 'bg-brand'
                  : isGasLimit
                    ? 'bg-secondary/15'
                    : 'bg-secondary/20',
              )}
              style={{
                left: flag.x,
                top: top + (flag.lane === null ? 4 : LANE_HEIGHT - 6),
                bottom: -STEM_REACH,
              }}
            />
            {flag.lane === null ? (
              <button
                type="button"
                {...handlers}
                className={cn(
                  '-translate-x-1/2 absolute size-2 rounded-full ring-2 ring-surface-primary transition-transform hover:scale-125',
                  isGasLimit
                    ? 'border border-secondary bg-surface-primary'
                    : 'bg-brand',
                  isActive && 'scale-125 border-brand bg-brand',
                )}
                style={{ left: flag.x, top }}
              />
            ) : (
              <button
                type="button"
                {...handlers}
                className={cn(
                  'absolute flex h-4 items-center gap-1 whitespace-nowrap font-medium text-2xs leading-none transition-colors',
                  isActive ? 'text-brand-deep' : 'hover:text-brand-deep',
                  isSelected && 'font-bold',
                )}
                style={{ left: flag.left + 1.5, top }}
              >
                <span
                  className={cn(
                    'size-[5px] shrink-0 rounded-full',
                    isActive ? 'bg-brand' : 'bg-brand/60',
                  )}
                />
                {upgrade.title}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Measures names in the page's own font, so a flag is as wide as its name */
function getTextMeasurer(element: HTMLElement | null) {
  const family = element ? getComputedStyle(element).fontFamily : 'sans-serif'
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return (text: string) => text.length * 7
  context.font = `${FONT} ${family}`
  return (text: string) => context.measureText(text).width
}

/**
 * From the right, where upgrades crowd: each name takes the lane that keeps
 * it closest to its date without overlapping the name after it
 */
function placeFlags(
  upgrades: GasFeesUpgrade[],
  [first, last]: [number, number],
  width: number,
  nameWidth: (title: string) => number,
): Flag[] {
  const span = Math.max(1, last - first)
  // The plot ends a pixel short of the container, for its right margin
  const toX = (timestamp: number) => ((timestamp - first) / span) * (width - 1)
  const dated = upgrades
    .filter(
      (u): u is Flag['upgrade'] =>
        u.timestamp !== null && u.timestamp >= first && u.timestamp <= last,
    )
    .sort((a, b) => b.timestamp - a.timestamp)
  const starts = Array.from({ length: LANES }, () => width + GAP)
  return dated.map((upgrade) => {
    const x = toX(upgrade.timestamp)
    const dot: Flag = { upgrade, x, lane: null, left: x }
    if (upgrade.kind === 'gasLimit') return dot
    const size = nameWidth(upgrade.title)
    let best: { lane: number; left: number; cost: number } | undefined
    for (const [lane, start] of starts.entries()) {
      // The name starts at its stem, or as far left of it as room needs
      const left = Math.max(
        0,
        Math.min(x - 4, start - GAP - size, width - size),
      )
      if (left + size > start - GAP + 0.5 || left > x || left + size < x) {
        continue
      }
      const cost = Math.abs(left - (x - 4)) + lane * 2
      if (!best || cost < best.cost) best = { lane, left, cost }
    }
    if (!best) return dot
    starts[best.lane] = best.left
    return { upgrade, x, lane: best.lane, left: best.left }
  })
}
