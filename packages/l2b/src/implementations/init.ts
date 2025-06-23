import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { getDiscoveryPaths, toPrettyJson } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export async function initDiscovery(
  project: string,
  chain: string,
  initalAddresses: EthereumAddress[],
) {
  const paths = getDiscoveryPaths()
  const projectPath = path.join(paths.discovery, project)
  mkdirSync(projectPath, { recursive: true })

  const configPath = path.join(projectPath, 'config.jsonc')
  await createEmptyConfig(configPath, project, chain, initalAddresses)
}

async function createEmptyConfig(
  path: string,
  project: string,
  chain: string,
  initialAddresses: EthereumAddress[],
) {
  const config = {
    $schema: '../../../../discovery/schemas/config.v2.schema.json',
    name: project,
    import: ['../globalConfig.jsonc'],
    chains: {
      [chain]: { initialAddresses },
    },
  }

  const content = await toPrettyJson(config)
  writeFileSync(path, `${content}\n`)
}
