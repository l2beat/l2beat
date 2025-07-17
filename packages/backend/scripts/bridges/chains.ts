export interface Chain {
  name: string
  shortName: string
  callsPerMinute: number
  getTxUrl: (hash: string) => string
}

export const CHAINS: Chain[] = [
  {
    name: 'ethereum',
    shortName: 'eth',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://etherscan.io/tx/${hash}`,
  },
  {
    name: 'arbitrum',
    shortName: 'arb1',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
  },
  {
    name: 'optimism',
    shortName: 'oeth',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://arbiscan.io/tx/${hash}`,
  },
  {
    name: 'base',
    shortName: 'base',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://basescan.org/tx/${hash}`,
  },
  {
    name: 'unichain',
    shortName: 'unichain',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://uniscan.xyz/tx/${hash}`,
  },
  {
    name: 'zksync2',
    shortName: 'zksync',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://era.zksync.network/${hash}`,
  },
  {
    name: 'linea',
    shortName: 'linea',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://lineascan.build/tx/${hash}`,
  },
  {
    name: 'scroll',
    shortName: 'scr',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `hhttps://scrollscan.com/tx/${hash}`,
  },
  {
    name: 'ink',
    shortName: 'ink',
    callsPerMinute: 1000,
    getTxUrl: (hash: string) => `https://explorer.inkonchain.com/tx/${hash}`,
  },
]
