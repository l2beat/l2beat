export { DiscoverCommandArgs, discover } from './cli/discoverCommand'
export { modelPermissionsCommand } from './cli/modelPermissionsCommand'
export {
  getChainConfig,
  getChainConfigs,
  getChainFullName,
  getChainShortName,
  isChainShortName,
} from './config/config.discovery'
export type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from './config/types'
export {
  AddressAnalyzer,
  type Analysis,
} from './discovery/analysis/AddressAnalyzer'
export { codeIsEOA } from './discovery/analysis/codeIsEOA'
export { getShapeFromOutputEntry } from './discovery/analysis/findShape'
export { TemplateService } from './discovery/analysis/TemplateService'
export { colorize } from './discovery/colorize/colorize'
export { ConfigReader } from './discovery/config/ConfigReader'
export { ConfigRegistry } from './discovery/config/ConfigRegistry'
export type { DiscoveryConfig } from './discovery/config/ConfigSchema'
export { makeEntryColorConfig } from './discovery/config/colorUtils'
export {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from './discovery/config/getDiscoveryPaths'
export { hashJsonStable } from './discovery/config/hashJsonStable'
export {
  BasePermissionEntries,
  Permission,
  RolePermissionEntries,
} from './discovery/config/PermissionConfig'
export {
  makeEntryStructureConfig,
  type StructureContractConfig as ContractConfig,
} from './discovery/config/structureUtils'
export { DiscoveryEngine } from './discovery/engine/DiscoveryEngine'
export { getDiscoveryEngine } from './discovery/getDiscoveryEngine'
export { HandlerExecutor } from './discovery/handlers/HandlerExecutor'
export {
  type ClingoFact,
  type ClingoValue,
} from './discovery/modelling/clingoparser'
export { combinePermissionsIntoDiscovery } from './discovery/modelling/combinePermissionsIntoDiscovery'
export { KnowledgeBase } from './discovery/modelling/KnowledgeBase'
export { ModelIdRegistry } from './discovery/modelling/ModelIdRegistry'
export {
  DiscoveryRegistry,
  type DiscoveryTimestamps as DiscoveryBlockNumbers,
  generateClingoForDiscoveries,
  generatePermissionConfigHash,
  getDependenciesToDiscoverForProject,
  modelPermissions,
} from './discovery/modelling/modelPermissions'
export { diffContracts, type FieldDiff } from './discovery/output/diffContracts'
export {
  type DiscoveryDiff,
  diffDiscovery,
} from './discovery/output/diffDiscovery'
export {
  contractDiffToMarkdown,
  discoveryDiffToMarkdown,
} from './discovery/output/diffToMarkdown'
export { neuterErrors } from './discovery/output/errors'
export { flattenDiscoveredSources } from './discovery/output/flattenDiscoveredSource'
export { saveDiscoveredJson } from './discovery/output/saveDiscoveryResult'
export {
  combineStructureAndColor,
  toDiscoveryOutput,
  toRawDiscoveryOutput,
} from './discovery/output/toDiscoveryOutput'
export type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
  ReceivedPermission,
  ResolvedPermissionPath,
} from './discovery/output/types'
export { AllProviders } from './discovery/provider/AllProviders'
export { type DiscoveryCache } from './discovery/provider/DiscoveryCache'
export { InMemoryCache } from './discovery/provider/InMemoryCache'
export type { IProvider } from './discovery/provider/IProvider'
export { LeveledCache } from './discovery/provider/LeveledCache'
export { MulticallClient } from './discovery/provider/multicall/MulticallClient'
export { getMulticall3Config } from './discovery/provider/multicall/MulticallConfig'
export type { MulticallConfig } from './discovery/provider/multicall/types'
export { NoCache } from './discovery/provider/NoCache'
export { RateLimitedProvider } from './discovery/provider/RateLimitedProvider'
export { SQLiteCache } from './discovery/provider/SQLiteCache'
export {
  type AllProviderStats,
  ProviderMeasurement,
  ProviderStats,
} from './discovery/provider/Stats'
export { ProxyDetector } from './discovery/proxies/ProxyDetector'
export { deduplicateAbi } from './discovery/source/deduplicateAbi'
export { SourceCodeService } from './discovery/source/SourceCodeService'
export { get$Implementations } from './discovery/utils/extractors'
export { getContractField } from './discovery/utils/metaGetters'
export { normalizeDiffPath } from './discovery/utils/normalizeDiffPath'
export { readJsonc } from './discovery/utils/readJsonc'
export { sortBySeverity } from './discovery/utils/sortDiffs'
export { flattenStartingFrom } from './flatten/flatten'
export { format } from './flatten/format'
export { ParsedFilesManager } from './flatten/ParsedFilesManager'
export type { HashedChunks, HashedFileContent } from './flatten/utils'
export {
  buildSimilarityHashmap,
  combineImplementationHashes,
  estimateSimilarity,
  flatteningHash,
  getHashToBeMatched,
} from './flatten/utils'
export { EtherscanClient } from './utils/EtherscanClient'
export { getErrorMessage } from './utils/getErrorMessage'
export {
  type ExplorerConfig,
  getExplorerClient,
  type IEtherscanClient,
} from './utils/IEtherscanClient'
