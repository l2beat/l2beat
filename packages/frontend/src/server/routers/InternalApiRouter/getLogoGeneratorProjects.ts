import { ps } from '~/server/projects'

export async function getLogoGeneratorProjects() {
  const projects = await ps.getProjects({
    optional: [
      'isUpcoming',
      'archivedAt',
      'bridgeInfo',
      'scalingInfo',
      'isScaling',
    ],
  })

  return projects
    .filter((project) => !!project.isScaling)
    .map((project) => ({
      name: project.name,
      type: project.scalingInfo?.layer ?? 'bridge',
      slug: project.slug,
      isUpcoming: project.isUpcoming,
      isArchived: !!project.archivedAt,
    }))
}
