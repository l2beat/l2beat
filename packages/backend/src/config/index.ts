import { getEnv } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import type { Config } from './Config'
import { makeConfig } from './makeConfig'

export type { Config }

export function getConfig(): Promise<Config> {
  const env = getEnv()
  const deploymentEnv = env.optionalString('DEPLOYMENT_ENV') ?? 'local'
  console.log('Loading config for:', deploymentEnv)

  switch (deploymentEnv) {
    case 'local':
      return makeConfig(env, {
        name: 'Backend/Local',
        deploymentEnv: 'local',
        isLocal: true,
        minTimestampOverride: env.optionalBoolean('NO_TIMESTAMP_OVERRIDE')
          ? undefined
          : UnixTime.toStartOf(UnixTime.now() - 7 * UnixTime.DAY, 'hour'),
      })
    case 'staging':
      return makeConfig(env, {
        name: 'Backend/Staging',
        deploymentEnv: 'staging',
      })
    case 'production':
      return makeConfig(env, {
        name: 'Backend/Production',
        deploymentEnv: 'production',
      })
  }

  throw new TypeError(`Unrecognized env: ${deploymentEnv}!`)
}
