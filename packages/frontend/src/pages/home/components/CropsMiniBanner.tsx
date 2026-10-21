import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import { type GardenFlower, GardenFlowers, GardenLandscape } from './GardenSky'

/**
 * On the nearest ridge, which climbs to the right. The strip starts where
 * the subtitle ends, so the hills, rising from the ground there, stay clear
 * of it.
 */
const FLOWERS: GardenFlower[] = [
  { left: '42%', bottom: '3.5%', width: 13 },
  { left: '78%', bottom: '11%', width: 15 },
]

/**
 * The garden as a small highlighted banner: the home page's section tiles
 * start with it on the screens without the sidebar.
 */
export function CropsMiniBanner({
  isActive = false,
  onClick,
  className,
}: {
  isActive?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <a
      href={GARDEN_PATH}
      onClick={onClick}
      data-active={isActive}
      className={cn(
        'group @container/crops relative flex items-center overflow-hidden rounded-md border border-garden-border px-2.5 py-2 outline-none ring-brand transition-colors hover:border-garden-accent/50 focus-visible:ring-2 data-[active=true]:border-garden-accent/60',
        className,
      )}
    >
      <GardenLandscape
        flat
        className="left-[68%]"
        lightClassName="top-[38%] left-[58%] size-12"
      >
        {/* In a narrow tile the subtitle reaches the flowers, so it keeps
            only the hills. */}
        <span className="@max-[165px]/crops:hidden">
          <GardenFlowers flowers={FLOWERS} motion="still" />
        </span>
      </GardenLandscape>
      <span className="relative flex min-w-0 flex-col gap-1">
        <span className="font-semibold text-sm leading-none">CROPS</span>
        <span className="truncate font-roboto-serif text-secondary text-xs leading-none">
          The Infinite Garden
        </span>
      </span>
    </a>
  )
}
