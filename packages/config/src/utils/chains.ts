import type {
  BaseProject,
  Bridge,
  Layer2,
  Layer3,
  ProjectContract,
} from '../types'

export function getChainNames(
  ...projects: (Layer2 | Layer3 | Bridge | BaseProject)[]
): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectDevIds(
  project: Layer2 | Layer3 | Bridge | BaseProject,
): string[] {
  let escrowContracts: ProjectContract[] = []
  if ('config' in project) {
    escrowContracts = project.config.escrows.flatMap(
      (escrow): ProjectContract[] => {
        if (!escrow.contract) {
          return []
        }
        return [{ address: escrow.address, ...escrow.contract }]
      },
    )
  }

  const permissions = []
  for (const perChain of Object.values(project.permissions ?? {})) {
    const all = [...(perChain?.roles ?? []), ...(perChain?.actors ?? [])]
    const filtered = all.filter((p) => {
      const nonEoaAddresses = p.accounts.filter((a) => a.type !== 'EOA')
      return nonEoaAddresses.length > 0
    })
    permissions.push(...filtered)
  }

  const allContracts = [
    ...escrowContracts,
    ...Object.values(project.contracts?.addresses ?? {}).flat(),
    ...permissions,
  ]
  const devIds = allContracts.map((c) => c.chain)

  return devIds
}
