import { CliParameters } from '../cli/getCliParameters'
import { LogLevel } from '../tools/Logger'
import { Config } from './Config'
import { getEnv } from './getEnv'
import { getGitCommitHash } from './getGitCommitHash'

export function getProductionConfig(cli: CliParameters): Config {
  if (cli.mode !== 'server') {
    throw new Error(`No production config for mode: ${cli.mode}`)
  }

  return {
    name: 'Backend/Production',
    logger: {
      logLevel: getEnv.integer('LOG_LEVEL', LogLevel.INFO),
      format: 'json',
    },
    api: {
      port: getEnv.integer('PORT'),
    },
    health: {
      releasedAt: getEnv('HEROKU_RELEASE_CREATED_AT', ''),
      startedAt: new Date().toISOString(),
      commitSha: getEnv('HEROKU_SLUG_COMMIT', getGitCommitHash()),
    },
    metricsAuth: {
      user: getEnv('METRICS_AUTH_USER'),
      pass: getEnv('METRICS_AUTH_PASS'),
    },
    discovery: false,
    discoveryApi: {
      alchemyApiKey: getEnv('ALCHEMY_API_KEY'),
      etherscanApiKey: getEnv('ETHERSCAN_API_KEY'),
    },
  }
}
