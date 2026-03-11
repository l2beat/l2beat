export interface InteropChain {
  id: string
  name: string
  type: 'evm'
  display: string
  iconSlug?: string
  explorerUrl: string
}

export const INTEROP_CHAINS: InteropChain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    display: 'ETH',
    explorerUrl: 'https://etherscan.io',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    type: 'evm',
    display: 'ARB',
    explorerUrl: 'https://arbiscan.io',
  },
  {
    id: 'base',
    name: 'Base',
    type: 'evm',
    display: 'BASE',
    explorerUrl: 'https://basescan.org',
  },
  {
    id: 'optimism',
    name: 'OP Mainnet',
    iconSlug: 'op-mainnet',
    type: 'evm',
    display: 'OP',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  {
    id: 'apechain',
    name: 'ApeChain',
    type: 'evm',
    display: 'APE',
    explorerUrl: 'https://apescan.io',
  },
  {
    id: 'polygonpos',
    iconSlug: 'polygon-pos',
    name: 'Polygon PoS',
    type: 'evm',
    display: 'POL',
    explorerUrl: 'https://polygonscan.com',
  },
  {
    id: 'zksync2',
    iconSlug: 'zksync-era',
    name: 'ZKsync Era',
    type: 'evm',
    display: 'ZK',
    explorerUrl: 'https://explorer.zksync.io',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    type: 'evm',
    display: 'ABS',
    explorerUrl: 'https://abscan.org',
  },
  {
    id: 'katana',
    iconSlug: 'katana',
    name: 'Katana',
    type: 'evm',
    display: 'KAT',
    explorerUrl: 'https://katanascan.com',
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    type: 'evm',
    display: 'BSC',
    explorerUrl: 'https://bscscan.com',
  },
  {
    id: 'solana',
    name: 'Solana',
    type: 'evm',
    display: 'SOL',
    explorerUrl: 'https://solscan.io',
  },
  {
    id: 'starknet',
    name: 'Starknet',
    type: 'evm',
    display: 'STRK',
    explorerUrl: 'https://starkscan.co',
  },
  {
    id: 'ink',
    name: 'Ink',
    type: 'evm',
    display: 'INK',
    explorerUrl: 'https://explorer.inkonchain.com',
  },
  {
    id: 'megaeth',
    name: 'MegaETH',
    type: 'evm',
    display: 'MEGA',
    explorerUrl: 'https://megaeth.blockscout.com',
  },
  {
    id: 'worldchain',
    iconSlug: 'world',
    name: 'World Chain',
    type: 'evm',
    display: 'WORLD',
    explorerUrl: 'https://worldscan.org',
  },
  {
    id: 'celo',
    name: 'Celo',
    type: 'evm',
    display: 'CELO',
    explorerUrl: 'https://celoscan.io',
  },
  {
    id: 'unichain',
    name: 'Unichain',
    type: 'evm',
    display: 'UNI',
    explorerUrl: 'https://uniscan.xyz',
  },
  {
    id: 'forknet',
    iconSlug: 'forknet',
    name: 'Forknet',
    type: 'evm',
    display: 'FORK',
    explorerUrl: 'https://forkscan.org',
  },
  {
    id: 'linea',
    name: 'Linea',
    type: 'evm',
    display: 'LINEA',
    explorerUrl: 'https://lineascan.build',
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    type: 'evm',
    display: 'AVAX',
    explorerUrl: 'https://snowtrace.io',
  },
  {
    id: 'hyperevm',
    name: 'HyperEVM',
    type: 'evm',
    display: 'HYPER',
    explorerUrl: 'https://hyperevmscan.io',
  },
]
