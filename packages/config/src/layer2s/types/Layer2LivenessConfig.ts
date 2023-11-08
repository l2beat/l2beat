import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

export interface Layer2LivenessConfig {
  stateUpdates: (FunctionCallParams | TransferParams)[]
  batchSubmissions: (FunctionCallParams | TransferParams)[]
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
