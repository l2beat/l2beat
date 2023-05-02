import { EthereumAddress, Hash256, ProjectParameters } from '@l2beat/shared'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'

export function parseDiscoveryOutput(
  results: Analysis[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
): ProjectParameters {
  const prepared = prepareDiscoveryFile(
    results,
    config,
    blockNumber,
    configHash,
  )
  return JSON.parse(JSON.stringify(prepared)) as ProjectParameters
}

export function prepareDiscoveryFile(
  results: Analysis[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
): ProjectParameters {
  let abis: Record<string, string[]> = {}
  const contracts: AnalyzedContract[] = []
  for (const result of results) {
    if (result.type === 'Contract') {
      contracts.push(result)
      abis = { ...abis, ...result.sources.abis }
    }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )

  return {
    name: config.name,
    blockNumber,
    configHash,
    contracts: contracts.map((x) => ({
      ...x,
      type: undefined,
      sources: undefined,
      ...getCustomName(x.name, x.address, config),
    })),
    eoas: results
      .filter((x) => x.type === 'EOA')
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}

export function getCustomName(
  derivedName: string,
  address: EthereumAddress,
  config: DiscoveryConfig,
) {
  const name = config.overrides.get(address).name
  if (!name) {
    return { name: derivedName }
  }

  return { name, derivedName: derivedName }
}
