import type { Logger } from '@l2beat/backend-tools'
import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
  formatJson,
  type UnixTime,
} from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { dirname, posix } from 'path'
import { rimraf } from 'rimraf'
import type { Analysis } from '../analysis/AddressAnalyzer'
import { TemplateService } from '../analysis/TemplateService'
import type { ConfigRegistry } from '../config/ConfigRegistry'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import { removeSharedNesting } from '../source/removeSharedNesting'
import { flattenDiscoveredSources } from './flattenDiscoveredSource'
import { toDiscoveryOutput } from './toDiscoveryOutput'
import type { DiscoveryOutput } from './types'

export interface SaveDiscoveryResultOptions {
  paths: DiscoveryPaths
  sourcesFolder?: string
  flatSourcesFolder?: string
  discoveryFilename?: string
  metaFilename?: string
  saveSources?: boolean
  templatesFolder: string
  /**
   * Explicit path where the project\'s discovery output should be written.
   * When provided it overrides the default
   *   `${paths.discovery}/${project}/${chain}`.
   */
  projectDiscoveryFolder?: string
}

export async function saveDiscoveryResult(
  results: Analysis[],
  config: ConfigRegistry,
  timestamp: UnixTime,
  usedBlockNumbers: Record<string, number>,
  logger: Logger,
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const projectDiscoveryFolder =
    options.projectDiscoveryFolder ??
    posix.join(options.paths.discovery, config.structure.name)
  await mkdirp(projectDiscoveryFolder)

  const templateService = new TemplateService(options.paths.discovery)
  const discoveryOutput = toDiscoveryOutput(
    templateService,
    config,
    timestamp,
    usedBlockNumbers,
    results,
  )

  // TODO: Should not be here - drop it and use implementation name once it's ready
  // if somebody changes the name and decides to re-colorize
  // then .flat folder will be incorrect
  const remappedResults = remapNames(results, discoveryOutput)

  await saveDiscoveredJson(
    discoveryOutput,
    projectDiscoveryFolder,
    options.discoveryFilename,
  )
  await saveFlatSources(
    projectDiscoveryFolder,
    remappedResults,
    logger,
    options,
  )
  if (options.saveSources) {
    await saveSources(projectDiscoveryFolder, remappedResults, options)
  }
}

export async function saveDiscoveredJson(
  discoveryOutput: DiscoveryOutput,
  rootPath: string,
  discoveryFilename: string | undefined = undefined,
): Promise<void> {
  const json = formatJson(discoveryOutput)
  const outputPath = discoveryFilename ?? 'discovered.json'
  await writeFile(posix.join(rootPath, outputPath), json)
}

async function saveSources(
  rootPath: string,
  results: Analysis[],
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const sourcesFolder = options.sourcesFolder ?? '.code'
  const sourcesPath = posix.join(rootPath, sourcesFolder)
  const allContractNames = results
    .filter((c) => c.type !== 'Reference')
    .map((c) => (c.type !== 'EOA' ? c.name : 'EOA'))

  await rimraf(sourcesPath)
  for (const contract of results) {
    if (contract.type === 'EOA' || contract.type === 'Reference') {
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
          ChainSpecificAddress.address(contract.address), // TODO(radomski): The output path should prolly change
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
  logger: Logger,
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

function remapNames(
  results: Analysis[],
  discoveryOutput: DiscoveryOutput,
): Analysis[] {
  return results.map((entry) => {
    if (entry.type === 'EOA' || entry.type === 'Reference') {
      return entry
    }

    const matchingEntry = discoveryOutput.entries.find(
      (e) => e.address === entry.address,
    )

    if (!matchingEntry) {
      return entry
    }

    const newName = matchingEntry.name ?? entry.name

    return {
      ...entry,
      name: newName,
    }
  })
}
