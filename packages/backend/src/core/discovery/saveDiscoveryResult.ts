import { EthereumAddress, Hash256, ProjectParameters } from '@l2beat/shared'
import { writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { DiscoveryConfig } from './DiscoveryConfig'

export async function saveDiscoveryResult(
  results: AnalyzedData[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
) {
  const project = prepareDiscoveryFile(results, config, blockNumber, configHash)

  await writeFile(
    `discovery/${config.name}/discovered.json`,
    JSON.stringify(project, null, 2),
  )
}

export function parseDiscoveryOutput(
  results: AnalyzedData[],
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
  results: AnalyzedData[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
): ProjectParameters {
  let abis: Record<string, string[]> = {}
  for (const result of results) {
    abis = { ...abis, ...result.meta.abis }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )

  return {
    name: config.name,
    blockNumber,
    configHash,
    contracts: results
      .filter((x) => !x.meta.isEOA)
      .map((x) => ({ ...x, meta: undefined }))
      .map((x) => ({ ...x, ...getCustomName(x.name, x.address, config) })),
    eoas: results
      .filter((x) => x.meta.isEOA)
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}

function getCustomName(
  derivedName: string,
  address: EthereumAddress,
  config: DiscoveryConfig,
) {
  if (!config.names?.[address.toString()]) {
    return {
      name: derivedName,
    }
  }

  return {
    name: config.names[address.toString()],
    derivedName: derivedName,
  }
}
