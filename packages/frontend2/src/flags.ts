import { env } from './env'

// NOTE: We keep them async to make it easier to add dynamic flags in the future.
export const showAssetRisks = async () => env.FEATURE_FLAG_ASSET_RISKS

export const showZkCatalog = async () => env.FEATURE_FLAG_ZK_CATALOG
