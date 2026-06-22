import { type ConfigReader, get$Implementations } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { readdirSync } from 'fs'
import { join } from 'path'
import { getProjectDiscoveries } from './getProjectDiscoveries'

export interface CodePathResult {
  entryName: string | undefined
  codePaths: { name: string; path: string }[]
}

export function getCodePaths(
  configReader: ConfigReader,
  project: string,
  address: ChainSpecificAddress,
): CodePathResult {
  const discoveries = getProjectDiscoveries(configReader, project)

  for (const discovery of discoveries) {
    const entry = discovery.entries.find((x) => x.address === address)

    if (!entry || entry.type === 'Reference') {
      continue
    }

    const similar = discovery.entries.filter(
      (x) => x.name === entry.name && x.type !== 'Reference',
    )
    const hasImplementations = get$Implementations(entry.values).length > 0

    const name =
      similar.length > 1 ? `${entry.name}-${entry.address}` : `${entry.name}`
    const root = join(configReader.getProjectPath(discovery.name), '.flat')

    if (!hasImplementations) {
      return {
        entryName: entry.name,
        codePaths: [
          { name: `${entry.name}.sol`, path: join(root, name + '.sol') },
        ],
      }
    }

    const codePaths = listFilesRecursively(join(root, name)).sort((a, b) =>
      compareFiles(a.name, b.name),
    )

    return {
      entryName: entry.name,
      codePaths,
    }
  }

  return { entryName: undefined, codePaths: [] }
}

function listFilesRecursively(
  directory: string,
  prefix = '',
): { name: string; path: string }[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      return listFilesRecursively(path, name)
    }

    if (!entry.isFile()) {
      return []
    }

    return { name, path }
  })
}

export function compareFiles(a: string, b: string) {
  return fileNameToOrder(a) - fileNameToOrder(b)
}

function fileNameToOrder(name: string) {
  // Flattened implementation files are named Contract.p.sol for the proxy,
  // Contract.1.sol, Contract.2.sol, ... for implementations, or Contract.sol.
  const pathParts = name.split('/')
  const fileName = pathParts[pathParts.length - 1]
  const fileNameParts = fileName?.split('.')
  if (
    fileNameParts === undefined ||
    fileNameParts[fileNameParts.length - 1] !== 'sol'
  ) {
    return 1
  }

  const ending =
    fileNameParts.length >= 3
      ? fileNameParts[fileNameParts.length - 2]
      : undefined
  if (ending === 'p') {
    return 0
  }
  if (ending !== undefined && isIntegerString(ending)) {
    return Number.parseInt(ending)
  }
  return ending === undefined ? 1 : 2
}

function isIntegerString(value: string) {
  if (value.length === 0) {
    return false
  }

  return value.split('').every((char) => char >= '0' && char <= '9')
}
