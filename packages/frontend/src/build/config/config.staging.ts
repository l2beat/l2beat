import { common } from './common'

export function getStagingConfig() {
  return {
    ...common,
    features: {
      ...common.features,
      bridges: true,
      activity: true,
    },
    backend: {
      apiUrl: 'https://l2beat-activity.herokuapp.com',
      skipCache: false,
    },
  }
}
