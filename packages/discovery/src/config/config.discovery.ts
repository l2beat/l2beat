import { getEnv } from '@l2beat/shared'
import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'

export function getDiscoveryCliConfig(cli: CliParameters): DiscoveryCliConfig {
  dotenv()
  if (cli.mode !== 'invert' && cli.mode !== 'discover') {
    throw new Error(`No local config for mode: ${cli.mode}`)
  }

  const discoveryEnabled = cli.mode === 'discover'
  const invertEnabled = cli.mode === 'invert'

  return {
    invert: invertEnabled && {
      file: cli.file,
      useMermaidMarkup: cli.useMermaidMarkup,
    },
    discovery: discoveryEnabled && {
      project: cli.project,
      blockNumber: getEnv.optionalInteger('DISCOVERY_BLOCK_NUMBER'),
      alchemyApiKey: getEnv('ETHEREUM_ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      dryRun: cli.dryRun,
      dev: cli.dev,
    },
  }
}

export interface DiscoveryCliConfig {
  discovery: DiscoveryModuleConfig | false
  invert: InversionConfig | false
}

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly blockNumber?: number
  readonly alchemyApiKey: string
  readonly etherscanApiKey: string
  readonly dryRun?: boolean
  readonly dev?: boolean
}

export interface InversionConfig {
  readonly file: string
  readonly useMermaidMarkup: boolean
}
