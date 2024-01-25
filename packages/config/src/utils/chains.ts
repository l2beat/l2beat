import { Bridge } from '../bridges'
import { Layer2 } from '../layer2s'
import { Layer3 } from '../layer3s'

export type Project = Layer2 | Layer3 | Bridge
interface Config {
  layer2s: Layer2[]
  layer3s: Layer3[]
  bridges: Bridge[]
}

/**
 * This function is used by checkVerifiedContracts.ts script to know on which
 * chains to check the contracts.
 *
 * @param projects
 * @returns chain names of all the contracts and escrows in the provided projects.
 */
export function getChainNames(config: Config): string[] {
  const projects = [...config.layer2s, ...config.layer3s, ...config.bridges]
  return projects
    .flatMap(getProjectDevIds)
    .filter((x, i, a) => a.indexOf(x) === i)
}

function getProjectDevIds(project: Project): string[] {
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
