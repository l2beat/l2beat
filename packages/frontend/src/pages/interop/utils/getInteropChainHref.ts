import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import { ProjectId } from '@l2beat/shared-pure'

export function getInteropChainHref(
  chainId: string,
  l2ProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  if (chainId === ProjectId.ETHEREUM) {
    return '/data-availability/projects/ethereum/ethereum'
  }
  const slug = l2ProjectSlugById.get(chainToProjectId(chainId))
  return slug ? `/layer2s/projects/${slug}` : undefined
}
