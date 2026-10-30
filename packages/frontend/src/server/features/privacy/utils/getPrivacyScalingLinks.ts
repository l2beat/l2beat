import type {
  PrivacyCategory,
  ProjectScalingInfo,
  ProjectScalingStage,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'

interface LinkedProject {
  id: ProjectId
  slug: string
  name: string
}

interface ScalingProject extends LinkedProject {
  scalingInfo: Pick<ProjectScalingInfo, 'type'>
  scalingStage?: ProjectScalingStage
}

interface PrivacyLinkedProject extends LinkedProject {
  privacyInfo?: {
    category: Pick<PrivacyCategory, 'label'>
    scalingProjects?: ProjectId[]
  }
}

/** The scaling projects a privacy project runs on, in its configured order. */
export function getScalingProjectItems(
  scalingProjectIds: ProjectId[],
  projects: ScalingProject[],
): ProjectIconListItem[] {
  return scalingProjectIds.flatMap((id) => {
    const project = projects.find((p) => p.id === id)
    if (!project) return []
    const stage = project.scalingStage?.stage
    return [
      {
        ...toItem(project, `/layer2s/projects/${project.slug}`),
        description: project.scalingInfo.type,
        stage:
          stage === 'NotApplicable' || stage === 'UnderReview'
            ? undefined
            : stage,
      },
    ]
  })
}

/** The privacy projects that run on a scaling project. */
export function getPrivacyProjectsRunningOn(
  scalingProjectId: ProjectId,
  projects: PrivacyLinkedProject[],
): ProjectIconListItem[] {
  return projects.flatMap((p) =>
    p.privacyInfo?.scalingProjects?.includes(scalingProjectId)
      ? [
          {
            ...toItem(p, `/privacy/projects/${p.slug}`),
            description: p.privacyInfo.category.label,
          },
        ]
      : [],
  )
}

function toItem(project: LinkedProject, href: string): ProjectIconListItem {
  return {
    id: project.id,
    name: project.name,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    href,
  }
}
