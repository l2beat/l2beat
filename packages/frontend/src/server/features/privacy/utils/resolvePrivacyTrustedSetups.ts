import type { ProjectPrivacyInfo, ProjectZkCatalogInfo } from '@l2beat/config'
import { ps } from '~/server/projects'

type PrivacyZkCatalogProject = {
  privacyInfo: Pick<ProjectPrivacyInfo, 'zkCatalogProjectId'>
  zkCatalogInfo?: ProjectZkCatalogInfo
}

export async function resolvePrivacyTrustedSetups(
  project: PrivacyZkCatalogProject,
): Promise<ProjectZkCatalogInfo['trustedSetups']> {
  if (project.zkCatalogInfo) {
    return project.zkCatalogInfo.trustedSetups
  }

  const zkCatalogProjectId = project.privacyInfo.zkCatalogProjectId
  if (!zkCatalogProjectId) {
    return []
  }

  const zkCatalogProject = await ps.getProject({
    id: zkCatalogProjectId,
    select: ['zkCatalogInfo'],
  })
  return zkCatalogProject?.zkCatalogInfo.trustedSetups ?? []
}
