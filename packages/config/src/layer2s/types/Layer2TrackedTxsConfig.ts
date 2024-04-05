import {
  EthereumAddress,
  TrackedTxsConfigSubtype,
  TrackedTxsConfigType,
  UnixTime,
} from '@l2beat/shared-pure'

export type Layer2TxConfig = {
  uses: Layer2TrackedTxUse[]
  query: TrackedTxQuery
}

export type Layer2TrackedTxUse = {
  type: TrackedTxsConfigType
  subtype: TrackedTxsConfigSubtype
}

type TrackedTxQuery = FunctionCall | Transfer | SharpSubmission

interface FunctionCall {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: `function ${string}`
  sinceTimestampInclusive: UnixTime
  untilTimestampExclusive?: UnixTime
}

interface Transfer {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  sinceTimestampInclusive: UnixTime
  untilTimestampExclusive?: UnixTime
}

interface SharpSubmission {
  formula: 'sharpSubmission'
  programHashes: string[]
  sinceTimestampInclusive: UnixTime
  untilTimestampExclusive?: UnixTime
}
