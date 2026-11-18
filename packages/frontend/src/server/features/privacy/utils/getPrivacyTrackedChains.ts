import { ProjectId } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import { getProjectPath } from '~/utils/project/getProjectPath'

interface ChainProject {
  id: ProjectId
  slug: string
  name: string
  chainConfig: { name: string }
  scalingInfo?: object
  privacyInfo?: object
  defiInfo?: object
}

export function getPrivacyTrackedChains(
  chainNames: string[],
  projects: ChainProject[],
): ProjectIconListItem[] {
  return chainNames.flatMap((chainName) => {
    const project = projects.find((p) => p.chainConfig.name === chainName)
    if (!project) return []
    const hasPage =
      project.id === ProjectId.ETHEREUM ||
      project.scalingInfo ||
      project.privacyInfo ||
      project.defiInfo
    return [
      {
        id: chainName,
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        href: hasPage ? getProjectPath(project.slug) : undefined,
      },
    ]
  })
}
