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
          const addressInProjects = commonContracts[address] ?? []
          return addressInProjects.filter((id) => project.id !== id)
        }),
      ),
    ]

    let usedInProjects: UsedInProject[] | undefined

    if (usedIn.length > 0) {
      usedInProjects = usedIn.map((id) => {
        const refProject = projects.find((p) => p.id === id)
        if (!refProject) {
          throw new Error('Invalid project type')
        }

        return {
          type,
          id,
          name: refProject.display.name,
          slug: refProject.display.slug,
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
