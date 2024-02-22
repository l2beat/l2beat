import { common } from './common'
import { Config } from './Config'

export function getLocalConfig(): Config {
  const useMock = process.env.MOCK === 'true'
  return {
    ...common,
    features: {
      ...common.features,
      // The local backend doesn't support activity
      activity: useMock,
      liveness: useMock,
      finality: useMock,
      diffHistory: false,
      tvlBreakdown: false,
      buildAllProjectPages: true,
    },
    backend: {
      apiUrl: 'http://localhost:3000',
      skipCache: true,
      mock: useMock,
    },
  }
}
