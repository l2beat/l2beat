import { useMemo, useRef } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

/**
 * How the flags look:
 * - `pill`: a bordered pill with a dot, on a stem
 * - `label`: just the name and a small dot, no box, on a faint stem
 * - `rail`: a hairline the dates sit on as ticks, names in small type above
 */
export type FlagLook = 'pill' | 'label' | 'rail'

interface Props {
  upgrades: GasFeesUpgrade[]
  /** The first and last timestamps on the chart's x axis */
  domain: [number, number] | undefined
  highlightedUpgradeId: string | undefined
  setHighlightedUpgradeId: (id: string | undefined) => void
  selectedUpgradeId: string | undefined
  setSelectedUpgradeId: (id: string | undefined) => void
  look?: FlagLook
}

/** The gap from the flags' bottom edge to the plot's top, which the stems cross */
const STEM_REACH = 32
const GAP = 8

const LOOKS: Record<
  FlagLook,
  {
    lanes: number
    laneHeight: number
    font: string
    /** Room beside the name: the dot, its gap, padding and border */
    pad: number
  }
> = {
  pill: { lanes: 2, laneHeight: 24, font: '600 12px', pad: 26 },
  label: { lanes: 2, laneHeight: 20, font: '500 12px', pad: 12 },
  rail: { lanes: 1, laneHeight: 18, font: '500 11px', pad: 6 },
}

interface Flag {
  upgrade: GasFeesUpgrade
  x: number
  /** null: no room for its name, so only its stem and dot show */
  lane: number | null
  left: number
  width: number
}

/**
 * The upgrades as flags over the plot, at their dates on its x axis, each a
 * name on a stem that runs down to the plot's hairline. Names take a free
 * lane; one that fits none keeps only its dot. Gas limit raises are dots.
 */
