import { env } from './env'

// NOTE: We keep them async to make it easier to add dynamic flags in the future.
export const showActivityPage = async () => env.FEATURE_FLAG_ACTIVITY

export const showAssetRisks = async () => env.FEATURE_FLAG_ASSET_RISKS

export const showCostsPage = async () => env.FEATURE_FLAG_COSTS

export const showFinalityPage = async () => env.FEATURE_FLAG_FINALITY

export const showGlossary = async () => env.FEATURE_FLAG_GLOSSARY

export const showGovernancePage = async () => env.FEATURE_FLAG_GOVERNANCE

export const showHiringBadge = async () => env.FEATURE_FLAG_HIRING

export const showLivenessPage = async () => env.FEATURE_FLAG_LIVENESS

export const showZkCatalog = async () => env.FEATURE_FLAG_ZK_CATALOG

export const showGitcoinOption = async () => env.FEATURE_FLAG_GITCOIN_OPTION
