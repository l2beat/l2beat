import { common } from './common'
import { Config } from './Config'

export function getProductionConfig(): Config {
  return {
    ...common,
    features: {
      ...common.features,
      detailedTvl: true,
    },
    backend: {
      apiUrl: 'https://api.l2beat.com',
      skipCache: false,
    },
  }
}
