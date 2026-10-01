import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import { CropPlant } from './CropPlant'
import { GardenScenery } from './GardenSky'

/**
 * The garden as a small highlighted banner: the sidebar sets it above the
 * sections, and the home page's section tiles start with it on the screens
 * without the sidebar.
 */
export function CropsMiniBanner({
  isActive = false,
  onClick,
  className,
  plantClassName = 'right-11',
}: {
  isActive?: boolean
  onClick?: () => void
  className?: string
  /** Where the plant stands; a narrow banner moves it clear of the text. */
  plantClassName?: string
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
      <GardenScenery compact />
      <CropPlant
        status="reviewed"
        sentiment="good"
        delay={0.3}
        width={16}
        className={cn('absolute bottom-0.5', plantClassName)}
      />
      <span className="relative flex min-w-0 flex-col gap-1">
        <span className="font-semibold text-sm leading-none">CROPS</span>
        <span className="truncate font-medium text-2xs text-secondary leading-none">
          The Infinite Garden
        </span>
      </span>
    </a>
  )
}
