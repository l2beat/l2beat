import { dirname, posix } from 'path'
import type { DiscoveryOutput } from '@l2beat/discovery-types'
import { assert, type EthereumAddress } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { rimraf } from 'rimraf'
import type { DiscoveryLogger } from '../DiscoveryLogger'
import type { Analysis } from '../analysis/AddressAnalyzer'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'
import { buildAndSaveModels } from '../modelling/build'
import { removeSharedNesting } from '../source/removeSharedNesting'
import { flattenDiscoveredSources } from './flattenDiscoveredSource'
import { toDiscoveryOutput } from './toDiscoveryOutput'
import { toPrettyJson } from './toPrettyJson'

export interface SaveDiscoveryResultOptions {
  rootFolder?: string
  sourcesFolder?: string
  flatSourcesFolder?: string
  discoveryFilename?: string
  metaFilename?: string
  saveSources?: boolean
  buildModels?: boolean
  templatesFolder: string
}

export async function saveDiscoveryResult(
  results: Analysis[],
  config: DiscoveryConfig,
  blockNumber: number,
  logger: DiscoveryLogger,
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const root =
    options.rootFolder ?? posix.join('discovery', config.name, config.chain)
  await mkdirp(root)

  const discoveryOutput = toDiscoveryOutput(config, blockNumber, results)
  await saveDiscoveredJson(discoveryOutput, root, options)
  await saveFlatSources(root, results, logger, options)
  if (options.saveSources) {
    await saveSources(root, results, options)
  }
  if (options.buildModels) {
    buildAndSaveModels(discoveryOutput, options.templatesFolder, root)
  }
}

async function saveDiscoveredJson(
  discoveryOutput: DiscoveryOutput,
  rootPath: string,
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const json = await toPrettyJson(discoveryOutput)
  const discoveryFilename = options.discoveryFilename ?? 'discovered.json'
  await writeFile(posix.join(rootPath, discoveryFilename), json)
}

async function saveSources(
  rootPath: string,
  results: Analysis[],
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const sourcesFolder = options.sourcesFolder ?? '.code'
  const sourcesPath = posix.join(rootPath, sourcesFolder)
  const allContractNames = results.map((c) =>
    c.type !== 'EOA' ? c.name : 'EOA',
  )

  await rimraf(sourcesPath)
  for (const contract of results) {
    if (contract.type === 'EOA') {
      continue
    }

    for (const [i, bundle] of contract.sourceBundles.entries()) {
      const simplified = removeSharedNesting(
        Object.entries(bundle.source.files),
      )
      for (const [fileName, content] of simplified) {
        const path = getSourceOutputPath(
          fileName,
          i,
          contract.sourceBundles.length,
          contract.name,
          contract.address,
          sourcesPath,
          allContractNames,
        )
        await mkdirp(dirname(path))
        await writeFile(path, content)
      }
    }
  }
}

async function saveFlatSources(
  rootPath: string,
  results: Analysis[],
  logger: DiscoveryLogger,
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const flatSourcesFolder = options.flatSourcesFolder ?? '.flat'
  const flatSourcesPath = posix.join(rootPath, flatSourcesFolder)

  await rimraf(flatSourcesPath)
  await mkdirp(flatSourcesPath)

  const flatten = flattenDiscoveredSources(results, logger)
  for (const entryPath of Object.keys(flatten)) {
    const outputPath = posix.join(flatSourcesPath, entryPath)

    if (posix.dirname(outputPath) !== flatSourcesPath) {
      await mkdirp(posix.dirname(outputPath))
    }

    const content = flatten[entryPath]
    assert(content !== undefined, 'Content should never be undefined')

    await writeFile(outputPath, content)
  }
}

export function getSourceOutputPath(
  fileName: string,
  fileIndex: number,
  filesCount: number,
  contractName: string,
  contractAddress: EthereumAddress,
  root: string,
  allContractNames: string[],
): string {
  // If there are multiple different contracts discovered with the same
  // name, append their address to the folder name.
  const hasNameClash =
    allContractNames.filter((n) => n === contractName).length > 1
  const uniquenessSuffix = hasNameClash ? `-${contractAddress.toString()}` : ''

  const implementationFolder = getImplementationFolder(fileIndex, filesCount)

  return posix.join(
    root,
    `${contractName}${uniquenessSuffix}`,
    implementationFolder,
    fileName,
  )
}

/**
 * Returns the name of the folder under which to save the source code.
 * If there is only one source, it returns '', meaning that the source code
 * will be saved at current folder level.
 *
 * If there are 2 sources, it returns '/proxy' or '/implementation'.
 * If there are more it returns
 * '/proxy', '/implementation-1', '/implementation-2', etc.
 */
function getImplementationFolder(i: number, sourcesCount: number): string {
  let name = ''
  if (sourcesCount > 1) {
    name = i === 0 ? 'proxy' : 'implementation'
  }
  if (sourcesCount > 2 && i > 0) {
    name += `-${i}`
  }
  if (name) {
    name = `/${name}`
  }
  return name
}
