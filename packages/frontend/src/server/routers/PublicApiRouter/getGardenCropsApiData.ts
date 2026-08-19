import {
  getAttestationsMeta,
  getCropsProjects,
} from '~/server/features/garden/getCropsProjects'

export async function getGardenCropsApiData() {
  return {
    attestations: getAttestationsMeta(),
    projects: await getCropsProjects(),
  }
}

export async function getGardenCropsProjectApiData(slug: string) {
  const projects = await getCropsProjects()
  const project = projects.find((x) => x.slug === slug || x.id === slug)
  if (!project) {
    return undefined
  }
  return {
    attestations: getAttestationsMeta(),
    ...project,
  }
}
