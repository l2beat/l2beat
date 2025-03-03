import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { ConfigReader } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery'
import { getChainFullName } from '@l2beat/discovery/dist/config/config.discovery'
import type { ApiCodeResponse } from './types'

export function getCode(
  configReader: ConfigReader,
  project: string,
  address: string,
): ApiCodeResponse {
  const codePaths = getCodePaths(configReader, project, address)
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
  configReader: ConfigReader,
  project: string,
  address: string,
): { name: string; path: string }[] {
  const [chainShortName, simpleAddress] = address.split(':')
  const chain = getChainFullName(chainShortName)
  const baseDiscovery = configReader.readDiscovery(project, chain)
  const discoveries = [baseDiscovery]
  for (const sharedModule of baseDiscovery.sharedModules ?? []) {
    discoveries.push(configReader.readDiscovery(sharedModule, chain))
  }

  for (const discovery of discoveries) {
    const contract = discovery.contracts.find(
      (x) => x.address === simpleAddress,
    )
    if (!contract) {
      continue
    }

    const similar = discovery.contracts.filter((x) => x.name === contract.name)
    const hasImplementations = get$Implementations(contract.values).length > 0

    const name =
      similar.length > 1
        ? `${contract.name}-${contract.address}`
        : `${contract.name}`
    const root = join(
      configReader.rootPath,
      'discovery',
      discovery.name,
      chain,
      '.flat',
    )

    if (!hasImplementations) {
      return [{ name: `${contract.name}.sol`, path: join(root, name + '.sol') }]
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
