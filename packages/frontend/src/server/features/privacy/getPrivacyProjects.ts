import type { Project } from '@l2beat/config'
import { ps } from '~/server/projects'
import type { PrivacyProject } from './types'

type RawPrivacyProject = Omit<PrivacyProject, 'trustedSetups'>

const SELECT = ['display', 'privacyInfo', 'statuses'] as const
const OPTIONAL = [
  'tvsConfig',
  'contracts',
  'permissions',
  'discoveryInfo',
  'zkCatalogInfo',
] as const

export async function getPrivacyProjects(): Promise<PrivacyProject[]> {
  const projects = await ps.getProjects({
    where: ['privacyInfo'],
    select: [...SELECT],
    optional: [...OPTIONAL],
  })
  return attachTrustedSetups(projects, await getZkCatalogProjects(projects))
}

export async function getPrivacyProject(
  slug: string,
): Promise<PrivacyProject | undefined> {
  const project = await ps.getProject({
    slug,
    where: ['privacyInfo'],
    select: [...SELECT],
    optional: [...OPTIONAL],
  })
  if (!project) return undefined
  const [result] = attachTrustedSetups(
    [project],
    await getZkCatalogProjects([project]),
  )
  return result
}

function getZkCatalogProjects(
  projects: RawPrivacyProject[],
): Promise<Project<'zkCatalogInfo'>[]> {
  const ids = projects.flatMap((p) => p.privacyInfo.zkCatalogId ?? [])
  if (ids.length === 0) return Promise.resolve([])
  return ps.getProjects({ ids, select: ['zkCatalogInfo'] })
}

export function attachTrustedSetups(
  projects: RawPrivacyProject[],
  zkCatalogProjects: Project<'zkCatalogInfo'>[],
): PrivacyProject[] {
  return projects.map((project) => {
    const zkCatalogInfo =
      project.zkCatalogInfo ??
      zkCatalogProjects.find((p) => p.id === project.privacyInfo.zkCatalogId)
        ?.zkCatalogInfo
    return { ...project, trustedSetups: zkCatalogInfo?.trustedSetups ?? [] }
  })
}
