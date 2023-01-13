import { writeFile } from 'fs/promises'

import { AnalyzedData, ContractParameters, ProjectParameters } from './types'

export async function saveDiscoveryResult(
  results: AnalyzedData[],
  name: string,
  blockNumber: number,
) {
  const project = prepareDiscoveryFile(results, name, blockNumber)

  await writeFile(
    `discovery/${name}/discovered.json`,
    JSON.stringify(project, null, 2),
  )
}

export function prepareDiscoveryFile(
  results: AnalyzedData[],
  name: string,
  blockNumber: number,
): ProjectParameters {
  let abis: Record<string, string[]> = {}
  for (const result of results) {
    abis = { ...abis, ...result.meta.abis }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )

  return {
    name,
    blockNumber,
    contracts: results
      .filter((x) => !x.meta.isEOA)
      .map(toContractParameters),
    eoas: results
      .filter((x) => x.meta.isEOA)
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}

export function toContractParameters(analyzedData: AnalyzedData): ContractParameters {
  return {
    name: analyzedData.name,
    unverified: analyzedData.unverified,
    address: analyzedData.address,
    code: analyzedData.code,
    upgradeability: analyzedData.upgradeability,
    values: analyzedData.values,
    errors: analyzedData.errors
  }
}