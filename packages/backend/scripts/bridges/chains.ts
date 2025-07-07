export const CHAINS = [
  {
    name: 'ethereum',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
  },
  {
    name: 'arbitrum',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
  },
  {
    name: 'base',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
  },
  {
    name: 'unichain',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://uniscan.xyz/tx/${hash}`,
  },
  {
    name: 'zksync2',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://era.zksync.network/${hash}`,
  },
  {
    name: 'linea',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://lineascan.build/tx/${hash}`,
  },
  {
    name: 'scroll',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `hhttps://scrollscan.com/tx/${hash}`,
  },
  {
    name: 'ink',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://explorer.inkonchain.com/tx/${hash}`,
  },
]
