import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { getEnv } from './getEnv'

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
      useMermaidMarkup: false,
    },
    discovery: discoveryEnabled && {
      project: cli.project,
      blockNumber: getEnv.optionalInteger('DISCOVERY_BLOCK_NUMBER'),
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
      dryRun: cli.dryRun,
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
  readonly dryRun?: true
}

export interface InversionConfig {
  readonly file: string
  readonly useMermaidMarkup: boolean
}
