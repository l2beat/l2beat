import { getEnv } from '@l2beat/backend-tools'

interface Config {
  alchemyApiKey?: string
}

export const config: Config = {
  alchemyApiKey:
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    getEnv().string(
      'CONFIG_ALCHEMY_API_KEY',
      'RHadMy3sqeQwwTFRakv1Ln8xelYFct0t',
    ),
}
