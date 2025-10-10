import { getEnv } from '@l2beat/backend-tools'
import type { Config } from './Config'
import { makeConfig } from './makeConfig'

export const config = getConfig()

function getConfig(): Config {
  const env = getEnv()
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'

  switch (deploymentEnv) {
    case 'local':
      return makeConfig(env, {
        name: 'tokens/Local',
        isLocal: true,
      })
    case 'staging':
      return makeConfig(env, { name: 'tokens/STG' })
    case 'production':
      return makeConfig(env, { name: 'tokens/PROD' })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}
