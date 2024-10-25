import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
  getCommonContractsIn,
} from '@l2beat/config'
import { uniqBy } from 'lodash'
import { type TechnologyContractAddress } from '../../../components/projects/sections/contract-entry'
import { type UsedInProject } from '../../../components/projects/sections/permissions/used-in-project'

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
  if (projectParams.type === 'DaLayer') {
    return []
  }
  const commonContracts = getCommonContractsIn(projectParams)

  if (implementationAddresses.length === 0) {
    return evalUsedInProject(
      projectParams,
      commonContracts,
      addresses,
      'implementation',
    )
  }

  const asProxy = evalUsedInProject(
    projectParams,
    commonContracts,
    addresses,
    'proxy',
  )
  const asImplementation = evalUsedInProject(
    projectParams,
    commonContracts,
    implementationAddresses,
    'implementation',
  )
  return uniqBy((asProxy ?? []).concat(asImplementation ?? []), JSON.stringify)
}

function evalUsedInProject(
  projectParams: ProjectParams,
  commonContracts: ReturnType<typeof getCommonContractsIn>,
  addresses: TechnologyContractAddress[],
  type: UsedInProject['type'],
) {
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
