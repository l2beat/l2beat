import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import { type GardenFlower, GardenFlowers, GardenLandscape } from './GardenSky'

const FLOWERS: GardenFlower[] = [
  { left: '78%', bottom: '4%', width: 13 },
  { left: '90%', bottom: '8%', width: 15 },
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
        'group relative flex items-center overflow-hidden rounded-md border border-garden-border px-2.5 py-2 outline-none ring-brand transition-colors hover:border-garden-accent/50 focus-visible:ring-2 data-[active=true]:border-garden-accent/60',
        className,
      )}
    >
      <GardenLandscape lightClassName="top-[38%] left-[84%] size-14">
        <GardenFlowers flowers={FLOWERS} />
      </GardenLandscape>
      <span className="relative flex min-w-0 flex-col gap-1">
        <span className="font-semibold text-sm leading-none">CROPS</span>
        <span className="truncate font-roboto-serif text-2xs text-secondary leading-none">
          The Infinite Garden
        </span>
      </span>
    </a>
  )
}
