import {
  Bridge,
  Layer2,
  Layer3,
  getCommonContractsIn,
  getProjectsIn,
} from '@l2beat/config'
import { UsedInProject } from '../components/sections/common/ContractEntry'

export function getUsedInProjects(
  project: Layer2 | Layer3 | Bridge,
  addresses: string[],
  implementationAddresses: string[],
): UsedInProject[] | undefined {
  const evalUsedInProject = (
    addresses: string[],
    type: UsedInProject['type'],
  ) => {
    const commonContracts = getCommonContractsIn(project.type)
    const projects = getProjectsIn(project.type)

    const usedIn = [
      ...new Set(
        addresses.flatMap((address) => {
          const references = commonContracts[address] ?? []
          return references.filter((ref) => project.id !== ref.id)
        }),
      ),
    ]

    let usedInProjects: UsedInProject[] | undefined

    if (usedIn.length > 0) {
      usedInProjects = usedIn.map((ref) => {
        const refProject = projects.find((p) => p.id === ref.id)
        if (!refProject) {
          throw new Error('Invalid project type')
        }

        return {
          type,
          id: ref.id,
          name: refProject.display.name,
          slug: refProject.display.slug,
          targetName: ref.targetName,
          iconPath: `/icons/${refProject.display.slug}.png`,
        }
      })
    }
    return usedInProjects
  }

  if (implementationAddresses.length === 0) {
    return evalUsedInProject(addresses, 'implementation')
  }

  const asProxy = evalUsedInProject(addresses, 'proxy')
  const asImplementation = evalUsedInProject(
    implementationAddresses,
    'implementation',
  )
  return (asProxy ?? []).concat(asImplementation ?? [])
}
