import type {
  ProjectPrivacyInfo,
  ProjectScalingInfo,
  ProjectScalingStage,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import { getProjectPath } from '~/utils/project/getProjectPath'
import { isAssignedStage } from '~/utils/project/isAssignedStage'

interface LinkedProject {
  id: ProjectId
  slug: string
  name: string
}

interface ScalingProject extends LinkedProject {
  scalingInfo: ProjectScalingInfo
  scalingStage?: ProjectScalingStage
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
        ...toItem(project),
        description: project.scalingInfo.type,
        stage: stage && isAssignedStage(stage) ? stage : undefined,
      },
    ]
  })
}

/** The privacy projects that run on a scaling project. */
export function getPrivacyProjectsRunningOn(
  scalingProjectId: ProjectId,
  projects: (LinkedProject & { privacyInfo?: ProjectPrivacyInfo })[],
): ProjectIconListItem[] {
  return projects.flatMap((p) =>
    p.privacyInfo?.scalingProjects?.includes(scalingProjectId)
      ? [{ ...toItem(p), description: p.privacyInfo.category.label }]
      : [],
  )
}

function toItem(project: LinkedProject): ProjectIconListItem {
  return {
    id: project.id,
    name: project.name,
    iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    href: getProjectPath(project.slug),
  }
}
