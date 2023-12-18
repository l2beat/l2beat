import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface Layer2Liveness {
  /** When some project post different types of data in the same txs we specify it here, so that we will not fetch data twice, and just when getting response from endpoint, we copy averages and other stats from and to specified ones  */
  duplicateData?: DuplicateData[]
  stateUpdates: Layer2LivenessConfiguration[]
  batchSubmissions: Layer2LivenessConfiguration[]
  proofSubmissions: Layer2LivenessConfiguration[]
}

type DuplicateOption = 'batchSubmissions' | 'stateUpdates' | 'proofSubmissions'

export interface DuplicateData {
  from: DuplicateOption
  to: DuplicateOption
}

export type Layer2LivenessConfiguration =
  | FunctionCall
  | Transfer
  | SharpSubmission

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
