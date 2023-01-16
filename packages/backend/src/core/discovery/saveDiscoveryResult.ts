import { writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { ContractParameters, ProjectParameters } from './types'

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
  name = 'undefined',
  blockNumber = -1,
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
    contracts: results.filter((x) => !x.meta.isEOA).map(toContractParameters),
    eoas: results
      .filter((x) => x.meta.isEOA)
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}

export function toContractParameters(
  analyzedData: AnalyzedData,
): ContractParameters {
  const contract: ContractParameters = {
    name: analyzedData.name,
    address: analyzedData.address,
    upgradeability: analyzedData.upgradeability,
  }

  if (analyzedData.unverified !== undefined) {
    contract.unverified = analyzedData.unverified
  }

  if (analyzedData.code !== undefined) {
    contract.code = analyzedData.code
  }

  if (analyzedData.values !== undefined) {
    contract.values = analyzedData.values
  }

  if (analyzedData.errors !== undefined) {
    contract.errors = analyzedData.errors
  }

  return contract
}
