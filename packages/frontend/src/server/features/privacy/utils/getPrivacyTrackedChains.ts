import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import {
  getProjectUrl,
  type ProjectPageMetadata,
} from '~/utils/project/getProjectUrl'

interface ChainProject extends ProjectPageMetadata {
  name: string
  chainConfig: { name: string }
}

export function getPrivacyTrackedChains(
  chainNames: string[],
  projects: ChainProject[],
): ProjectIconListItem[] {
  return chainNames.flatMap((chainName) => {
    const project = projects.find((p) => p.chainConfig.name === chainName)
    if (!project) return []
    const hasPage =
      project.scalingInfo || project.privacyInfo || project.defiInfo
    return [
      {
        id: chainName,
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        href: hasPage ? getProjectUrl(project) : undefined,
      },
    ]
  })
}
