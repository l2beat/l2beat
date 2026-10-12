import { ProjectDetailsRelatedProjectBanner } from './ProjectDetailsRelatedProjectBanner'
import { hostChainRisksText } from './projects/sections/sectionCopy'

export type HostChainRisksWarningProps = {
  hostChainName: string
  hostChainSlug: string
  hostChainIcon: string
  riskCount?: number
}

export function HostChainRisksWarning({
  hostChainName,
  hostChainSlug,
  hostChainIcon,
  riskCount,
}: HostChainRisksWarningProps) {
  return (
    <ProjectDetailsRelatedProjectBanner
      text={hostChainRisksText(riskCount)}
      project={{
        name: hostChainName,
        icon: hostChainIcon,
      }}
      href={`/layer2s/projects/${hostChainSlug}`}
    />
  )
}
