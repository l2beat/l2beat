import type { Project } from '@l2beat/config'
import type { InteropBridgeType } from '@l2beat/shared-pure'

/**
 * A minting observation from the token database: this plugin, bridging this
 * way, was seen minting a token on this chain. `abstractTokenId` is the
 * catalogue token the minted deployment belongs to.
 */
export interface MintingBridgeInput {
  plugin: string
  bridgeType: InteropBridgeType
  chain: string
  abstractTokenId: string
}

/**
 * Which interop projects own a minting observation.
 *
 * The sibling `createTransferBridgeResolver` answers the same question for a
 * transfer, but asserts on both no-match and ambiguity — appropriate there,
 * because every ingested transfer belongs to a configured project. A relation
 * is weaker evidence: it can name a plugin no project claims, and a token page
 * must not fail over that. So this resolver returns every surviving match,
 * possibly none.
 */
export function createMintingBridgeResolver(
  projects: Project<'interopConfig'>[],
): (input: MintingBridgeInput) => Project<'interopConfig'>[] {
  return (input) => {
    const matchingProjects = projects.filter((project) =>
      project.interopConfig.plugins.some(
        (configured) =>
          configured.plugin === input.plugin &&
          configured.bridgeType === input.bridgeType &&
          (configured.chain === undefined ||
            configured.chain === input.chain) &&
          (configured.abstractTokenId === undefined ||
            configured.abstractTokenId === input.abstractTokenId),
        // `transferType` is deliberately not checked: a relation summarizes
        // many transfers and carries no single transfer type.
      ),
    )

    const shadowedProjectIds = new Set(
      matchingProjects.flatMap((project) =>
        project.interopConfig.subgroupId
          ? [project.interopConfig.subgroupId]
          : [],
      ),
    )

    return matchingProjects
      .filter((project) => !shadowedProjectIds.has(project.id))
      .sort((a, b) =>
        interopDisplayName(a).localeCompare(interopDisplayName(b)),
      )
  }
}

/** The name an interop project goes by on interop pages. */
export function interopDisplayName(project: Project<'interopConfig'>): string {
  return project.interopConfig.name ?? project.name
}
