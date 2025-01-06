import { ConfigReader } from '@l2beat/discovery'
import { ContractParameters, DiscoveryOutput } from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { uniq } from 'lodash'
import { bridges, daLayers, layer2s, layer3s } from '../projects'
import { getChainNames, getChainNamesForDA } from '../utils/chains'
import { getManuallyVerifiedContracts } from '../verification/manuallyVerifiedContracts'
import {
  getUniqueAddressesForDaBridge,
  getUniqueContractsForProject,
} from './implementation'

describe('verification status', () => {
  describe('L2BEAT', () => {
    const projects = [...layer2s, ...bridges, ...layer3s]

    for (const project of projects) {
      for (const chain of getChainNames(project)) {
        const projectId = project.id.toString()
        it(`${projectId}:${chain}`, () => {
          const manuallyVerified = getManuallyVerifiedContracts(chain)
          const addressesOnChain = getUniqueContractsForProject(project, chain)
          const unverified = addressesOnChain.filter(
            (a) => manuallyVerified[a] === undefined,
          )

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
    for (const daLayer of daLayers) {
      const chains = getChainNamesForDA(daLayer)
      for (const bridge of daLayer.bridges) {
        const bridgeId = bridge.id.toString()
        for (const chain of chains) {
          it(`${bridgeId}:${chain}`, () => {
            const projectIds =
              daLayer.kind === 'PublicBlockchain'
                ? [bridge.id]
                : bridge.usedIn.map((u) => u.id.toString())
            for (const projectId of projectIds) {
              const manuallyVerified = getManuallyVerifiedContracts(chain)
              const addressesOnChain = getUniqueAddressesForDaBridge(
                bridge,
                chain,
              )
              const unverified = addressesOnChain.filter(
                (a) => manuallyVerified[a] === undefined,
              )

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
            }
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
  const config = configReader.readConfig(project, chain)
  if (config.sharedModules.length > 0) {
    for (const sharedModule of config.sharedModules) {
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
