import { Bridge, Layer2, Layer3 } from '../projects'

export type Project = Layer2 | Layer3 | Bridge

/**
 * This function is used by checkVerifiedContracts.ts script to know on which
 * chains to check the contracts.
 *
 * @param projects
 * @returns chain names of all the contracts and escrows in the provided projects.
 */
export function getChainNames(
  projects: (Layer2 | Layer3 | Bridge)[],
): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

export function getProjectDevIds(project: Project): string[] {
  const escrowContracts = project.config.escrows.flatMap((escrow) => {
    if (!escrow.newVersion) {
      return []
    }
    return { address: escrow.address, ...escrow.contract }
  })
  const allContracts = [
    ...escrowContracts,
    ...(project.contracts?.addresses ?? []),
  ]
  const devIds = allContracts.map((c) => c.chain ?? 'ethereum')

  return devIds
}
