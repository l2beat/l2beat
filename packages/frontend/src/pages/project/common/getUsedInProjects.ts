import { Bridge, Layer2, Layer3, getCommonContractsIn } from '@l2beat/config'
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
    const commonContracts = getCommonContractsIn(project)

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
