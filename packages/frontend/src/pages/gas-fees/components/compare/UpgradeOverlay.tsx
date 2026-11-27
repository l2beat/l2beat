import { cn } from '~/utils/cn'
import type { UpgradeSelection } from './useUpgradeSelection'

export interface PlotRect {
  x: number
  y: number
  width: number
  height: number
}

const LANE_HEIGHT = 18
/** Room for a flag's dot and each character, px */
const flagWidth = (title: string) => 16 + title.length * 6.5

/**
 * Over the plot: a line at every upgrade in the range and a flag per
 * upgrade above, in up to two lanes
 */
export function UpgradeOverlay({
  selection,
  plot,
  domain,
}: {
  selection: UpgradeSelection
  plot: PlotRect
  domain: [number, number]
}) {
  const [from, to] = domain
  const xOf = (ts: number) => plot.x + ((ts - from) / (to - from)) * plot.width
  const inRange =
    to > from
      ? selection.past.filter((u) => u.timestamp >= from && u.timestamp <= to)
      : []
  const lanes: [number, number][][] = [[], []]
  const flags = inRange.map((upgrade) => {
    const x = xOf(upgrade.timestamp)
    if (upgrade.kind === 'gasLimit')
      return { upgrade, x, lane: 0, named: false }
    const span: [number, number] = [x - 5, x - 5 + flagWidth(upgrade.title)]
    const lane = lanes.findIndex((taken) =>
      taken.every(([a, b]) => span[1] < a || span[0] > b),
    )
    // With no room in either lane, the flag keeps its dot and the strip names it
    if (lane === -1) return { upgrade, x, lane: 0, named: false }
    lanes[lane]?.push(span)
    return { upgrade, x, lane, named: true }
  })

  return (
    <div className="pointer-events-none absolute inset-0">
      {flags.map(({ upgrade, x, lane, named }) => {
        const active =
          selection.hoveredId === upgrade.id ||
          selection.selected?.id === upgrade.id
        const top = plot.y - 8 - (lane + 1) * LANE_HEIGHT
        return (
          <div key={upgrade.id}>
            <div
              className={cn(
                'absolute w-px',
                active ? 'bg-brand' : 'bg-divider',
              )}
              style={{
                left: x,
                top: top + LANE_HEIGHT / 2,
                height: plot.y + plot.height - top - LANE_HEIGHT / 2,
              }}
            />
            <button
              type="button"
              aria-pressed={selection.selected?.id === upgrade.id}
              aria-label={named ? undefined : upgrade.title}
              className={cn(
                'pointer-events-auto absolute flex items-center gap-1 whitespace-nowrap font-medium text-2xs',
                active ? 'text-brand-deep' : 'text-primary',
              )}
              style={{ left: x - 4, top, height: LANE_HEIGHT }}
              onPointerEnter={() => selection.hover(upgrade.id)}
              onPointerLeave={() => selection.hover(undefined)}
              onClick={() =>
                selection.select(
                  selection.selected?.id === upgrade.id
                    ? undefined
                    : upgrade.id,
                )
              }
            >
              <span
                className={cn(
                  'rounded-full',
                  named
                    ? 'size-[7px] bg-brand'
                    : 'size-[7px] border border-secondary bg-surface-primary',
                )}
              />
              {named && upgrade.title}
            </button>
          </div>
        )
      })}
    </div>
  )
}
