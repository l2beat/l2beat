import { getChainShortName } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Bridge, ScalingProject } from '../internalTypes'
import type { BaseProject, ProjectContract } from '../types'

export function getChainNames(
  ...projects: (ScalingProject | Bridge | BaseProject)[]
): string[] {
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectDevIds(
  project: ScalingProject | Bridge | BaseProject,
): string[] {
  let escrowContracts: ProjectContract[] = []
  if ('config' in project) {
    escrowContracts = project.config.escrows.flatMap(
      (escrow): ProjectContract[] => {
        if (!escrow.contract) {
          return []
        }
        return [
          {
            address: ChainSpecificAddress.from(
              getChainShortName(escrow.chain),
              escrow.address,
            ),
            ...escrow.contract,
          },
        ]
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
