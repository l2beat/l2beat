import type { Env } from '@l2beat/backend-tools'
import type { Config } from './Config'
import { makeConfig } from './makeConfig'

export function getConfig(env: Env): Config {
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'

  switch (deploymentEnv) {
    case 'local':
      return makeConfig(env, {
        name: 'API-Local',
        isLocal: true,
      })
    case 'staging':
      return makeConfig(env, { name: 'API-STG' })
    case 'production':
      return makeConfig(env, { name: 'API-PROD' })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}
