import { ps } from '~/server/projects'

export async function getLogoGeneratorProjects() {
  const projects = await ps.getProjects({
    optional: [
      'isUpcoming',
      'archivedAt',
      'bridgeInfo',
      'scalingInfo',
      'isBridge',
      'isScaling',
    ],
  })

  return projects
    .filter((project) => !!project.isBridge || !!project.isScaling)
    .map((project) => ({
      name: project.name,
      type: project.scalingInfo?.layer ?? 'bridge',
      slug: project.slug,
      isUpcoming: project.isUpcoming,
      isArchived: !!project.archivedAt,
    }))
}
