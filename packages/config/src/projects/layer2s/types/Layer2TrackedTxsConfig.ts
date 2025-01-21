import type {
  EthereumAddress,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'

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
