import { Hash256 } from '@l2beat/shared'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname } from 'path'
import { rimraf } from 'rimraf'

import { Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { toDiscoveryOutput } from './toDiscoveryOutput'
import { toPrettyJson } from './toPrettyJson'

export async function saveDiscoveryResult(
  results: Analysis[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
) {
  const project = toDiscoveryOutput(
    config.name,
    configHash,
    blockNumber,
    results,
  )
  const json = await toPrettyJson(project)

  const root = `discovery/${config.name}`

  await writeFile(`${root}/discovered.json`, json)

  await rimraf(`${root}/.code`)
  for (const result of results) {
    if (result.type === 'EOA') {
      continue
    }
    for (const [i, files] of result.sources.entries()) {
      for (const [file, content] of Object.entries(files)) {
        const codebase = getSourceName(i, result.sources.length)
        const path = `${root}/.code/${result.name}${codebase}/${file}`
        await mkdirp(dirname(path))
        await writeFile(path, content)
      }
    }
  }
}

/**
 * Returns the name of the folder under which to save the source code.
 * /.code/[getSourceName(...)]/[file]
 *
 * If there is only one source, it returns '', meaning that the source code
 * will be saved under /.code/[file].
 *
 * If there are 2 sources, it returns '/proxy' or '/implementation'.
 *
 * If there are more it returns '/proxy', '/implementation-1', '/implementation-2', etc.
 */
function getSourceName(i: number, length: number) {
  let name = ''
  if (length > 1) {
    name = i === 0 ? 'proxy' : 'implementation'
  }
  if (length > 2 && i > 0) {
    name += `-${i}`
  }
  if (name) {
    name = `/${name}`
  }
  return name
}
