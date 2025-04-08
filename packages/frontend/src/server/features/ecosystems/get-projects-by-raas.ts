import type { Project } from '@l2beat/config'

export function getProjectsByRaas(ecosystemProjects: Project<'scalingInfo'>[]) {
  return ecosystemProjects.reduce(
    (acc, curr) => {
      const raas = curr.scalingInfo.raas
      if (!raas) return acc
      if (!acc[raas]) {
        acc[raas] = []
      }
      acc[raas].push({
        slug: curr.slug.toString(),
        name: curr.name,
        href: `/scaling/projects/${curr.slug}`,
      })
      return acc
    },
    {} as Record<string, { slug: string; name: string; href: string }[]>,
  )
}
