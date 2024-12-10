import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { readConfig } from '../config/readConfig'
import path from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { RawDiscoveryConfig } from '@l2beat/discovery'

export function initDiscovery(
  project: string,
  chain: string,
  initalAddresses: EthereumAddress[],
) {
  const config = readConfig()
  assert(config.discoveryPath, '.l2b does not specify the discovery path')

  const projectPath = path.join(config.discoveryPath, project, chain)
  mkdirSync(projectPath, { recursive: true })

  const configPath = path.join(projectPath, 'config.jsonc')
  createEmptyConfig(configPath, project, chain, initalAddresses)
}

function createEmptyConfig(
  path: string,
  project: string,
  chain: string,
  initialAddresses: EthereumAddress[],
) {
  const config: RawDiscoveryConfig = {
    name: project,
    chain,
    initialAddresses,
  }

  const withSchema = {
    $schema: '../../../../discovery/schemas/config.v2.schema.json',
    ...config,
  }

  const content = JSON.stringify(withSchema, null, 2)
  writeFileSync(path, `${content}\n`)
}
