import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import { ProjectId } from '@l2beat/shared-pure'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'

export function getInteropChainHref(
  chainId: string,
  l2ProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  const projectId = chainToProjectId(chainId)
  if (projectId === ProjectId.ETHEREUM) {
    return ETHEREUM_PROJECT_PATH
  }
  const slug = l2ProjectSlugById.get(projectId)
  return slug ? `/layer2s/projects/${slug}` : undefined
}
