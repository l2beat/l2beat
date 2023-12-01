import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface Layer2LivenessConfig {
  /** When some project post different types of data in the same txs we specify it here, so that we will not fetch data twice, and just when getting response from endpoint, we copy averages and other stats from and to specified ones  */
  duplicateData?: DuplicateData[]
  stateUpdates: (FunctionCallParams | TransferParams)[]
  batchSubmissions: (FunctionCallParams | TransferParams)[]
  proofSubmissions: (FunctionCallParams | TransferParams)[]
}

type DuplicateOption = 'batchSubmissions' | 'stateUpdates' | 'proofSubmissions'

export interface DuplicateData {
  from: DuplicateOption
  to: DuplicateOption
}

export interface FunctionCallParams {
  formula: 'functionCall'
  address: EthereumAddress
  selector: `0x${string}`
  functionSignature: string
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}

export interface TransferParams {
  formula: 'transfer'
  from: EthereumAddress
  to: EthereumAddress
  sinceTimestamp: UnixTime
  untilTimestamp?: UnixTime
}
