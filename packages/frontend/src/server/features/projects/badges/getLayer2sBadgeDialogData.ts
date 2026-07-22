import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'

type Layer2sBadge = NonNullable<ReturnType<typeof getBadgeWithParams>>

export interface Layer2sBadgeDialogProject {
  slug: string
  name: string
  icon: string
  type: string
}

export interface Layer2sBadgeDialogData {
  badge: Layer2sBadge
  projectCount: number
  relatedBadges: Layer2sBadge[]
  projects: Layer2sBadgeDialogProject[]
}

export async function getLayer2sBadgeDialogData(input: {
  badgeId: string
}): Promise<Layer2sBadgeDialogData | null> {
  const projects = await ps.getProjects({
    select: ['display', 'scalingInfo'],
    where: ['scalingInfo'],
    whereNot: ['archivedAt'],
  })

  const badgesById = new Map<string, Layer2sBadge>()
  const badgesByType = new Map<string, Layer2sBadge[]>()
  const projectsByBadge = new Map<string, Layer2sBadgeDialogProject[]>()

  for (const project of projects) {
    const projectSummary: Layer2sBadgeDialogProject = {
      slug: project.slug,
      name: project.name,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      type: project.scalingInfo.type ?? project.scalingInfo.layer,
    }

    for (const badge of project.display.badges) {
      const badgeWithParams = getBadgeWithParams(badge)
      if (!badgeWithParams) continue

      badgesById.set(badge.id, badgeWithParams)

      const badgesOfType = badgesByType.get(badge.type) ?? []
      if (!badgesOfType.some((badge) => badge.id === badgeWithParams.id)) {
        badgesOfType.push(badgeWithParams)
      }
      badgesByType.set(badge.type, badgesOfType)

      const projectsWithBadge = projectsByBadge.get(badge.id) ?? []
      projectsWithBadge.push(projectSummary)
      projectsByBadge.set(badge.id, projectsWithBadge)
    }
  }

  const selectedBadge = badgesById.get(input.badgeId)
  if (!selectedBadge) return null

  const projectsWithBadge = (projectsByBadge.get(input.badgeId) ?? []).sort(
    (a, b) => a.name.localeCompare(b.name),
  )
  const relatedBadges = (badgesByType.get(selectedBadge.type) ?? [])
    .filter((badge) => badge.id !== input.badgeId)
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    badge: selectedBadge,
    projectCount: projectsWithBadge.length,
    relatedBadges,
    projects: projectsWithBadge,
  }
}
