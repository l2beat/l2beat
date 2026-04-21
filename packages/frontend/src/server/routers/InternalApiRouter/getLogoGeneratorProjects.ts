import { ps } from '~/server/projects'

export async function getLogoGeneratorProjects() {
  const projects = await ps.getProjects({
    optional: ['isUpcoming', 'archivedAt', 'bridgeInfo', 'scalingInfo'],
  })

  return projects
    .filter((project) => project.scalingInfo)
    .map((project) => ({
      name: project.name,
      type: project.scalingInfo?.layer,
      slug: project.slug,
      isUpcoming: project.isUpcoming,
      isArchived: !!project.archivedAt,
    }))
}
