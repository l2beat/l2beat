import { ConfigReader } from '@l2beat/discovery'
import type {
  ContractParameters,
  DiscoveryOutput,
} from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { uniq, uniqBy } from 'lodash'
import { bridges } from '../projects/bridges'
import { daLayers } from '../projects/refactored'
import { layer2s } from '../projects/layer2s'
import { layer3s } from '../projects/layer3s'
import type {
  Bridge,
  DaBridge,
  Layer2,
  Layer3,
  ProjectContract,
} from '../types'
import { getChainNames, getChainNamesForDA } from '../utils/chains'

describe('verification status', () => {
  describe('L2BEAT', () => {
    const projects = [...layer2s, ...bridges, ...layer3s]

    for (const project of projects) {
      for (const chain of getChainNames(project)) {
        const projectId = project.id.toString()
        it(`${projectId}:${chain}`, () => {
          const unverified = getUniqueContractsForProject(project, chain)

          if (unverified.length <= 0) {
            return
          }

          const discoveries = getDiscoveries(projectId, chain)
          assert(
            discoveries.length > 0,
            `Failed to read discovery for ${projectId} on ${chain}, create a discovery entry for it. It is needed for ${unverified.toString()}`,
          )

          const notFound = containsAllAddresses(unverified, discoveries)
          assert(
            notFound.length === 0,
            `Failed to find the following addresses in project discoveries: ${notFound.join(', ')}`,
          )
        })
      }
    }
  })

  describe('DABEAT', () => {
    for (const project of daLayers) {
      const chains = getChainNamesForDA(project)
      for (const bridge of project.daBridges ?? []) {
        const bridgeId = bridge.id
        if (!bridgeId) {
          continue
        }
        for (const chain of chains) {
          it(`${bridge.id} on ${chain}`, () => {
            const unverified = getUniqueAddressesForDaBridge(bridge, chain)

            if (unverified.length <= 0) {
              return
            }

            const discoveries = getDiscoveries(bridgeId, chain)
            assert(
              discoveries.length > 0,
              `Failed to read discovery for ${bridgeId} on ${chain}, create a discovery entry for it. It is needed for ${unverified.toString()}`,
            )

            const notFound = containsAllAddresses(unverified, discoveries)
            assert(
              notFound.length === 0,
              `Failed to find the following addresses in project discoveries: ${notFound.join(', ')}`,
            )
          })
        }
      }
    }
  })
})

function getDiscoveries(project: string, chain: string): DiscoveryOutput[] {
  const configReader = new ConfigReader('../backend')

  let discovery = undefined
  try {
    discovery = configReader.readDiscovery(project, chain)
  } catch {}
  if (discovery === undefined) {
    return []
  }

  const result = [discovery]
  const sharedModules = discovery.sharedModules ?? []
  if (sharedModules.length > 0) {
    for (const sharedModule of sharedModules) {
      result.push(configReader.readDiscovery(sharedModule, chain))
    }
  }

  return result
}

function containsAllAddresses(
  addresses: EthereumAddress[],
  discoveries: DiscoveryOutput[],
): EthereumAddress[] {
  const inDiscovery = uniq(discoveries.flatMap((d) => addressesInDiscovery(d)))
  const notFound = []
  for (const usedAddress of addresses) {
    if (!inDiscovery.includes(usedAddress)) {
      notFound.push(usedAddress)
    }
  }
  return notFound
}

function addressesInDiscovery(discovery: DiscoveryOutput): EthereumAddress[] {
  const eoas = discovery.eoas.map((eoa) => eoa.address)
  const contracts = discovery.contracts.flatMap((c) => [
    c.address,
    ...getImplementations(c),
  ])

  return eoas.concat(contracts)
}

function getImplementations(contract: ContractParameters): EthereumAddress[] {
  const implementations = contract.values?.['$implementation'] ?? []

  if (Array.isArray(implementations)) {
    return implementations.map((i) => EthereumAddress(i.toString()))
  }
  return [EthereumAddress(implementations.toString())]
}

type Project = Layer2 | Layer3 | Bridge

