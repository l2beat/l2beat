import { common } from './common'
import { Config } from './Config'

export function getLocalConfig(): Config {
  return {
    ...common,
    features: {
      ...common.features,
      // The local backend doesn't support activity
      activity: false,
      detailedTvl: false,
      buildAllProjectPages: true,
    },
    backend: {
      apiUrl: 'http://localhost:3000',
      skipCache: true,
    },
  }
}
