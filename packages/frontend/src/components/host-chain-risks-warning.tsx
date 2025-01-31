import type { ScalingProjectDisplay } from '@l2beat/config'
import { ProjectDetailsRelatedProjectBanner } from './project-details-related-project-banner'

export type HostChainRisksWarningProps = {
  hostChain: ScalingProjectDisplay
  riskCount?: number
}

export function HostChainRisksWarning({
  hostChain,
  riskCount,
}: HostChainRisksWarningProps) {
  const text = riskCount
    ? 'There are ' + riskCount + ' additional risks coming from the hostchain '
    : 'The section considers only the L3 properties. For more details please refer to '

  return (
    <ProjectDetailsRelatedProjectBanner
      text={text}
      project={{ name: hostChain.name, slug: hostChain.slug, type: 'scaling' }}
    />
  )
}
