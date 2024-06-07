import { Config } from './Config'
import { common } from './common'

export function getLocalConfig(): Config {
  const useMock = process.env.MOCK === 'true'
  if (useMock) {
    console.log('Using mock data for build')
  }

  return {
    ...common,
    features: {
      ...common.features,
      // The local backend doesn't support activity
      activity: useMock,
      liveness: useMock,
      finality: useMock,
      buildAllProjectPages: true,
    },
    backend: {
      apiUrl: 'http://localhost:3000',
      skipCache: true,
      mock: useMock,
    },
  }
}
