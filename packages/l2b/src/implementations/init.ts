import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { type RawDiscoveryConfig, getDiscoveryPaths } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export function initDiscovery(
  project: string,
  chain: string,
  initalAddresses: EthereumAddress[],
) {
  const paths = getDiscoveryPaths()
  const projectPath = path.join(paths.discovery, project, chain)
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
