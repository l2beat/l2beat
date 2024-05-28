import { unstable_flag as flag } from '@vercel/flags/next'
import { env } from './env'

export const showActivityPage = flag({
  key: 'activity',
  decide: () => env.FEATURE_FLAG_ACTIVITY,
})

export const showAssetRisks = flag({
  key: 'asset-risks',
  decide: () => env.FEATURE_FLAG_ASSET_RISKS,
})

export const showCostsPage = flag({
  key: 'costs',
  decide: () => env.FEATURE_FLAG_COSTS,
})

export const showFinalityPage = flag({
  key: 'finality',
  decide: () => env.FEATURE_FLAG_FINALITY,
})

export const showGlossary = flag({
  key: 'glossary',
  decide: () => env.FEATURE_FLAG_GLOSSARY,
})

export const showGovernancePage = flag({
  key: 'governance',
  decide: () => env.FEATURE_FLAG_GOVERNANCE,
})

export const showHiringBadge = flag({
  key: 'hiring',
  decide: () => env.FEATURE_FLAG_HIRING,
})

export const showLivenessPage = flag({
  key: 'liveness',
  decide: () => env.FEATURE_FLAG_LIVENESS,
})

export const showZkCatalog = flag({
  key: 'zk-catalog',
  decide: () => env.FEATURE_FLAG_ZK_CATALOG,
})

export const showGitcoinOption = flag({
  key: 'gitcoin-option',
  decide: () => env.FEATURE_FLAG_GITCOIN_OPTION,
})
