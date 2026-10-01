import { CropPlant } from '~/components/garden/CropPlant'
import { CROP_COLUMNS, type CropKey } from '~/components/garden/crops'
import { GardenScenery } from '~/components/garden/GardenSky'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import type { HomeCropsProject } from '../getHomeCropsProjects'
import { HOME_TEXT } from '../homeStyles'
import { HomeTitleLink } from './HomeCardHeader'
import { HomeStackedIcons } from './HomeStackedIcons'

/** The banner speaks of principles, so Open source reads as Openness here. */
const BANNER_LABELS: Partial<Record<CropKey, string>> = {
  openSource: 'Openness',
}

export function HomeCropsBanner({
  projects,
  className,
}: {
  projects: HomeCropsProject[]
  className?: string
}) {
  if (projects.length === 0) {
    return null
  }
  return (
    // The one boxed element on the page: a corner of the garden itself.
    <div
      className={cn(
        'relative overflow-hidden border-garden-border border-y md:rounded-lg md:border-x',
        className,
      )}
    >
      <GardenScenery />
      <CropPlant
        status="reviewed"
        sentiment="good"
        delay={0.3}
        width={30}
        className="absolute right-20 bottom-1 max-md:hidden"
      />
      <div className="relative flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-6 md:py-5 md:pr-36 md:pl-6">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h2 className={HOME_TEXT.title}>
              <HomeTitleLink href={GARDEN_PATH}>CROPS</HomeTitleLink>
            </h2>
            <span className={HOME_TEXT.meta}>The Infinite Garden</span>
          </div>
          <p className={HOME_TEXT.body}>
            Protocols built on{' '}
            {CROP_COLUMNS.map((crop, index) => (
              <span key={crop.key}>
                <span className="text-primary">
                  {BANNER_LABELS[crop.key] ?? crop.label}
                </span>
                {index < CROP_COLUMNS.length - 2
                  ? ', '
                  : index === CROP_COLUMNS.length - 2
                    ? ' and '
                    : ': the ones that last.'}
              </span>
            ))}
          </p>
        </div>
        <HomeStackedIcons items={projects} max={8} iconClassName="size-7" />
      </div>
    </div>
  )
}
