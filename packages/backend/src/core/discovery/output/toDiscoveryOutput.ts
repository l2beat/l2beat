import { Hash256, ProjectParameters } from '@l2beat/shared'

import { Analysis, AnalyzedContract } from '../analysis/AddressAnalyzer'

export function toDiscoveryOutput(
  configName: string,
  configHash: Hash256,
  blockNumber: number,
  results: Analysis[],
): ProjectParameters {
  return {
    name: configName,
    blockNumber,
    configHash,
    ...processAnalysis(results),
  }
}

export function processAnalysis(
  results: Analysis[],
): Omit<ProjectParameters, 'name' | 'blockNumber' | 'configHash'> {
  const { contracts, abis } = getContracts(results)
  return {
    contracts: contracts
      .map((x) =>
        withoutUndefinedKeys({
          address: x.address,
          name: x.name,
          derivedName: x.name !== x.derivedName ? x.derivedName : undefined,
          unverified: x.isVerified ? undefined : (true as const),
          code: x.codeLink,
          upgradeability: x.upgradeability,
          values: Object.keys(x.values).length === 0 ? undefined : x.values,
          errors: Object.keys(x.errors).length === 0 ? undefined : x.errors,
        }),
      )
      .sort((a, b) => a.address.localeCompare(b.address.toString())),
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
      abis = { ...abis, ...result.sources.abis }
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
