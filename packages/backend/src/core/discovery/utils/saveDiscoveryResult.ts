import { EthereumAddress, Hash256, ProjectParameters } from '@l2beat/shared'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname } from 'path'
import { rimraf } from 'rimraf'

import { AnalyzedData } from '../analyzeItem'
import { DiscoveryConfig } from '../config/DiscoveryConfig'

export async function saveDiscoveryResult(
  results: AnalyzedData[],
  config: DiscoveryConfig,
  blockNumber: number,
  configHash: Hash256,
) {
  const project = prepareDiscoveryFile(results, config, blockNumber, configHash)

  const root = `discovery/${config.name}`

  await writeFile(`${root}/discovered.json`, JSON.stringify(project, null, 2))

  await rimraf(`${root}/.code`)
  for (const result of results) {
    for (const [i, source] of result.meta.sources.entries()) {
      for (const [file, content] of Object.entries(source.files)) {
        const name = getSourceName(i, result.meta.sources.length)
        const path = `${root}/.code/${result.name}${name}/${file}`
        await mkdirp(dirname(path))
        await writeFile(path, content)
      }
    }
  }
}

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
  const name = config.overrides.get(address)?.name
  if (!name) {
    return { name: derivedName }
  }

  return { name, derivedName: derivedName }
}
