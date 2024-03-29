import { common } from './common'
import { Config } from './Config'

export function getProductionConfig(): Config {
  return {
    ...common,
    features: {
      ...common.features,
    },
    backend: {
      apiUrl: 'https://api.l2beat.com',
      updateMonitorApiUrl: 'https://staging.l2beat.com',
      skipCache: false,
    },
  }
}
