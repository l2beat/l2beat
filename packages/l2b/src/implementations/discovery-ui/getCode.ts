import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { ConfigReader, DiscoveryPaths } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery'
import { getChainFullName } from '@l2beat/discovery/dist/config/config.discovery'
import { getProjectDiscoveries } from './getDiscoveries'
import type { ApiCodeResponse } from './types'

export function getCode(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  address: string,
): ApiCodeResponse {
  const codePaths = getCodePaths(paths, configReader, project, address)
  return {
    sources: codePaths
      .map(({ name, path }) => ({
        name: name,
        code: readFileSync(path, 'utf-8'),
      }))
      .sort((a, b) => compareFiles(a.name, b.name)),
  }
}

export function getCodePaths(
  paths: DiscoveryPaths,
  configReader: ConfigReader,
  project: string,
  address: string,
): { name: string; path: string }[] {
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
      return [{ name: `${entry.name}.sol`, path: join(root, name + '.sol') }]
    } else {
      const dir = readdirSync(join(root, name))
      return dir
        .map((file) => ({
          name: file,
          path: join(root, name, file),
        }))
        .sort((a, b) => compareFiles(a.name, b.name))
    }
  }

  return []
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
