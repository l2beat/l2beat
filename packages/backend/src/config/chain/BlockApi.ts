import type { EthereumAddress } from '@l2beat/shared-pure'

interface BlockBasedApi {
  type: 'rpc' | 'starknet' | 'zksync' | 'loopring' | 'degate3' | 'fuel'
  url: string
  callsPerMinute: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
  multicallV3?: {
    address: EthereumAddress
    sinceBlock: number
  }
}

interface StarkexApi {
  type: 'starkex'
  product: string[]
  apiKey: string
  callsPerMinute: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
}

export type BlockApi = BlockBasedApi | StarkexApi