export function UpgradeFlags({
  upgrades,
  domain,
  highlightedUpgradeId,
  setHighlightedUpgradeId,
  selectedUpgradeId,
  setSelectedUpgradeId,
  look = 'pill',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const style = LOOKS[look]
  const flags = useMemo(() => {
    if (!width || !domain) return []
    const measure = textMeasurer(ref.current, style.font)
    return placeFlags(upgrades, domain, width, style.lanes, (title) =>
      Math.ceil(measure(title) + style.pad),
    )
  }, [upgrades, domain, width, style])
  // Only as many lanes as the names need at this width
  const usedLanes = Math.max(1, ...flags.map((f) => (f.lane ?? -1) + 1))
  const height =
    look === 'rail' ? style.laneHeight + 12 : style.laneHeight * usedLanes + 10
  // The rail's hairline, which the names sit above and the ticks sit on
  const railY = height - 5

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {look === 'rail' && (
        <span
          aria-hidden
          className="absolute inset-x-0 h-px bg-divider"
          style={{ top: railY }}
        />
      )}
      {flags.map((flag) => {
        const { upgrade } = flag
        const isSelected = selectedUpgradeId === upgrade.id
        const isActive = isSelected || highlightedUpgradeId === upgrade.id
        const isGasLimit = upgrade.kind === 'gasLimit'
        const handlers = {
          onMouseEnter: () => setHighlightedUpgradeId(upgrade.id),
          onMouseLeave: () => setHighlightedUpgradeId(undefined),
          onFocus: () => setHighlightedUpgradeId(upgrade.id),
          onBlur: () => setHighlightedUpgradeId(undefined),
          onClick: () =>
            setSelectedUpgradeId(isSelected ? undefined : upgrade.id),
          'aria-pressed': isSelected,
          'aria-label': `${upgrade.title}, ${formatTimestamp(upgrade.timestamp ?? 0)}`,
          title: `${upgrade.title} · ${formatTimestamp(upgrade.timestamp ?? 0)}`,
        }
        const top =
          look === 'rail'
            ? 0
            : flag.lane === null
              ? height - 8
              : flag.lane * style.laneHeight
        const stemTop =
          look === 'rail'
            ? railY
            : top + (flag.lane === null ? 4 : style.laneHeight - 6)

        return (
          <div key={upgrade.id} className={cn(isActive && 'z-10')}>
            {/* The stem, from the name down into the plot's hairline */}
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute w-px',
                isActive
                  ? 'bg-brand'
                  : look === 'pill'
                    ? 'bg-secondary/35'
                    : 'bg-secondary/20',
                isGasLimit && !isActive && 'bg-secondary/15',
              )}
              style={{ left: flag.x, top: stemTop, bottom: -STEM_REACH }}
            />
            {look === 'rail' ? (
              <RailMark
                flag={flag}
                railY={railY}
                isActive={isActive}
                isSelected={isSelected}
                handlers={handlers}
              />
            ) : flag.lane === null ? (
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
            ) : look === 'pill' ? (
              <button
                type="button"
                {...handlers}
                className={cn(
                  'absolute flex h-5 items-center gap-1 whitespace-nowrap rounded-full border px-1.5 font-semibold text-2xs leading-none transition-colors',
                  isSelected
                    ? 'border-brand bg-brand text-white'
                    : isActive
                      ? 'border-brand bg-surface-primary'
                      : 'border-divider bg-surface-primary hover:border-brand',
                )}
                style={{ left: flag.left, top }}
              >
                <span
                  className={cn(
                    'size-1.5 shrink-0 rounded-full',
                    isSelected ? 'bg-white' : 'bg-brand',
                  )}
                />
                {upgrade.title}
              </button>
            ) : (
              <button
                type="button"
                {...handlers}
                className={cn(
                  'absolute flex h-4 items-center gap-1 whitespace-nowrap font-medium text-2xs leading-none transition-colors',
                  isActive ? 'text-brand' : 'text-secondary hover:text-primary',
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

/** A tick on the rail, its name above it when there is room */
function RailMark({
  flag,
  railY,
  isActive,
  isSelected,
  handlers,
}: {
  flag: Flag
  railY: number
  isActive: boolean
  isSelected: boolean
  handlers: React.ButtonHTMLAttributes<HTMLButtonElement>
}) {
  const isGasLimit = flag.upgrade.kind === 'gasLimit'
  return (
    <button
      type="button"
      {...handlers}
      className="group absolute inset-y-0"
      style={{
        left: flag.lane === null ? flag.x - 5 : flag.left,
        width: flag.lane === null ? 10 : flag.width,
      }}
    >
      {flag.lane !== null && (
        <span
          className={cn(
            'absolute top-0 left-0 whitespace-nowrap font-medium text-[11px] leading-none transition-colors',
            isActive ? 'text-brand' : 'text-secondary group-hover:text-primary',
            isSelected && 'font-bold',
          )}
        >
          {flag.upgrade.title}
        </span>
      )}
      <span
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 absolute rounded-full transition-transform',
          isGasLimit
            ? 'size-1.5 border border-secondary/70 bg-surface-primary'
            : 'size-[7px] bg-brand',
          isActive && 'scale-150 border-brand bg-brand',
        )}
        style={{
          left: flag.lane === null ? 5 : flag.x - flag.left,
          top: railY,
        }}
      />
    </button>
  )
}

/** Measures names in the page's own font, so a flag is as wide as its name */
function textMeasurer(element: HTMLElement | null, font: string) {
  const family = element
    ? getComputedStyle(element).fontFamily
    : 'Roboto, Arial, sans-serif'
  const context = document.createElement('canvas').getContext('2d')
  if (!context) return (text: string) => text.length * 7
  context.font = `${font} ${family}`
  return (text: string) => context.measureText(text).width
}

/**
 * From the right, where upgrades crowd: each name takes the lane that keeps
 * it closest to its date without overlapping the name after it, and only
 * its dot when no lane has room
 */
function placeFlags(
  upgrades: GasFeesUpgrade[],
  [first, last]: [number, number],
  width: number,
  lanes: number,
  flagWidth: (title: string) => number,
): Flag[] {
  const span = Math.max(1, last - first)
  // The plot ends a pixel short of the container, for its right margin
  const toX = (t: number) => ((t - first) / span) * (width - 1)
  const dated = upgrades
    .filter(
      (u): u is GasFeesUpgrade & { timestamp: number } =>
        u.timestamp !== null && u.timestamp >= first && u.timestamp <= last,
    )
    .sort((a, b) => b.timestamp - a.timestamp)
  const starts = Array.from({ length: lanes }, () => width + GAP)
  const flags: Flag[] = []
  for (const upgrade of dated) {
    const x = toX(upgrade.timestamp)
    if (upgrade.kind === 'gasLimit') {
      flags.push({ upgrade, x, lane: null, left: x, width: 0 })
      continue
    }
    const w = flagWidth(upgrade.title)
    let best: { lane: number; left: number; cost: number } | undefined
    for (const [lane, start] of starts.entries()) {
      // The name starts at its stem, or as far left of it as room needs
      const left = Math.max(0, Math.min(x - 4, start - GAP - w, width - w))
      if (left + w > start - GAP + 0.5 || left > x || left + w < x) continue
      const cost = Math.abs(left - (x - 4)) + lane * 2
      if (!best || cost < best.cost) best = { lane, left, cost }
    }
    if (best) {
      starts[best.lane] = best.left
      flags.push({ upgrade, x, lane: best.lane, left: best.left, width: w })
    } else {
      flags.push({ upgrade, x, lane: null, left: x, width: 0 })
    }
  }
  return flags
}
