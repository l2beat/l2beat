import { writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { ProjectParameters } from './types'

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

export function parseDiscoveryOutput(
  results: AnalyzedData[],
): ProjectParameters {
  const prepared = prepareDiscoveryFile(results)
  return JSON.parse(JSON.stringify(prepared)) as ProjectParameters
}

function prepareDiscoveryFile(
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
    contracts: results
      .filter((x) => !x.meta.isEOA)
      .map((x) => ({ ...x, meta: undefined })),
    eoas: results
      .filter((x) => x.meta.isEOA)
      .map((x) => x.address)
      .sort((a, b) => a.localeCompare(b.toString())),
    abis,
  }
}
