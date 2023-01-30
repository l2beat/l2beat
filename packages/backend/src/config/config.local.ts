import { config as dotenv } from 'dotenv'

import { CliParameters } from '../cli/getCliParameters'
import { LogLevel } from '../tools/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getLocalConfig(cli: CliParameters): Config {
  dotenv()
  if (cli.mode !== 'server' && cli.mode !== 'discover') {
    throw new Error(`No local config for mode: ${cli.mode}`)
  }

  const apiEnabled = cli.mode === 'server'
  const discoveryEnabled = cli.mode === 'discover'

  return {
    name: 'Backend/Local',
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'pretty',
    },
    api: apiEnabled && {
      port: getEnv.integer('PORT', 3000),
    },
    metricsAuth: false,
    health: {
      startedAt: new Date().toISOString(),
      commitSha: getGitCommitHash(),
    },
    discovery: discoveryEnabled && {
      project: cli.project,
      blockNumber: getEnv.optionalInteger('DISCOVERY_BLOCK_NUMBER'),
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    },
    discoveryApi: {
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    },
  }
}
