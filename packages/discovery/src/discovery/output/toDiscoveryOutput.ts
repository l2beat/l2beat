import { ChainId, DiscoveryOutput, Hash256 } from '@l2beat/shared-pure'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'
import { DISCOVERY_LOGIC_VERSION } from '../engine/DiscoveryEngine'

export function toDiscoveryOutput(
  configName: string,
  chainId: ChainId,
  configHash: Hash256,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  return {
    name: configName,
    chain: ChainId.getName(chainId),
    blockNumber,
    configHash,
    version: DISCOVERY_LOGIC_VERSION,
    ...processAnalysis(results, chainId),
  }
}

export function processAnalysis(
  results: Analysis[],
  chainId: ChainId,
): Omit<
  DiscoveryOutput,
  'name' | 'blockNumber' | 'configHash' | 'version' | 'chain'
> {
  // DO NOT CHANGE BELOW CODE UNLESS YOU KNOW WHAT YOU ARE DOING!
  // CHANGES MIGHT TRIGGER UPDATE MONITOR FALSE POSITIVES!

  const { contracts, abis } = getContracts(results)
  return {
    contracts: contracts
      .sort((a, b) => a.address.localeCompare(b.address.toString()))
      .map((x) =>
        withoutUndefinedKeys({
          name: x.name,
          address: x.address,
          unverified: x.isVerified ? undefined : (true as const),
          code: getCodeLink(x, chainId),
          upgradeability: x.upgradeability,
          values: Object.keys(x.values).length === 0 ? undefined : x.values,
          errors: Object.keys(x.errors).length === 0 ? undefined : x.errors,
          derivedName: x.derivedName,
        }),
      ),
    eoas: results
      .filter((x) => x.type === 'EOA')
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}

function getContracts(results: Analysis[]) {
  let abis: Record<string, string[]> = {}
  const contracts: AnalyzedContract[] = []
  for (const result of results) {
    if (result.type === 'Contract') {
      contracts.push(result)
      abis = { ...abis, ...result.abis }
    }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )
  return { contracts, abis }
}

function getCodeLink(analysis: Analysis, chainId: ChainId) {
  if (analysis.type === 'EOA') {
    return undefined
  }
  const addresses = [analysis.address]
  addresses.push(...analysis.implementations)
  const dethDomain = getDethDomain(chainId)
  if (!dethDomain) {
    return undefined
  }
  return `https://${dethDomain}/address/${addresses.join(',')}`
}

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}

function getDethDomain(chainId: ChainId): string | undefined {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return 'etherscan.deth.net'
    case ChainId.ARBITRUM:
      return 'arbiscan.deth.net'
    case ChainId.OPTIMISM:
      return 'optimistic.etherscan.deth.net'
    case ChainId.POLYGON_POS:
      return 'polygonscan.deth.net'
    case ChainId.BSC:
      return 'bscscan.deth.net'
    case ChainId.AVALANCHE:
      return 'snowtrace.deth.net'
    default:
      return undefined
  }
}
