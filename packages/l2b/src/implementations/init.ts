import { existsSync, mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { getDiscoveryPaths, readJsonc, toPrettyJson } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

interface ConfigSkeleton {
  chains?: Record<string, object>
  import?: string[]
}

export async function initDiscovery(
  project: string,
  chain: string,
  initalAddresses: EthereumAddress[],
) {
  const paths = getDiscoveryPaths()
  const projectPath = path.join(paths.discovery, project)
  mkdirSync(projectPath, { recursive: true })

  let existingConfig: ConfigSkeleton = {}
  const configPath = path.join(projectPath, 'config.jsonc')
  if (existsSync(configPath)) {
    existingConfig = readJsonc(configPath) as ConfigSkeleton
  }

  const config = createEmptyConfig(
    existingConfig,
    project,
    chain,
    initalAddresses,
  )

  const content = await toPrettyJson(config)
  writeFileSync(configPath, content)
}

function createEmptyConfig(
  existingConfig: ConfigSkeleton,
  project: string,
  chain: string,
  initialAddresses: EthereumAddress[],
) {
  const chains = {
    ...(existingConfig.chains ?? {}),
    [chain]: { initialAddresses },
  }

  const config = {
    $schema: '../../../../discovery/schemas/config.v2.schema.json',
    name: project,
    import: existingConfig.import ?? ['../globalConfig.jsonc'],
    chains,
  }

  return config
}
