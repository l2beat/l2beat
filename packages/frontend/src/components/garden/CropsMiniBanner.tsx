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
 * The garden as a small highlighted banner: the sidebar sets it above the
 * sections, and the home page's section tiles start with it on the screens
 * without the sidebar.
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
      {/* In a tile narrower than the sidebar's 178px (the home menu on a
          phone), the subtitle would run into the hills, so only the sun
          stays, in the corner the title leaves free. */}
      <GardenLandscape
        flat
        className="left-[68%]"
        lightClassName="top-[38%] left-[58%] size-12"
        ridgesClassName="h-full @max-[177px]/crops:hidden"
      >
        <span className="@max-[177px]/crops:hidden">
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
