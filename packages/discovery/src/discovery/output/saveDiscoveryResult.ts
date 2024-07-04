import { dirname, posix } from 'path'
import { assert } from '@l2beat/backend-tools'
import { EthereumAddress } from '@l2beat/shared-pure'
import { writeFile } from 'fs/promises'
import { mkdirp } from 'mkdirp'
import { rimraf } from 'rimraf'

import {
  FileContent,
  ParsedFilesManager,
} from '../../flatten/ParsedFilesManager'
import { flattenStartingFrom } from '../../flatten/flattenStartingFrom'
import { formatSI, getThroughput, timed } from '../../utils/timing'
import { DiscoveryLogger } from '../DiscoveryLogger'
import { Analysis } from '../analysis/AddressAnalyzer'
import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { PerContractSource } from '../source/SourceCodeService'
import { removeSharedNesting } from '../source/removeSharedNesting'
import { toDiscoveryOutput } from './toDiscoveryOutput'
import { toPrettyJson } from './toPrettyJson'

export interface SaveDiscoveryResultOptions {
  rootFolder?: string
  sourcesFolder?: string
  flatSourcesFolder?: string
  discoveryFilename?: string
  metaFilename?: string
  saveSources?: boolean
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

  await saveDiscoveredJson(root, results, config, blockNumber, options)
  await saveFlatSources(root, results, logger, options)
  if (options.saveSources) {
    await saveSources(root, results, options)
  }
}

async function saveDiscoveredJson(
  rootPath: string,
  results: Analysis[],
  config: DiscoveryConfig,
  blockNumber: number,
  options: SaveDiscoveryResultOptions,
): Promise<void> {
  const project = toDiscoveryOutput(
    config.name,
    config.chain,
    config.hash,
    blockNumber,
    results,
  )
  const json = await toPrettyJson(project)
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

  logger.log(`Saving flattened sources`)

  const nameCounts = new Map<string, number>()
  for (const contract of results) {
    if (contract.type === 'EOA') {
      continue
    }

    const name = contract.name
    const count = nameCounts.get(name) || 0
    nameCounts.set(name, count + 1)
  }

  for (const analyzedContract of results) {
    try {
      if (analyzedContract.type === 'EOA') {
        continue
      }

      let outName = analyzedContract.name
      const count = nameCounts.get(outName) || 0
      if (count > 1) {
        outName = `${outName}-${analyzedContract.address}`
      }

      await writeFlattenedFiles(
        flatSourcesPath,
        outName,
        analyzedContract.sourceBundles,
        logger,
      )
    } catch (e) {
      assert(analyzedContract.type !== 'EOA', 'This should never happen')
      const contractName = analyzedContract.derivedName ?? analyzedContract.name

      logger.log(`[FAIL]: ${contractName} - ${stringifyError(e)}`)
    }
  }
}

async function writeFlattenedFiles(
  flatSourcesPath: string,
  topLevelName: string,
  bundles: PerContractSource[],
  logger: DiscoveryLogger,
) {
  let containingDirectory = ''
  if (bundles.length > 1) {
    containingDirectory = topLevelName

    const path = posix.join(flatSourcesPath, containingDirectory)
    await mkdirp(path)
  }

  for (const [bundleIndex, bundle] of bundles.entries()) {
    const input: FileContent[] = Object.entries(bundle.source.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    if (input.length === 0) {
      logger.log(`[SKIP]: ${topLevelName}-${bundle.name} no .sol files`)
      continue
    }

    const result = timed(() => {
      const parsedFileManager = ParsedFilesManager.parseFiles(
        input,
        bundle.source.remappings,
      )
      const output = flattenStartingFrom(bundle.name, parsedFileManager)

      return output
    })

    const throughput = formatThroughput(input, result.executionTime)

    const flatContent = addSolidityVersionComment(
      bundle.source.solidityVersion,
      result.value,
    )

    const fileName = bundles.length > 1 ? bundle.name : topLevelName

    const hasProxy = bundles.length > 1
    const isProxy = hasProxy && bundleIndex === 0
    const hasManyImplementations = bundles.length > 2

    const implementationPostfix = hasManyImplementations
      ? `.${bundleIndex}`
      : ''
    const proxyPostfix = isProxy ? '.p' : ''
    const postfix = isProxy ? proxyPostfix : implementationPostfix

    const path = posix.join(
      flatSourcesPath,
      containingDirectory,
      `${fileName}${postfix}.sol`,
    )
    await writeFile(path, flatContent)

    logger.log(`[ OK ]: ${topLevelName} @ ${throughput}`)
  }
}

function addSolidityVersionComment(
  solidityVersion: string,
  flatSource: string,
): string {
  return `// Compiled with solc version: ${solidityVersion}\n\n${flatSource}`
}

function formatThroughput(
  input: FileContent[],
  executionTimeMilliseconds: number,
): string {
  const sourceLineCount = input.reduce(
    (acc, { content }) => acc + content.split('\n').length,
    0,
  )
  const throughput = formatSI(
    getThroughput(sourceLineCount, executionTimeMilliseconds),
    'lines/s',
  )

  return throughput
}

function stringifyError(e: unknown): string {
  if (e instanceof Error) {
    return e.message
  } else if (typeof e === 'string') {
    return e
  }

  return JSON.stringify(e)
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
export function getImplementationFolder(
  i: number,
  sourcesCount: number,
): string {
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
