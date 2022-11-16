import { writeFile } from 'fs/promises'

import { AnalyzedData } from './analyzeItem'
import { ProjectParameters } from './types'

export async function saveDiscoveryResult(
  result: AnalyzedData[],
  name: string,
  blockNumber: number,
) {
  const project: ProjectParameters = {
    name,
    blockNumber,
    contracts: result
      .filter((x) => !x.meta.isEOA)
      .map((x) => ({ ...x, meta: undefined })),
  }

  await writeFile(
    `discovery/${name}/discovered.json`,
    JSON.stringify(project, null, 2),
  )
}