function withoutDuplicates<T>(arr: T[]): T[] {
  return uniqBy(arr, JSON.stringify)
}

interface AddressOnChain {
  chain: string
  address: EthereumAddress
}

function getUniqueAddressesForDaBridge(
  bridge: DaBridge,
  chain: string,
): EthereumAddress[] {
  const addresses = withoutDuplicates(
    getDaBridgeContractsForChain(bridge, chain).map((c) => c.address),
  )
  const permissions = withoutDuplicates(
    getDaBridgePermissionsForChain(bridge, chain).map((p) => p.address),
  )

  return [...addresses, ...permissions]
}

function getUniqueContractsForProject(
  project: Project,
  chain: string,
): EthereumAddress[] {
  const projectContracts = getProjectContractsForChain(project, chain)
  const uniqueProjectContracts = getUniqueContractsFromList(
    projectContracts,
  ).map((c) => c.address)
  const permissionedAddresses = getPermissionedAddressesForChain(project, chain)

  return withoutDuplicates([
    ...uniqueProjectContracts,
    ...permissionedAddresses,
  ])
}

function getUniqueContractsFromList(
  contracts: ProjectContract[],
): AddressOnChain[] {
  const mainAddresses = contracts.flatMap((c) => ({
    address: c.address,
    chain: c.chain ?? 'ethereum',
  }))
  const upgradeabilityAddresses = contracts
    .filter((c) => !!c.upgradeability) // remove undefined
    .flatMap((c) =>
      (c.upgradeability?.implementations ?? []).flatMap((a) => ({
        address: a,
        chain: c.chain ?? 'ethereum',
      })),
    )
  return withoutDuplicates([...mainAddresses, ...upgradeabilityAddresses])
}

function getProjectContractsForChain(
  project: Project,
  chain: string,
): ProjectContract[] {
  const contracts = (project.contracts?.addresses[chain] ?? []).filter(
    (contract) => isContractOnChain(contract.chain, chain, project),
  )
  const escrows = project.config.escrows
    .flatMap((escrow) => {
      if (!escrow.contract) {
        return []
      }
      return { address: escrow.address, ...escrow.contract }
    })
    .filter((escrowContract) =>
      isContractOnChain(escrowContract.chain, chain, project),
    )

  return [...contracts, ...escrows]
}

function getDaBridgeContractsForChain(
  bridge: DaBridge,
  chain: string,
): AddressOnChain[] {
  const contracts = Object.values(bridge.contracts?.addresses ?? {}).flat()
  const addresses = getUniqueContractsFromList(contracts)
  return addresses.filter((a) => a.chain === chain)
}

function getDaBridgePermissionsForChain(
  bridge: DaBridge,
  chain: string,
): AddressOnChain[] {
  if (!bridge.permissions || bridge.permissions === 'UnderReview') {
    return []
  }

  const perChain = bridge.permissions?.[chain] ?? {}
  const all = [...(perChain.roles ?? []), ...(perChain.actors ?? [])]
  return all.flatMap((p) =>
    p.accounts.flatMap((a) => {
      if (!p.chain) {
        return []
      }
      return {
        chain: p.chain.toString(),
        address: a.address,
      }
    }),
  )
}

function getPermissionedAddressesForChain(project: Project, chain: string) {
  if (project.permissions === 'UnderReview') {
    return []
  }

  const all = []
  const perChain = project.permissions?.[chain] ?? {}
  all.push(...(perChain.roles ?? []))
  all.push(...(perChain.actors ?? []))

  return all
    .filter((p) => isContractOnChain(p.chain, chain, project))
    .flatMap((p) => [...p.accounts, ...(p.participants ?? [])])
    .filter((p) => p.type !== 'EOA')
    .map((p) => p.address)
}

function isContractOnChain(
  contractChain: string | undefined,
  chain: string,
  project: Project,
) {
  if (contractChain === undefined) {
    // For backwards compatibility, we assume that L2 contracts without chain are for ethereum
    contractChain = project.type === 'layer3' ? project.hostChain : 'ethereum'
  }
  return contractChain === chain
}
