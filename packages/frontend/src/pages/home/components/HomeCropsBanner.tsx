import { CROP_COLUMNS, type CropKey } from '~/components/garden/crops'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { cn } from '~/utils/cn'
import type { HomeCropsProject } from '../getHomeCropsProjects'
import {
  HOME_BANNER_CLASS,
  HOME_BANNER_TITLE_CLASS,
  HOME_TEXT,
} from '../homeStyles'
import { type GardenFlower, GardenFlowers, GardenLandscape } from './GardenSky'
import { HomeCard } from './HomeCard'
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
  { left: '46%', bottom: '4%', width: 30 },
  { left: '62%', bottom: '7.5%', width: 34 },
  { left: '77%', bottom: '11%', width: 30 },
  { left: '91%', bottom: '12.5%', width: 32 },
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
    <HomeCard asChild className={cn(HOME_BANNER_CLASS, className)}>
      <a href={GARDEN_PATH}>
        <GardenLandscape
          flat
          className="left-[40%]"
          // The sun climbs a little over the hills on hover.
          lightClassName="top-[38%] left-[72%] size-36 transition-[translate] duration-500 ease-out group-hover:-translate-y-[65%]"
        >
          <GardenFlowers flowers={FLOWERS} motion="grow" />
        </GardenLandscape>
        <div className="relative flex max-w-[54%] flex-col gap-1.5">
          {/* The whole card is the link; the sentence says what CROPS is. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className={cn(HOME_TEXT.title, HOME_BANNER_TITLE_CLASS)}>
              The Infinite Garden
            </h2>
            <span className="flex items-center gap-2">
              <HomeStackedIcons items={projects} max={6} />
              <span className={HOME_TEXT.meta}>{projects.length} projects</span>
            </span>
          </div>
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
        </div>
      </a>
    </HomeCard>
  )
}
