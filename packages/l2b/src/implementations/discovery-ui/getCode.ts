import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { ConfigReader, DiscoveryPaths } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery'
import {
  getChainFullName,
  getChainShortName,
} from '@l2beat/discovery/dist/config/config.discovery'
import {
  getAllProjectDiscoveries,
  getProjectDiscoveries,
} from './getDiscoveries'
import type { ApiCodeResponse } from './types'

export function getCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  address: string,
): ApiCodeResponse {
  const { entryName, codePaths } = getCodePaths(
    paths,
    configReader,
    project,
    address,
  )

  return {
    entryName,
    sources: codePaths
      .map(({ name, path }) => ({
        name: name,
        code: readFileSync(path, 'utf-8'),
      }))
      .sort((a, b) => compareFiles(a.name, b.name)),
  }
}

export function getAllCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
): Record<string, ApiCodeResponse> {
  const result: Record<string, ApiCodeResponse> = {}
  const discoveries = getAllProjectDiscoveries(configReader, project)

  // Get all unique addresses across all chains
  const allAddresses = discoveries.flatMap((discovery) =>
    discovery.entries
      .filter((e) => e.type === 'Contract')
      .map((entry) => ({
        chain: getChainShortName(discovery.chain),
        address: entry.address,
      })),
  )

  for (const { chain, address } of allAddresses) {
    const fullAddress = `${chain}:${address}`
    try {
      const { entryName, codePaths } = getCodePaths(
        paths,
        configReader,
        project,
        fullAddress,
      )
      result[fullAddress] = {
        entryName,
        sources: codePaths
          .map(({ name: fileName, path }) => ({
            name: fileName,
            code: readFileSync(path, 'utf-8'),
          }))
          .sort((a, b) => compareFiles(a.name, b.name)),
      }
    } catch (error) {
      console.error(`Failed to get code for address ${fullAddress}`, error)
    }
  }

  return result
}

export function getCodePaths(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  address: string,
): {
  entryName: string | undefined
  codePaths: { name: string; path: string }[]
} {
  const [chainShortName, simpleAddress] = address.split(':')
  const chain = getChainFullName(chainShortName)
  const discoveries = getProjectDiscoveries(configReader, project, chain)

  for (const discovery of discoveries) {
    const entry = discovery.entries.find((x) => x.address === simpleAddress)
    if (!entry) {
      continue
    }

    const similar = discovery.entries.filter((x) => x.name === entry.name)
    const hasImplementations = get$Implementations(entry.values).length > 0

    const name =
      similar.length > 1 ? `${entry.name}-${entry.address}` : `${entry.name}`
    const root = join(paths.discovery, discovery.name, chain, '.flat')

    if (!hasImplementations) {
      return {
        entryName: entry.name,
        codePaths: [
          { name: `${entry.name}.sol`, path: join(root, name + '.sol') },
        ],
      }
    } else {
      const dir = readdirSync(join(root, name))
      const codePaths = dir
        .map((file) => ({
          name: file,
          path: join(root, name, file),
        }))
        .sort((a, b) => compareFiles(a.name, b.name))
      return {
        entryName: entry.name,
        codePaths,
      }
    }
  }

  return { entryName: undefined, codePaths: [] }
}

function compareFiles(a: string, b: string) {
  return fileNameToOrder(a) - fileNameToOrder(b)
}

function fileNameToOrder(name: string) {
  const ending = name.match(/\.(\w+)\.sol/)?.[1]
  if (!ending) {
    return 1
  }
  if (ending === 'p') {
    return 0
  }
  return /^\d+$/.test(ending) ? parseInt(ending) : 2
}
