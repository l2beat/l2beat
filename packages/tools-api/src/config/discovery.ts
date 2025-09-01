import {
  ConfigReader,
  get$Implementations,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { Address, Chain, DiscoveredConfig } from './types'

export function getDiscoveredConfig(chains: Chain[]): DiscoveredConfig {
  const paths = getDiscoveryPaths()
  const reader = new ConfigReader(paths.discovery)
  const projects = reader.readAllDiscoveredProjects()

  const names: Record<Address, string> = {}
  const abis: Record<Address, string[]> = {}
  const allAbis = new Set<string>()
  const preImages = new Set<string>()

  for (const project of projects) {
    const discovery = reader.readDiscovery(project)

    for (const abis of Object.values(discovery.abis)) {
      for (const entry of abis) {
        allAbis.add(entry)
      }
    }

    for (const entry of discovery.entries) {
      const chain = ChainSpecificAddress.longChain(entry.address)
      if (chains.find((x) => x.discoveryName === chain) === undefined) {
        continue
      }

      if (entry.name) {
        const address = entry.address.toLowerCase() as Address
        names[address] = `${project}/${entry.name}`

        const keys = [entry.address, ...get$Implementations(entry.values)]
        const abiEntries = new Set<string>()
        for (const key of keys) {
          for (const abi of discovery.abis[key] ?? []) {
            const match = abi.match(/^function ([A-Z_\d]+)\(\)/)
            if (match && match[1]) {
              preImages.add(match[1])
            }
            abiEntries.add(abi)
          }
        }
        if (abiEntries.size > 0) {
          abis[address] = [...abiEntries]
        }
      }
    }
  }

  return {
    names,
    abis,
    allAbis: [...allAbis],
    preImages: [...preImages],
  }
}
