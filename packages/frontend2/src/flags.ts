import { env } from './env'

// NOTE: We keep them async to make it easier to add dynamic flags in the future.
export const showAssetRisks = async () => env.FEATURE_FLAG_ASSET_RISKS

export const showHiringBadge = async () => env.FEATURE_FLAG_HIRING

export const showZkCatalog = async () => env.FEATURE_FLAG_ZK_CATALOG

export const showGitcoinOption = async () => env.FEATURE_FLAG_GITCOIN_OPTION
