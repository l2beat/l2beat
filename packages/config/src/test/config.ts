import { getEnv } from '@l2beat/backend-tools'

// Github actions sets env as an empty string when secret is not set
// this resulted in a bug on the outside contributors PRs
// workaround: getting and optional string and then doing OR (||)
// eslint is disabled because nullish coalescing (??) will not give expected result

interface Config {
  alchemyApiKey?: string
  coingeckoApiKey?: string
}

export const config: Config = {
  alchemyApiKey:
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    getEnv().optionalString('CONFIG_ALCHEMY_API_KEY') ||
    'mlGD422scpwVOpn3lye_swHEebbKQy0D',

  coingeckoApiKey:
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    getEnv().optionalString('COINGECKO_API_KEY') || undefined,
}
