import { unstable_flag as flag } from '@vercel/flags/next'
import { env } from './env'

export const showAssetRisks = flag({
  key: 'asset-risks',
  decide: () => env.FEATURE_FLAG_ASSET_RISKS,
})

export const showGitcoinOption = flag({
  key: 'gitcoin-option',
  decide: () => env.FEATURE_FLAG_GITCOIN_OPTION,
})
