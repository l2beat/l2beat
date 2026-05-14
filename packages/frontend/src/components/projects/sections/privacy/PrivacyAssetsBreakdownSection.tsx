import { PrivacyBreakdownTable } from '~/pages/privacy/project/components/PrivacyBreakdownTable'
import type { PrivacyAssetSnapshot } from '~/server/features/privacy/types'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface PrivacyAssetsBreakdownSectionProps extends ProjectSectionProps {
  assets: PrivacyAssetSnapshot[]
}

export function PrivacyAssetsBreakdownSection({
  assets,
  ...projectSectionProps
}: PrivacyAssetsBreakdownSectionProps) {
  return (
    <ProjectSection {...projectSectionProps}>
      <PrivacyBreakdownTable assets={assets} />
    </ProjectSection>
  )
}
