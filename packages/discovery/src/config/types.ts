import type { MulticallConfig } from '../discovery/provider/multicall/types'
import type { ExplorerConfig } from '../utils/IEtherscanClient'

export interface DiscoveryModuleConfig {
  readonly project: string
  readonly dryRun?: boolean
  readonly dev?: boolean
  readonly overwriteCache: boolean
  readonly printStats?: boolean
  readonly verboseTemplatization?: boolean
  readonly saveSources?: boolean
  readonly blockNumber?: number
  readonly timestamp?: number
  readonly sourcesFolder?: string
  readonly flatSourcesFolder?: string
  readonly discoveryFilename?: string
  readonly templateSimilarityCutoff?: number
  /** Author a template with a model for every contract no template matches. Local runs only. */
  readonly ai?: boolean
  /** `opencode/<model>` (Zen) or `opencode-go/<model>` (Go) for opencode, anything else is a Codex model; Codex's default when unset. */
  readonly aiModel?: string
  /** Model turns per contract, the first included. */
  readonly aiRounds?: number
  /** Reasoning effort: opencode's variant or Codex's `model_reasoning_effort`; `high` when unset. */
  readonly aiEffort?: string
  /** Implies `ai`: also let the model extend every template that already matches. */
  readonly aiRevisit?: boolean
}

export interface DiscoveryChainConfig {
  name: string
  chainId?: number
  rpcUrl: string
  eventRpcUrl?: string
  reorgSafeDepth?: number
  beaconApiUrl?: string
  coingeckoApiKey?: string
  celestiaApiUrl?: string
  multicall: MulticallConfig | undefined
  explorer: ExplorerConfig[]
}
