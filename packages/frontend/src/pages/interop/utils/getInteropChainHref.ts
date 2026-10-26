import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import { ProjectId } from '@l2beat/shared-pure'
import { getChainProjectPath } from '~/pages/chain/paths'
import { ETHEREUM_PROJECT_PATH } from '~/pages/ethereum/paths'
import { getChainProjectSlug } from '~/server/features/chains/getChainProjects'

export function getInteropChainHref(
  chain: { id: string; isUpcoming?: boolean },
  l2ProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  const projectId = chainToProjectId(chain.id)
  if (projectId === ProjectId.ETHEREUM) {
    return ETHEREUM_PROJECT_PATH
  }
  const slug = l2ProjectSlugById.get(projectId)
  if (slug) {
    return `/layer2s/projects/${slug}`
  }
  const chainSlug = getChainProjectSlug(chain, l2ProjectSlugById)
  return chainSlug ? getChainProjectPath(chainSlug) : undefined
}
