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
  'discoveryUpdates',
  'garden',
  'zkCatalogInfo',
  'ossificationHistory',
  'milestones',
  'upgradesAndGovernance',
  'archivedAt',
] as const

/** Archived projects drop out of the summary and are listed on the archived
 *  page instead. */
export async function getPrivacyProjects(
  status: 'active' | 'archived' = 'active',
): Promise<PrivacyProject[]> {
  const projects = await ps.getProjects({
    ...(status === 'active'
      ? { where: ['privacyInfo'], whereNot: ['archivedAt'] }
      : { where: ['privacyInfo', 'archivedAt'] }),
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
