export { DiscoverCommandArgs, discover } from './cli/discoverCommand.js'
export { modelPermissionsCommand } from './cli/modelPermissionsCommand.js'
export {
  getChainConfig,
  getChainConfigs,
  getChainFullName,
  getChainShortName,
  isChainShortName,
} from './config/config.discovery.js'
export type {
  DiscoveryChainConfig,
  DiscoveryModuleConfig,
} from './config/types.js'
export {
  AddressAnalyzer,
  type Analysis,
} from './discovery/analysis/AddressAnalyzer.js'
export { codeIsEOA } from './discovery/analysis/codeIsEOA.js'
export { getShapeFromOutputEntry } from './discovery/analysis/findShape.js'
export { TemplateService } from './discovery/analysis/TemplateService.js'
export { colorize } from './discovery/colorize/colorize.js'
export type { ColorContract } from './discovery/config/ColorConfig.js'
export { ConfigReader } from './discovery/config/ConfigReader.js'
export { ConfigRegistry } from './discovery/config/ConfigRegistry.js'
export type { DiscoveryConfig } from './discovery/config/ConfigSchema.js'
export { ConfigWriter } from './discovery/config/ConfigWriter.js'
export { makeEntryColorConfig } from './discovery/config/colorUtils.js'
export {
  type DiscoveryPaths,
  getDiscoveryPaths,
} from './discovery/config/getDiscoveryPaths.js'
export { hashJsonStable } from './discovery/config/hashJsonStable.js'
export {
  BasePermissionEntries,
  Permission,
  RolePermissionEntries,
} from './discovery/config/PermissionConfig.js'
export { ShapeSchema } from './discovery/config/ShapeSchema.js'
export {
  makeEntryStructureConfig,
  type StructureContractConfig as ContractConfig,
} from './discovery/config/structureUtils.js'
export {
  type DiscoveryCounter,
  SimpleDiscoveryCounter,
} from './discovery/engine/DiscoveryCounter.js'
export { DiscoveryEngine } from './discovery/engine/DiscoveryEngine.js'
export { getDiscoveryEngine } from './discovery/getDiscoveryEngine.js'
export { HandlerExecutor } from './discovery/handlers/HandlerExecutor.js'
export {
  type ClingoFact,
  type ClingoValue,
} from './discovery/modelling/clingoparser.js'
export { combinePermissionsIntoDiscovery } from './discovery/modelling/combinePermissionsIntoDiscovery.js'
export { KnowledgeBase } from './discovery/modelling/KnowledgeBase.js'
export { ModelIdRegistry } from './discovery/modelling/ModelIdRegistry.js'
export {
  DiscoveryRegistry,
  type DiscoveryTimestamps as DiscoveryBlockNumbers,
  generateClingoForDiscoveries,
  generatePermissionConfigHash,
  getDependenciesToDiscoverForProject,
  modelPermissions,
} from './discovery/modelling/modelPermissions.js'
export {
  diffContracts,
  type FieldDiff,
} from './discovery/output/diffContracts.js'
export {
  type DiscoveryDiff,
  diffDiscovery,
} from './discovery/output/diffDiscovery.js'
export {
  contractDiffToMarkdown,
  discoveryDiffToMarkdown,
} from './discovery/output/diffToMarkdown.js'
export { neuterErrors } from './discovery/output/errors.js'
export { flattenDiscoveredSources } from './discovery/output/flattenDiscoveredSource.js'
export { saveDiscoveredJson } from './discovery/output/saveDiscoveryResult.js'
export { generateStructureHash } from './discovery/output/structureOutput.js'
export {
  combineStructureAndColor,
  toDiscoveryOutput,
  toRawDiscoveryOutput,
} from './discovery/output/toDiscoveryOutput.js'
export type {
  ContractValue,
  DiscoveryOutput,
  EntryParameters,
  ReceivedPermission,
  ResolvedPermissionPath,
} from './discovery/output/types.js'
export { AllProviders } from './discovery/provider/AllProviders.js'
export {
  type DebugTransactionCall,
  type DebugTransactionCallResponse,
} from './discovery/provider/DebugTransactionTrace.js'
export { type DiscoveryCache } from './discovery/provider/DiscoveryCache.js'
export { InMemoryCache } from './discovery/provider/InMemoryCache.js'
export { type IProvider } from './discovery/provider/IProvider.js'
export { LeveledCache } from './discovery/provider/LeveledCache.js'
export { MulticallClient } from './discovery/provider/multicall/MulticallClient.js'
export { getMulticall3Config } from './discovery/provider/multicall/MulticallConfig.js'
export type { MulticallConfig } from './discovery/provider/multicall/types.js'
export { NoCache } from './discovery/provider/NoCache.js'
export { RateLimitedProvider } from './discovery/provider/RateLimitedProvider.js'
export { SQLiteCache } from './discovery/provider/SQLiteCache.js'
export {
  type AllProviderStats,
  ProviderMeasurement,
  ProviderStats,
} from './discovery/provider/Stats.js'
export { ProxyDetector } from './discovery/proxies/ProxyDetector.js'
export {
  generateEntrypoints,
  generateEntrypointsCommand,
} from './discovery/shared-modules/generateEntrypoints.js'
export { deduplicateAbi } from './discovery/source/deduplicateAbi.js'
export { SourceCodeService } from './discovery/source/SourceCodeService.js'
export { asStructured } from './discovery/type-casters/asStructured.js'
export { get$Implementations } from './discovery/utils/extractors.js'
export { getContractField } from './discovery/utils/metaGetters.js'
export { normalizeDiffPath } from './discovery/utils/normalizeDiffPath.js'
export { getReachableEntries } from './discovery/utils/reachable.js'
export { readJsonc } from './discovery/utils/readJsonc.js'
export { sortBySeverity } from './discovery/utils/sortDiffs.js'
export { flattenStartingFrom } from './flatten/flatten.js'
export { format } from './flatten/format.js'
export { ParsedFilesManager } from './flatten/ParsedFilesManager.js'
export type { HashedChunks, HashedFileContent } from './flatten/utils.js'
export {
  buildSimilarityHashmap,
  combineImplementationHashes,
  contractFlatteningHash,
  estimateSimilarity,
  flatteningHash,
  getHashToBeMatched,
} from './flatten/utils.js'
export {
  type ContractConfigSchema,
  type DiscoveryConfigSchema,
} from './schemas/schemas.js'
export { EtherscanClient } from './utils/EtherscanClient.js'
export { getErrorMessage } from './utils/getErrorMessage.js'
export {
  type ContractSource,
  type ExplorerConfig,
  getExplorerClient,
  type IEtherscanClient,
} from './utils/IEtherscanClient.js'
