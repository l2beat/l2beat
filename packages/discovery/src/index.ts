export { AddressAnalyzer } from './discovery/analysis/AddressAnalyzer'
export { ConfigReader } from './discovery/config/ConfigReader'
export { DiscoveryConfig } from './discovery/config/DiscoveryConfig'
export { DiscoveryLogger } from './discovery/DiscoveryLogger'
export {
  DISCOVERY_LOGIC_VERSION,
  DiscoveryEngine,
} from './discovery/engine/DiscoveryEngine'
export { HandlerExecutor } from './discovery/handlers/HandlerExecutor'
export { diffContracts, type FieldDiff } from './discovery/output/diffContracts'
export {
  diffDiscovery,
  type DiscoveryDiff,
} from './discovery/output/diffDiscovery'
export { toDiscoveryOutput } from './discovery/output/toDiscoveryOutput'
export { DiscoveryProvider } from './discovery/provider/DiscoveryProvider'
export type { DiscoveryCache } from './discovery/provider/ProviderWithCache'
export { ProxyDetector } from './discovery/proxies/ProxyDetector'
export { deduplicateAbi } from './discovery/source/deduplicateAbi'
export { SourceCodeService } from './discovery/source/SourceCodeService'
export { EtherscanLikeClient } from './utils/EtherscanLikeClient'
export { HttpClient } from './utils/HttpClient'
