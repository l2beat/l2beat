import { readFile, writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { ProjectParameters } from './types'

export async function saveDiscoveryResult(
  results: AnalyzedData[],
  name: string,
  blockNumber: number,
  postfix: string = '',
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
    `discovery/${name}/discovered${postfix}.json`,
    JSON.stringify(project, null, 2),
  )
}

export async function readDiscoveryResult(
  name: string,
): Promise<ProjectParameters> {
  const rawResult = await readFile(`discovery/${name}/discovered.json`, 'utf-8')

  return JSON.parse(rawResult)
}
