import type {
  ProjectDaBridge,
  ProjectDaLayer,
  ProjectDefiInfo,
  ProjectPrivacyInfo,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import { getProjectUrl } from '~/utils/project/getProjectUrl'

interface ChainProject {
  slug: string
  name: string
  chainConfig: { name: string }
  scalingInfo?: unknown
  daBridge?: ProjectDaBridge | undefined
  daLayer?: ProjectDaLayer | undefined
  privacyInfo?: ProjectPrivacyInfo | undefined
  defiInfo?: ProjectDefiInfo | undefined
}

export function getPrivacyDeployedChains(
  chainNames: string[],
  projects: ChainProject[],
  daLayers: { id: ProjectId; slug: string }[],
): ProjectIconListItem[] {
  return chainNames.flatMap((chainName) => {
    const project = projects.find((p) => p.chainConfig.name === chainName)
    if (!project) return []
    const hasPage =
      project.scalingInfo ||
      project.daLayer ||
      project.daBridge ||
      project.privacyInfo ||
      project.defiInfo
    return [
      {
        id: chainName,
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        href: hasPage ? getProjectUrl(project, daLayers) : undefined,
      },
    ]
  })
}
