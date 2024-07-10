import {
  type Bridge,
  type Layer2,
  type Layer3,
  getCommonContractsIn,
} from '@l2beat/config'
import { type TechnologyContractAddress } from './contract-entry'
import { type UsedInProject } from './used-in-project'

export function getUsedInProjects(
  project: Layer2 | Layer3 | Bridge,
  addresses: TechnologyContractAddress[],
  implementationAddresses: TechnologyContractAddress[],
): UsedInProject[] {
  if (implementationAddresses.length === 0) {
    return evalUsedInProject(project, addresses, 'implementation')
  }

  const asProxy = evalUsedInProject(project, addresses, 'proxy')
  const asImplementation = evalUsedInProject(
    project,
    implementationAddresses,
    'implementation',
  )
  return (asProxy ?? []).concat(asImplementation ?? [])
}

function evalUsedInProject(
  project: Layer2 | Layer3 | Bridge,
  addresses: TechnologyContractAddress[],
  type: UsedInProject['type'],
) {
  const commonContracts = getCommonContractsIn(project)

  const usedIn = [
    ...new Set(
      addresses.flatMap((address) => {
        const references = commonContracts[address.address] ?? []
        return references.filter((ref) => project.id !== ref.id)
      }),
    ),
  ]

  return usedIn.map((ref) => {
    return {
      type,
      id: ref.id,
      name: ref.name,
      slug: ref.slug,
      targetName: ref.targetName,
      iconPath: `/icons/${ref.slug}.png`,
      hrefRoot: project.type === 'bridge' ? 'bridges' : 'scaling',
    }
  })
}
