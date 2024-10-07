export { discover } from './cli/discoverCommand'
export { getChainConfig } from './config/config.discovery'
export type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from './config/types'
export { getDiscoveryEngine } from './discovery/getDiscoveryEngine'
export { AddressAnalyzer } from './discovery/analysis/AddressAnalyzer'
export { TemplateService } from './discovery/analysis/TemplateService'
export { ConfigReader } from './discovery/config/ConfigReader'
export { DiscoveryConfig } from './discovery/config/DiscoveryConfig'
export { RawDiscoveryConfig } from './discovery/config/RawDiscoveryConfig'
export { DiscoveryLogger } from './discovery/DiscoveryLogger'
export { getContractField } from './discovery/utils/metaGetters'
export {
  DISCOVERY_LOGIC_VERSION,
  DiscoveryEngine,
} from './discovery/engine/DiscoveryEngine'
export { flattenDiscoveredSources } from './discovery/output/flattenDiscoveredSource'
export { HandlerExecutor } from './discovery/handlers/HandlerExecutor'
export { diffContracts, type FieldDiff } from './discovery/output/diffContracts'
export {
  diffDiscovery,
  type DiscoveryDiff,
} from './discovery/output/diffDiscovery'
export {
  contractDiffToMarkdown,
  discoveryDiffToMarkdown,
} from './discovery/output/diffToMarkdown'
export { toDiscoveryOutput } from './discovery/output/toDiscoveryOutput'
export { MulticallClient } from './discovery/provider/multicall/MulticallClient'
export { getMulticall3Config } from './discovery/provider/multicall/MulticallConfig'
export type { MulticallConfig } from './discovery/provider/multicall/types'
export { RateLimitedProvider } from './discovery/provider/RateLimitedProvider'
export { ProxyDetector } from './discovery/proxies/ProxyDetector'
export { deduplicateAbi } from './discovery/source/deduplicateAbi'
export { SourceCodeService } from './discovery/source/SourceCodeService'
export { normalizeDiffPath } from './discovery/utils/normalizeDiffPath'
export { sortBySeverity } from './discovery/utils/sortDiffs'
export type { HashedChunks, HashedFileContent } from './flatten/utils'
export { type DiscoveryCache } from './discovery/provider/ReorgAwareCache'
export { SQLiteCache } from './discovery/provider/SQLiteCache'
export { NoCache } from './discovery/provider/NoCache'
export {
  buildSimilarityHashmap,
  estimateSimilarity,
  removeComments,
} from './flatten/utils'
export {
  calculateInversion,
  type InvertedAddressDetails,
  type InvertedAddresses,
  type Role,
} from './inversion/runInversion'
export { EtherscanClient } from './utils/EtherscanClient'
export { getErrorMessage } from './utils/getErrorMessage'
export { HttpClient } from './utils/HttpClient'
export { AllProviders } from './discovery/provider/AllProviders'
export type { IProvider } from './discovery/provider/IProvider'
export { ParsedFilesManager } from './flatten/ParsedFilesManager'
export { flattenStartingFrom } from './flatten/flatten'
export { format } from './flatten/format'
