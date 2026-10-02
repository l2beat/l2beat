import { CROP_COLUMNS, type CropKey } from '~/components/garden/crops'
import {
  type GardenFlower,
  GardenFlowers,
  GardenLandscape,
} from '~/components/garden/GardenSky'
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

/** One flower per principle, in the foreground. */
const FLOWERS: GardenFlower[] = [
  { left: '63%', bottom: '5%', width: 34 },
  { left: '71.5%', bottom: '6%', width: 40 },
  { left: '80%', bottom: '7.5%', width: 34 },
  { left: '88.5%', bottom: '9%', width: 38 },
]

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
        'relative overflow-hidden border-garden-border border-y md:rounded-lg md:border-x dark:border-[#1d2a36]',
        className,
      )}
    >
      <GardenLandscape lightClassName="top-[36%] left-[76%] size-48">
        <GardenFlowers flowers={FLOWERS} />
      </GardenLandscape>
      <div className="relative flex max-w-[60%] flex-col gap-1 py-5 pl-6">
        <div className="flex items-baseline gap-2.5">
          <h2 className={HOME_TEXT.title}>
            <HomeTitleLink href={GARDEN_PATH}>CROPS</HomeTitleLink>
          </h2>
          <span className="whitespace-nowrap font-light font-roboto-serif text-[17px] text-secondary leading-none tracking-[-0.01em]">
            The Infinite Garden
          </span>
          {/* Pulled out of the line box, so the title row keeps its height. */}
          <span className="-my-1 ml-2 flex items-center gap-2 self-center whitespace-nowrap">
            <HomeStackedIcons items={projects} max={6} showRest={false} />
            <span className={HOME_TEXT.meta}>{projects.length} projects</span>
          </span>
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
    </div>
  )
}
