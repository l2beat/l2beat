import { DiscoveryOutput, Hash256 } from '@l2beat/shared'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'

export function toDiscoveryOutput(
  configName: string,
  configHash: Hash256,
  blockNumber: number,
  results: Analysis[],
): DiscoveryOutput {
  return {
    name: configName,
    blockNumber,
    configHash,
    ...processAnalysis(results),
  }
}

export function processAnalysis(
  results: Analysis[],
): Omit<DiscoveryOutput, 'name' | 'blockNumber' | 'configHash'> {
  // DO NOT CHANGE BELOW CODE UNLESS YOU KNOW WHAT YOU ARE DOING!
  // CHANGES MIGHT TRIGGER UPDATE MONITOR FALSE POSITIVES!

  const { contracts, abis } = getContracts(results)
  return {
    contracts: contracts.map((x) =>
      withoutUndefinedKeys({
        name: x.name,
        address: x.address,
        unverified: x.isVerified ? undefined : (true as const),
        code: x.codeLink,
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

function withoutUndefinedKeys<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T
}
