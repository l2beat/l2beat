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
import { HomeCard } from './HomeCard'
import { HomeTitleLink } from './HomeCardHeader'
import { HomeStackedIcons } from './HomeStackedIcons'

/** The banner speaks of principles, so Open source reads as Openness here. */
const BANNER_LABELS: Partial<Record<CropKey, string>> = {
  openSource: 'Openness',
}

/**
 * One flower per principle, standing on the nearest ridge; the ridges climb
 * to the right, so each stands a little higher than the last.
 */
const FLOWERS: GardenFlower[] = [
  { left: '30%', bottom: '3%', width: 30 },
  { left: '50%', bottom: '5%', width: 34 },
  { left: '70%', bottom: '9.5%', width: 30 },
  { left: '88%', bottom: '13%', width: 32 },
]

/**
 * The garden on the home page: a card like its neighbours, the text on the
 * left and a flat strip of the garden's landscape on the right.
 */
export function HomeCropsBanner({
  projects,
  className,
}: {
  projects: HomeCropsProject[]
  className?: string
}) {
  return (
    <HomeCard className={cn('relative overflow-hidden', className)}>
      <GardenLandscape
        flat
        className="left-[54%]"
        lightClassName="top-[38%] left-[64%] size-36"
      >
        <GardenFlowers flowers={FLOWERS} motion="grow" />
      </GardenLandscape>
      <div className="relative flex max-w-[54%] flex-col gap-2">
        {/* Titled like every other card; the sentence says what CROPS is. */}
        <h2 className={HOME_TEXT.title}>
          <HomeTitleLink href={GARDEN_PATH}>The Infinite Garden</HomeTitleLink>
        </h2>
        <p className={HOME_TEXT.body}>
          Protocols that hold to CROPS:{' '}
          {CROP_COLUMNS.map((crop, index) => (
            <span key={crop.key}>
              <span className="text-primary">
                {BANNER_LABELS[crop.key] ?? crop.label}
              </span>
              {index < CROP_COLUMNS.length - 2
                ? ', '
                : index === CROP_COLUMNS.length - 2
                  ? ' and '
                  : '.'}
            </span>
          ))}
        </p>
        <span className="flex items-center gap-2">
          <HomeStackedIcons items={projects} max={6} />
          <span className={HOME_TEXT.meta}>{projects.length} projects</span>
        </span>
      </div>
    </HomeCard>
  )
}
