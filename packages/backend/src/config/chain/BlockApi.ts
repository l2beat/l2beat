import type { RetryHandlerVariant } from '@l2beat/shared'
import type { EthereumAddress } from '@l2beat/shared-pure'

interface BlockBasedApi {
  type: 'rpc' | 'starknet' | 'zksync' | 'loopring' | 'degate3' | 'fuel'
  url: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
  multicallV3?: {
    address: EthereumAddress
    sinceBlock: number
  }
}

interface SvmBlockBasedApi {
  type: 'svm-rpc'
  url: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
}

interface StarkexApi {
  type: 'starkex'
  product: string[]
  apiKey: string
  callsPerMinute: number
  retryStrategy: RetryHandlerVariant
}

export type BlockApi = BlockBasedApi | StarkexApi | SvmBlockBasedApi
