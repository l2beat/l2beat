import { common } from './common'

export function getProductionConfig() {
  return {
    ...common,
    backend: {
      apiUrl: 'https://api.l2beat.com',
      skipCache: false,
    },
  }
}
