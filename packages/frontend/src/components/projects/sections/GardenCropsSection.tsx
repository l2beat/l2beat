import type { ResolvedCrops } from '@l2beat/config/build/crops/canonicalCrops'
import { CustomLinkIcon } from '~/icons/Outlink'
import { GARDEN_PATH } from '~/pages/garden/submit/links'
import { CropsBed } from './crops/CropsBed'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface GardenCropsSectionProps extends ProjectSectionProps {
  crops: ResolvedCrops
  inGarden: boolean
}

export function GardenCropsSection({
  crops,
  inGarden,
  ...sectionProps
}: GardenCropsSectionProps) {
  return (
    <ProjectSection
      {...sectionProps}
      // The green marks a protocol that is in the garden; a miss stays plain.
      className={
        inGarden ? 'border border-garden-border bg-garden-tint' : undefined
      }
      headerAccessory={
        <a
          href={GARDEN_PATH}
          className="inline-flex items-center gap-1 font-medium text-label-value-14 text-link"
        >
          See the whole garden
          <CustomLinkIcon className="fill-current" />
        </a>
      }
    >
      <CropsBed crops={crops} inGarden={inGarden} />
    </ProjectSection>
  )
}
