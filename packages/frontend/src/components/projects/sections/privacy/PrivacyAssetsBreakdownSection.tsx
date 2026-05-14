import { PrivacyAssetsBreakdownTable } from '~/pages/privacy/project/components/assets-breakdown/PrivacyAssetsBreakdownTable'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAssetsBreakdownSectionProps
  extends ProjectSectionProps {
  assets: PrivacyAsset[]
}

export function PrivacyAssetsBreakdownSection({
  assets,
  ...projectSectionProps
}: PrivacyAssetsBreakdownSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <PrivacyAssetsBreakdownTable assets={assets} />
    </ProjectSection>
  )
}
