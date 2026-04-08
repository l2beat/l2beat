import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'

export interface ScalingBadgeDialogProject {
  slug: string
  name: string
  shortName: string | undefined
  icon: string
  type: string
}

export interface ScalingBadgeDialogData {
  badge: NonNullable<ReturnType<typeof getBadgeWithParams>>
  projectCount: number
  relatedBadges: NonNullable<ReturnType<typeof getBadgeWithParams>>[]
  projects: ScalingBadgeDialogProject[]
}

export async function getScalingBadgeDialogData(input: {
  badgeId: string
}): Promise<ScalingBadgeDialogData | undefined> {
  const projects = await ps.getProjects({
    select: ['display', 'scalingInfo'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'archivedAt'],
  })

  const badgesByType = new Map<
    string,
    Map<string, NonNullable<ReturnType<typeof getBadgeWithParams>>>
  >()
  const projectsByBadge = new Map<string, ScalingBadgeDialogProject[]>()

  for (const project of projects) {
    const projectSummary: ScalingBadgeDialogProject = {
      slug: project.slug,
      name: project.name,
      shortName: project.shortName,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      type: project.scalingInfo.type ?? project.scalingInfo.layer,
    }

    for (const badge of project.display.badges) {
      const badgeWithParams = getBadgeWithParams(badge)
      if (!badgeWithParams) continue

      const badgesOfType = badgesByType.get(badge.type) ?? new Map()
      badgesOfType.set(badge.id, badgeWithParams)
      badgesByType.set(badge.type, badgesOfType)

      const projectsWithBadge = projectsByBadge.get(badge.id) ?? []
      projectsWithBadge.push(projectSummary)
      projectsByBadge.set(badge.id, projectsWithBadge)
    }
  }

  let selectedBadge:
    | NonNullable<ReturnType<typeof getBadgeWithParams>>
    | undefined
  for (const badgesOfType of badgesByType.values()) {
    const badge = badgesOfType.get(input.badgeId)
    if (badge) {
      selectedBadge = badge
      break
    }
  }

  if (!selectedBadge) return undefined

  const projectsWithBadge = (projectsByBadge.get(input.badgeId) ?? []).sort(
    (a, b) => a.name.localeCompare(b.name),
  )
  const relatedBadges = Array.from(
    badgesByType.get(selectedBadge.type)?.values() ?? [],
  )
    .filter((badge) => badge.id !== input.badgeId)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    badge: selectedBadge,
    projectCount: projectsWithBadge.length,
    relatedBadges,
    projects: projectsWithBadge,
  }
}
