import { common } from './common'

export function getStagingConfig() {
  return {
    ...common,
    features: {
      ...common.features,
    },
    backend: {
      apiUrl: 'https://staging.l2beat.com',
      skipCache: false,
    },
  }
}
