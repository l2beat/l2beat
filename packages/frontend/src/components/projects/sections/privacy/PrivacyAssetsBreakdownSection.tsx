import { PrivacyAssetsBreakdownTable } from '~/pages/privacy/project/components/assets-breakdown/PrivacyAssetsBreakdownTable'
import type { PrivacyAsset } from '~/server/features/privacy/types'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAssetsBreakdownSectionProps
  extends ProjectSectionProps {
  assets: PrivacyAsset[]
  showTvl: boolean
}

export function PrivacyAssetsBreakdownSection({
  assets,
  showTvl,
  ...projectSectionProps
}: PrivacyAssetsBreakdownSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <PrivacyAssetsBreakdownTable assets={assets} showTvl={showTvl} />
    </ProjectSection>
  )
}
