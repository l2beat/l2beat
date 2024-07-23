import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  getCommonContractsIn,
} from '@l2beat/config'
import { type TechnologyContractAddress } from '../../../app/_components/projects/sections/permissions/contract-entry'
import { type UsedInProject } from '../../../app/_components/projects/sections/permissions/used-in-project'

type ProjectParams =
  | {
      id: string
      type: (Layer2 | Bridge | DaLayer)['type']
    }
  | {
      id: string
      type: Layer3['type']
      hostChain: string
    }

export function getUsedInProjects(
  projectParams: ProjectParams,
  addresses: TechnologyContractAddress[],
  implementationAddresses: TechnologyContractAddress[],
): UsedInProject[] {
  if (projectParams.type === 'da-layer') {
    return []
  }

  if (implementationAddresses.length === 0) {
    return evalUsedInProject(projectParams, addresses, 'implementation')
  }

  const asProxy = evalUsedInProject(projectParams, addresses, 'proxy')
  const asImplementation = evalUsedInProject(
    projectParams,
    implementationAddresses,
    'implementation',
  )
  return (asProxy ?? []).concat(asImplementation ?? [])
}

function evalUsedInProject(
  projectParams: ProjectParams,
  addresses: TechnologyContractAddress[],
  type: UsedInProject['type'],
) {
  const commonContracts = getCommonContractsIn(projectParams)

  const usedIn = [
    ...new Set(
      addresses.flatMap((address) => {
        const references = commonContracts[address.address] ?? []
        return references.filter((ref) => projectParams.id !== ref.id)
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
      hrefRoot: projectParams.type === 'bridge' ? 'bridges' : 'scaling',
    }
  })
}
