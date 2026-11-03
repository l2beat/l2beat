import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import { ps } from '~/server/projects'
import { getBadgeWithParamsAndLink } from '~/utils/project/getBadgeWithParams'

export const ProjectNameTooltipParams = v.object({ projectId: v.string() })
export type ProjectNameTooltipParams = v.infer<typeof ProjectNameTooltipParams>

export interface ProjectNameTooltipData {
  description: string | undefined
  badges: BadgeWithParams[]
}

/**
 * What an L2 table's name tooltip shows beyond the row: the description and
 * badges. Fetched when the tooltip is about to open, so the tables don't send
 * every project's text with the page.
 */
export async function getProjectNameTooltip({
  projectId,
}: ProjectNameTooltipParams): Promise<ProjectNameTooltipData | undefined> {
  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['display', 'scalingInfo', 'statuses'],
  })
  if (!project) return undefined

  return {
    description: project.display.description,
    badges: project.display.badges
      .map((badge) => getBadgeWithParamsAndLink(badge, project))
      .filter((badge) => badge !== undefined),
  }
}
