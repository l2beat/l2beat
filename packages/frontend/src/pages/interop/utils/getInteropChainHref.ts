import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import { ProjectId } from '@l2beat/shared-pure'

export function getInteropChainHref(
  chainId: string,
  scalingProjectSlugById: Map<ProjectId, string>,
): string | undefined {
  if (chainId === ProjectId.ETHEREUM) {
    return '/data-availability/projects/ethereum/ethereum'
  }
  const slug = scalingProjectSlugById.get(chainToProjectId(chainId))
  return slug ? `/scaling/projects/${slug}` : undefined
}
