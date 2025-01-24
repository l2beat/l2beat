import type {
  EthereumAddress,
  Sentiment,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
  WarningValueWithSentiment,
} from '@l2beat/shared-pure'
import type {
  ScalingProject,
  ScalingProjectConfig,
  ScalingProjectDisplay,
} from '../../../common'

export interface Layer2 extends ScalingProject {
  type: 'layer2'
  display: Layer2Display
  config: Layer2Config
  /** Upgrades and governance explained */
  upgradesAndGovernance?: string
}

export interface Layer2Display extends ScalingProjectDisplay {
  /** Tooltip contents for liveness tab for given project */
  liveness?: ProjectLivenessInfo
  finality?: Layer2FinalityDisplay
  /** Warning for Costs */
  costsWarning?: WarningWithSentiment
}

export interface ProjectLivenessInfo {
  explanation?: string
  warnings?: {
    stateUpdates?: string
    batchSubmissions?: string
    proofSubmissions?: string
  }
}

export interface Layer2FinalityDisplay {
  /** Warning tooltip content for finality tab for given project */
  warnings?: {
    timeToInclusion?: WarningValueWithSentiment
    stateUpdateDelay?: WarningValueWithSentiment
  }
  /** Finalization period displayed in table for given project (time in seconds) */
  finalizationPeriod?: number
}

export interface Layer2Config extends ScalingProjectConfig {
  /** List of transactions that are tracked by our backend */
  trackedTxs?: Layer2TxConfig[]
  /** Configuration for getting liveness data */
  liveness?: Layer2LivenessConfig
  /** Configuration for getting finality data */
  finality?: Layer2FinalityConfig
}

export interface WarningWithSentiment {
  /** Content of the warning */
  content: string
  /** Color with which the warning should be displayed */
  sentiment: Extract<Sentiment, 'bad' | 'warning' | 'neutral'>
}

export type Layer2TxConfig = {
  uses: Layer2TrackedTxUse[]
  query: TrackedTxQuery
  _hackCostMultiplier?: number
}

export type Layer2TrackedTxUse = {
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
}

type TrackedTxQuery = FunctionCall | Transfer | SharpSubmission | SharedBridge

interface FunctionCall {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface Transfer {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharpSubmission {
  formula: 'sharpSubmission'
  programHashes: string[]
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

interface SharedBridge {
  formula: 'sharedBridge'
  chainId: number
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  /** Inclusive */
  sinceTimestamp: UnixTime
  /** Inclusive */
  untilTimestamp?: UnixTime
}

export interface Layer2LivenessConfig {
  duplicateData: {
    from: TrackedTxsConfigSubtype
    to: TrackedTxsConfigSubtype
  }
}

/**
 * Determines how the state update should be handled.
 * - `analyze`: The state update delay should be analyzed as a part of the update.
 * - `zeroed`: The state update delay should be zeroed, analyzer will not be run.
 * - `disabled`: The state update analyzer will not be run.
 */
export type StateUpdateMode = 'analyze' | 'zeroed' | 'disabled'

export type Layer2FinalityConfig =
  // We require the minTimestamp to be set for all types that will be processed in FinalityIndexer
  | {
      type:
        | 'Linea'
        | 'zkSyncEra'
        | 'Scroll'
        | 'zkSyncLite'
        | 'Starknet'
        | 'Arbitrum'
        | 'Loopring'
        | 'Degate'
        | 'PolygonZkEvm'

      minTimestamp: UnixTime
      lag: number
      stateUpdate: StateUpdateMode
    }
  | {
      type: 'OPStack'
      minTimestamp: UnixTime
      lag: number
      // https://specs.optimism.io/protocol/holocene/derivation.html#span-batches
      // you can get this values by calling the RPC method optimism_rollupConfig
      // rollup config: curl -X POST -H "Content-Type: application/json" --data \
      // '{"jsonrpc":"2.0","method":"optimism_rollupConfig","params":[],"id":1}'  \
      // <rpc-url> | jq
      genesisTimestamp: UnixTime
      l2BlockTimeSeconds: number
      stateUpdate: StateUpdateMode
    }

export type FinalityType = Layer2FinalityConfig['type']
