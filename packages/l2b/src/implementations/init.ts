import { getDiscoveryPaths, readJsonc } from '@l2beat/discovery'
import {
  ChainSpecificAddress,
  type EthereumAddress,
  formatJson,
  unique,
  withoutUndefinedKeys,
} from '@l2beat/shared-pure'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import mergeWith from 'lodash/mergeWith'
import path from 'path'

interface ConfigSkeleton {
  chains?: Record<string, object>
  import?: string[]
  archived?: boolean
}

export function initDiscovery(
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
    initalAddresses.map((a) => ChainSpecificAddress.fromLong(chain, a)),
  )

  const content = formatJson(config)
  writeFileSync(configPath, content)
}

function createEmptyConfig(
  existingConfig: ConfigSkeleton,
  project: string,
  initialAddresses: ChainSpecificAddress[],
) {
  const newConfig = {
    $schema: '../../../../discovery/schemas/config.v2.schema.json',
    name: project,
    import:
      existingConfig.import === undefined
        ? ['../globalConfig.jsonc']
        : undefined,
    archived: existingConfig.archived ?? undefined,
    initialAddresses,
  }

  return withoutUndefinedKeys(
    mergeWith({}, existingConfig, newConfig, (a, b) => {
      if (Array.isArray(a) && Array.isArray(b)) {
        return unique(a.concat(b), (a) => JSON.stringify(a))
      }
    }),
  )
}
