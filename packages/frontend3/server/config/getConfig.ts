import { getEnv } from '@l2beat/backend-tools'

import { Config } from './Config'
import { makeConfig } from './makeConfig'

export function getConfig(): Config {
  const env = getEnv()
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'
  console.log('Loading config for:', deploymentEnv)

  switch (deploymentEnv) {
    case 'local':
      return makeConfig(env, { name: 'Frontend/Local', isLocal: true })
    case 'staging':
      return makeConfig(env, { name: 'Frontend/Staging' })
    case 'production':
      return makeConfig(env, { name: 'Frontend/Production' })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}
