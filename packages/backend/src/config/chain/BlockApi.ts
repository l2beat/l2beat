interface BlockBasedApi {
  type: 'rpc' | 'starknet' | 'zksync' | 'loopring' | 'degate3' | 'fuel'
  url: string
  callsPerMinute: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
}

interface StarkexApi {
  type: 'starkex'
  apiKey: string
  callsPerMinute: number
  retryStrategy: 'RELIABLE' | 'UNRELIABLE'
}

export type BlockApi = BlockBasedApi | StarkexApi
