import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { ConfigReader } from '@l2beat/discovery'
import { get$Implementations } from '@l2beat/discovery-types'
import { getChainFullName } from '@l2beat/discovery/dist/config/config.discovery'
import { ApiCodeResponse } from './types'

export function getCode(
  configReader: ConfigReader,
  project: string,
  address: string,
): ApiCodeResponse {
  const [chainShortName, simpleAddress] = address.split(':')
  const chain = getChainFullName(chainShortName)
  const discovery = configReader.readDiscovery(project, chain)
  const contract = discovery.contracts.find((x) => x.address === simpleAddress)
  if (!contract) {
    return { sources: [] }
  }

  const similar = discovery.contracts.filter((x) => x.name === contract.name)
  const hasImplementations = get$Implementations(contract.values).length > 0

  const name =
    similar.length > 1
      ? `${contract.name}-${contract.address}`
      : `${contract.name}`
  const root = join(configReader.rootPath, 'discovery', project, chain, '.flat')

  if (!hasImplementations) {
    const source = readFileSync(join(root, name + '.sol'), 'utf-8')
    return { sources: [{ name: `${contract.name}.sol`, code: source }] }
  } else {
    const dir = readdirSync(join(root, name))
    return {
      sources: dir
        .map((file) => ({
          name: file,
          code: readFileSync(join(root, name, file), 'utf-8'),
        }))
        .sort((a, b) => compareFiles(a.name, b.name)),
    }
  }
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
