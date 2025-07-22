// TODO: custom batching ranges per chain (amount of logs is different per block per chain)
export interface Chain {
  name: string
  shortName: string
  blockProviderConfig:
    | {
        type: 'rpc'
        callsPerMinute: number
      }
    | {
        type: 'etherscan'
        chainId: number
      }
  getTxUrl: (hash: string) => string
  envioUrl: string
  envioCallsPerMinute: number
  envioBatchSize: number
}
// Envio Rate Limiting Information: https://envio.dev/pricing
//  Without API Token: Free unlimited usage with heavy rate limiting (60 requests/minute)
//  With API Token: No rate limiting applied - full speed access
//    Generate API Token: https://envio.dev/app/api-tokens
// Supported networks: https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks
export const CHAINS: Chain[] = [
  {
    name: 'ethereum',
    shortName: 'eth',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 1,
    },
    getTxUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
    envioUrl: 'https://eth.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 100,
  },
  {
    name: 'arbitrum',
    shortName: 'arb1',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 42161,
    },
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    envioUrl: 'https://arbitrum.hypersync.xyz/query', //🥈
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'optimism',
    shortName: 'oeth',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 10,
    },
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    envioUrl: 'https://optimism.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'base',
    shortName: 'base',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 8453,
    },
    getTxUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
    envioUrl: 'https://base.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'zksync',
    shortName: 'zksync',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 324,
    },
    getTxUrl: (hash: string) => `https://era.zksync.network/${hash}`,
    envioUrl: 'https://zksync.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'linea',
    shortName: 'linea',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 59144,
    },
    getTxUrl: (hash: string) => `https://lineascan.build/tx/${hash}`,
    envioUrl: 'https://linea.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'scroll',
    shortName: 'scr',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 534352,
    },
    getTxUrl: (hash: string) => `hhttps://scrollscan.com/tx/${hash}`,
    envioUrl: 'https://scroll.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'unichain',
    shortName: 'unichain',
    blockProviderConfig: {
      type: 'etherscan',
      chainId: 130,
    },
    getTxUrl: (hash: string) => `https://uniscan.xyz/tx/${hash}`,
    envioUrl: 'https://unichain.hypersync.xyz/query', // 🪨
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'ink',
    shortName: 'ink',
    blockProviderConfig: {
      type: 'rpc',
      callsPerMinute: 120,
    },
    getTxUrl: (hash: string) => `https://explorer.inkonchain.com/tx/${hash}`,
    envioUrl: 'https://ink.hypersync.xyz/query', //🪨
    envioCallsPerMinute: 120,
    envioBatchSize: 100,
  },
]
