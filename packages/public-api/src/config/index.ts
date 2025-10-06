import { getEnv } from '@l2beat/backend-tools'
import type { Config } from './Config'
import { makeConfig } from './makeConfig'

export function getConfig(): Config {
  const env = getEnv()
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'

  switch (deploymentEnv) {
    case 'local':
      return makeConfig(env, {
        name: 'Backend/Local',
        isLocal: true,
      })
    case 'staging':
      return makeConfig(env, { name: 'API-STG' })
    case 'production':
      return makeConfig(env, { name: 'API-PROD' })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}
