import {
  CROPS_FRAMEWORK,
  getAttestationsMeta,
  getCropsProjects,
} from '~/server/features/garden/getCropsProjects'

export async function getGardenCropsApiData() {
  return {
    framework: CROPS_FRAMEWORK,
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
  // No `framework` here: it is the same block on every project, and a
  // consumer that wants the labels can fetch it once from /api/garden/crops.
  return {
    attestations: getAttestationsMeta(),
    ...project,
  }
}
