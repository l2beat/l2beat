import type {
  CropOssification,
  GardenListing,
  ResolvedCrops,
} from '~/components/garden/crops'
import { CustomLinkIcon } from '~/icons/Outlink'
import { GARDEN_PATH } from '~/pages/garden/paths'
import { CropsBed } from './crops/CropsBed'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GardenCropsSectionProps extends ProjectSectionProps {
  crops: ResolvedCrops
  listing: GardenListing
  ossification: CropOssification | undefined
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
          className="inline-flex items-center gap-1 font-medium text-label-value-14 text-link"
        >
          See The Infinite Garden
          <CustomLinkIcon className="fill-current" />
        </a>
      }
    >
      <CropsBed crops={crops} listing={listing} ossification={ossification} />
    </ProjectSection>
  )
}
