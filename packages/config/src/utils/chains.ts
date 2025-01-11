import { Bridge, DaLayer, Layer2, Layer3 } from '../projects'

export type Project = Layer2 | Layer3 | Bridge

/**
 * This function is used by checkVerifiedContracts.ts script to know on which
 * chains to check the contracts.
 *
 * @param projects
 * @returns chain names of all the contracts and escrows in the provided projects.
 */
export function getChainNames(...projects: Project[]): string[] {
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
  const permissions =
    project.permissions !== 'UnderReview'
      ? project.permissions?.filter((p) => {
          const nonEoaAddresses = p.accounts.filter((a) => a.type !== 'EOA')
          return nonEoaAddresses.length > 0
        })
      : undefined

  const allContracts = [
    ...escrowContracts,
    ...(project.contracts?.addresses ?? []),
    ...(permissions ?? []),
  ]
  const devIds = allContracts.map((c) => c.chain ?? 'ethereum')

  return devIds
}

export function getChainNamesForDA(...daLayers: DaLayer[]): string[] {
  return daLayers
    .flatMap(getProjectDevIdsForDA)
    .filter((x, i, a) => a.indexOf(x) === i)
}

export function getProjectDevIdsForDA(daLayer: DaLayer): string[] {
  const bridges = daLayer.bridges.filter((b) => b.type === 'OnChainBridge')
  const addresses = bridges.flatMap((b) =>
    Object.values(b.contracts.addresses).flat(),
  )

  const permissions = bridges.flatMap((b) => {
    const targetPermissions =
      b.permissions !== 'UnderReview' ? b.permissions : {}

    return Object.values(targetPermissions)
      .flat()
      .filter((p) => {
        const nonEoaAddresses = p.accounts.filter((a) => a.type !== 'EOA')
        return nonEoaAddresses.length > 0
      })
  })

  const devIds = [...addresses, ...permissions].map(
    (c) => c.chain ?? 'ethereum',
  )

  return devIds
}
