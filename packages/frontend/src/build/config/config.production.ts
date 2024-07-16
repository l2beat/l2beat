import { Config } from './Config'
import { common } from './common'

export function getProductionConfig(): Config {
  return {
    ...common,
    backend: {
      apiUrl: 'https://api.l2beat.com',
      skipCache: true,
    },
  }
}
