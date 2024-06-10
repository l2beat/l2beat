import { Config } from './Config'
import { common } from './common'

export function getStagingConfig(): Config {
  return {
    ...common,
    features: {
      ...common.features,
      buildAllProjectPages: true,
    },
    backend: {
      apiUrl: 'https://staging.l2beat.com',
      skipCache: false,
    },
  }
}
