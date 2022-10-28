import { common } from './common'

export function getLocalConfig() {
  return {
    ...common,
    features: {
      ...common.features,
      highlightUnverified: true,
    },
    backend: {
      apiUrl: 'http://localhost:3000',
      skipCache: true,
    },
  }
}
