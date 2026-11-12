import { cn } from '~/utils/cn'
import type { HeadBlock } from '../live/types'
import { posterOf, usePosters } from '../state/posters'

/**
 * A block's blobs as cells up to the max, with the target marked: whether the
 * block was above target reads at a glance. Poster colours only where a
 * legend names them; elsewhere the cells take the chain strip's blob colour.
 */
export function BlobMeter({
  block,
  target,
  max,
  byPoster = false,
}: {
  block: HeadBlock | undefined
  target: number
  max: number
  byPoster?: boolean
}) {
  const posters = usePosters()
  const cells = block
    ? block.blobs.flatMap((p) =>
        Array.from({ length: p.blobs }, () => posterOf(posters, p.posterId)),
      )
    : []
  return (
    <div className="flex h-3 items-stretch gap-[2px]" aria-hidden>
      {Array.from({ length: max }, (_, i) => {
        const poster = cells[i]
        return (
          <div
            key={i}
            className={cn(
              'relative flex-1 rounded-[2px] bg-surface-secondary transition-colors duration-300',
              poster && !byPoster && 'bg-chart-teal',
            )}
            style={
              poster && byPoster ? { background: poster.color } : undefined
            }
            title={byPoster ? poster?.name : undefined}
          >
            {i === target && (
              <div className="-left-[3px] -top-1 -bottom-1 absolute w-0.5 rounded-full bg-primary ring-2 ring-surface-primary" />
            )}
          </div>
        )
      })}
    </div>
  )
}

/** Gas used out of the limit, with the target the base fee steers towards */
export function GasMeter({
  used,
  limit,
  target,
}: {
  used: number | undefined
  limit: number
  target: number
}) {
  const share = used === undefined ? 0 : Math.min(1, used / limit)
  return (
    <div className="relative h-3" aria-hidden>
      <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-surface-secondary">
        <div
          className="h-full origin-left bg-primary/75 transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${share})` }}
        />
      </div>
      <div
        className="-top-1 -bottom-1 absolute w-0.5 rounded-full bg-primary ring-2 ring-surface-primary"
        style={{ left: `calc(${(target / limit) * 100}% - 1px)` }}
      />
    </div>
  )
}
