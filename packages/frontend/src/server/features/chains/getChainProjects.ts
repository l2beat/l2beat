import { INTEROP_CHAINS } from '@l2beat/config'
import { chainToProjectId } from '@l2beat/config/build/global/chainMap'
import { ProjectId } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getActiveInteropChains } from '../layer2s/interop/utils/getInteropChains'

/**
 * Interop chains with no page of their own (not Ethereum, not a scaling
 * project) get a chain page showing only their interop data, under their
 * project id. Upcoming chains have no such data yet.
 */
export function getChainProjectSlug(
  chain: { id: string; isUpcoming?: boolean },
  l2ProjectIds: { has(id: ProjectId): boolean },
): string | undefined {
  const projectId = chainToProjectId(chain.id)
  if (
    chain.isUpcoming ||
    projectId === ProjectId.ETHEREUM ||
    l2ProjectIds.has(projectId)
  ) {
    return undefined
  }
  return projectId
}

/** The chains that have a chain page in this deployment. */
export async function getChainProjects() {
  return selectChainProjects(await getL2ProjectIds())
}

/** `getChainProjects` for callers that already hold the scaling projects. */
export function selectChainProjects(l2ProjectIds: Set<ProjectId>) {
  return getActiveInteropChains().flatMap((chain) => {
    const slug = getChainProjectSlug(chain, l2ProjectIds)
    return slug ? [{ ...chain, slug }] : []
  })
}

/**
 * Whether the slug belongs to a chain page in some deployment, whichever
 * chains this one enables.
 */
export async function isChainProjectSlug(slug: string) {
  const l2ProjectIds = await getL2ProjectIds()
  return INTEROP_CHAINS.some(
    (chain) => getChainProjectSlug(chain, l2ProjectIds) === slug,
  )
}

async function getL2ProjectIds() {
  const l2Projects = await ps.getProjects({ where: ['scalingInfo'] })
  return new Set(l2Projects.map((project) => project.id))
}
