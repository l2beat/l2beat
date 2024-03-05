import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export type Layer2TxConfig = {
  uses: TrackedTxUse[]
  query: TrackedTxQuery
}

export type TrackedTxUse = {
  type: Layer2TrackedTxConfigType
  subType: Layer2TrackedTxConfigSubType
  duplicateTo?: Layer2TrackedTxConfigSubType
}

export type Layer2TrackedTxConfigType = 'liveness'
export type Layer2TrackedTxConfigSubType =
  | 'stateUpdates'
  | 'batchSubmissions'
  | 'proofSubmissions'

type TrackedTxQuery = FunctionCall | Transfer | SharpSubmission

interface FunctionCall {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

interface Transfer {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

interface SharpSubmission {
  formula: 'sharpSubmission'
  programHashes: string[]
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}
