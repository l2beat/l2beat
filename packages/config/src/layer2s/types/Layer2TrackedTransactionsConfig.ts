import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export type Layer2TrackedTransactionConfig = {
  uses: TrackedTransactionUse[]
  query: TrackedTransactionQuery
}

type TrackedTransactionUse = {
  type: Layer2TrackedTransactionConfigType
  subType: Layer2TrackedTransactionConfigSubType
  duplicateTo?: Layer2TrackedTransactionConfigSubType
}

export type Layer2TrackedTransactionConfigType = 'liveness'
export type Layer2TrackedTransactionConfigSubType =
  | 'stateUpdates'
  | 'batchSubmissions'
  | 'proofSubmissions'

type TrackedTransactionQuery = FunctionCall | Transfer | SharpSubmission

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
