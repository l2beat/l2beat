import {
  getAttestationsMeta,
  getCropsProjects,
} from '~/server/features/garden/getCropsProjects'

export async function getGardenCropsApiData() {
  const [attestations, projects] = await Promise.all([
    getAttestationsMeta(),
    getCropsProjects(),
  ])
  return { attestations, projects }
}

export async function getGardenCropsProjectApiData(slug: string) {
  const [attestations, projects] = await Promise.all([
    getAttestationsMeta(),
    getCropsProjects(),
  ])
  const project = projects.find((x) => x.slug === slug || x.id === slug)
  if (!project) {
    return undefined
  }
  return { attestations, ...project }
}
