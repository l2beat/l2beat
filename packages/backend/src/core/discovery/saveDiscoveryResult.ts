import { writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { ProjectParameters } from './types'

export async function saveDiscoveryResult(
  results: AnalyzedData[],
  name: string,
  blockNumber: number,
) {
  let abis: Record<string, string[]> = {}
  for (const result of results) {
    abis = { ...abis, ...result.meta.abis }
  }
  abis = Object.fromEntries(
    Object.entries(abis).sort(([a], [b]) => a.localeCompare(b)),
  )

  const project: ProjectParameters = {
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

  await writeFile(
    `discovery/${name}/discovered.json`,
    JSON.stringify(project, null, 2),
  )
}
