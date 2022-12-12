import { common } from './common'
import { Config } from './Config'

export function getLocalConfig(): Config {
  return {
    ...common,
    features: {
      ...common.features,
      milestones: true,
      // The local backend doesn't suport activity
      activity: false,
    },
    backend: {
      apiUrl: 'http://localhost:3000',
      skipCache: true,
    },
  }
}
