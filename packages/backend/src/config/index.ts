import { Env, getEnv } from '@l2beat/backend-tools'

import { Config } from './Config'
import { getLocalConfig } from './config.local'
import { getProductionConfig } from './config.production'
import { getStagingConfig } from './config.staging'

export type { Config }

export function getConfig(): Config {
  const env = getEnv()
  const deploymentEnv = getDeploymentEnv(env)
  console.log('Loading config for:', deploymentEnv)

  switch (deploymentEnv) {
    case 'local':
      return getLocalConfig(env)
    case 'staging':
      return getStagingConfig(env)
    case 'production':
      return getProductionConfig(env)
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}

function getDeploymentEnv(env: Env) {
  return (
    env.optionalString('DEPLOYMENT_ENV') ??
    (env.optionalString('NODE_ENV') === 'production' ? 'production' : 'local')
  )
}
