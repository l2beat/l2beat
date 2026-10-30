import type { GardenListing, ResolvedCrops } from '~/components/garden/crops'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { CropsBed } from './crops/CropsBed'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GardenCropsSectionProps extends ProjectSectionProps {
  crops: ResolvedCrops
  listing: GardenListing
  /** The measured ossification, listed under Security. */
  ossification: string[]
}

export function GardenCropsSection({
  crops,
  listing,
  ossification,
  ...sectionProps
}: GardenCropsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      headerAccessory={
        <a
          href={GARDEN_PATH}
          className="font-medium text-label-value-14 text-link"
        >
          See the CROPS guide
        </a>
      }
    >
      <CropsBed crops={crops} listing={listing} ossification={ossification} />
    </ProjectSection>
  )
}
