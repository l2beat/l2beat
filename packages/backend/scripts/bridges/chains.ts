export interface Chain {
  name: string
  shortName: string
  callsPerMinute: number
  getTxUrl: (hash: string) => string
  envio?: string
}
// Envio Rate Limiting Information: https://envio.dev/pricing
// Without API Token: Free unlimited usage with heavy rate limiting (60 requests/minute)
// Supported networks: https://docs.envio.dev/docs/HyperSync/hypersync-supported-networks
export const CHAINS: Chain[] = [
  {
    name: 'ethereum',
    shortName: 'eth',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
    envio: 'https://eth.hypersync.xyz/query', //🏅
  },
  {
    name: 'arbitrum',
    shortName: 'arb1',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    envio: 'https://arbitrum.hypersync.xyz/query', //🥈
  },
  {
    name: 'optimism',
    shortName: 'oeth',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
    envio: 'https://optimism.hypersync.xyz/query', //🏅
  },
  {
    name: 'base',
    shortName: 'base',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
    envio: 'https://base.hypersync.xyz/query', //🏅
  },
  {
    name: 'zksync',
    shortName: 'zksync',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://era.zksync.network/${hash}`,
    envio: 'https://zksync.hypersync.xyz/query', //🥉
  },
  {
    name: 'linea',
    shortName: 'linea',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://lineascan.build/tx/${hash}`,
    envio: 'https://linea.hypersync.xyz/query', //🥉
  },
  {
    name: 'scroll',
    shortName: 'scr',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `hhttps://scrollscan.com/tx/${hash}`,
    envio: 'https://scroll.hypersync.xyz/query', //🥉
  },
  {
    name: 'unichain',
    shortName: 'unichain',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://uniscan.xyz/tx/${hash}`,
    envio: 'https://unichain.hypersync.xyz/query', // 🪨
  },
  {
    name: 'ink',
    shortName: 'ink',
    callsPerMinute: 120,
    getTxUrl: (hash: string) => `https://explorer.inkonchain.com/tx/${hash}`,
    envio: 'https://ink.hypersync.xyz/query', //🪨
  },
]
