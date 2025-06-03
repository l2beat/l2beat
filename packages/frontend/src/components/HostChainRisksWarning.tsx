import { ProjectDetailsRelatedProjectBanner } from './ProjectDetailsRelatedProjectBanner'

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
  const text = riskCount
    ? 'There are ' + riskCount + ' additional risks coming from the hostchain '
    : 'The section considers only the L3 properties. For more details please refer to '

  return (
    <ProjectDetailsRelatedProjectBanner
      text={text}
      project={{
        name: hostChainName,
        slug: hostChainSlug,
        icon: hostChainIcon,
        type: 'scaling',
      }}
    />
  )
}
