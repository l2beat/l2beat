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
      apiUrl: 'https://api-staging.eltwobeat.com',
      skipCache: false,
    },
  }
}
