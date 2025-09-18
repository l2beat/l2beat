// TODO: custom batching ranges per chain (amount of logs is different per block per chain)
export interface Chain {
  name: string
  shortName: string
  rpcCallsPerMinute: number
  getTxUrl: (hash: string) => string
  getAddressUrl: (hash: string) => string
  envioUrl?: string
  envioCallsPerMinute?: number
  envioBatchSize?: number
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
    rpcCallsPerMinute: 600,
    getTxUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://etherscan.io/address/${hash}`,
    envioUrl: 'https://eth.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 100,
  },
  {
    name: 'arbitrum',
    shortName: 'arb1',
    rpcCallsPerMinute: 600,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://arbiscan.io/address/${hash}`,
    envioUrl: 'https://arbitrum.hypersync.xyz/query', //🥈
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'optimism',
    shortName: 'oeth',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://optimistic.etherscan.io/tx/${hash}`,
    getAddressUrl: (hash: string) =>
      `https://optimistic.etherscan.io/address/${hash}`,
    envioUrl: 'https://optimism.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'base',
    shortName: 'base',
    rpcCallsPerMinute: 600,
    getTxUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://basescan.org/address/${hash}`,
    envioUrl: 'https://base.hypersync.xyz/query', //🏅
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'zksync2',
    shortName: 'zksync',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://era.zksync.network/tx/${hash}`,
    getAddressUrl: (hash: string) =>
      `https://era.zksync.network/address/${hash}`,
    envioUrl: 'https://zksync.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'linea',
    shortName: 'linea',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://lineascan.build/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://lineascan.build/address/${hash}`,
    envioUrl: 'https://linea.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'scroll',
    shortName: 'scr',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://scrollscan.com/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://scrollscan.com/address/${hash}`,
    envioUrl: 'https://scroll.hypersync.xyz/query', //🥉
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'unichain',
    shortName: 'unichain',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://uniscan.xyz/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://uniscan.xyz/address/${hash}`,
    envioUrl: 'https://unichain.hypersync.xyz/query', // 🪨
    envioCallsPerMinute: 120,
    envioBatchSize: 2000,
  },
  {
    name: 'ink',
    shortName: 'ink',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://explorer.inkonchain.com/tx/${hash}`,
    getAddressUrl: (hash: string) =>
      `https://explorer.inkonchain.com/address/${hash}`,
    envioUrl: 'https://ink.hypersync.xyz/query', //🪨
    envioCallsPerMinute: 120,
    envioBatchSize: 100,
  },
  {
    name: 'polygonzkevm',
    shortName: 'zkevm',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://zkevm.polygonscan.com/tx/${hash}`,
    getAddressUrl: (hash: string) =>
      `https://zkevm.polygonscan.com/address/${hash}`,
  },
  {
    name: 'katana',
    shortName: 'katana',
    rpcCallsPerMinute: 120,
    getTxUrl: (hash: string) => `https://katanascan.com/tx/${hash}`,
    getAddressUrl: (hash: string) => `https://katanascan.com/address/${hash}`,
  },
]
