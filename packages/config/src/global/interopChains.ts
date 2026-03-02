export interface InteropChain {
  id: string
  name: string
  type: 'evm'
  display: string
  iconSlug?: string
  txExplorerUrl: string
}

export const INTEROP_CHAINS: InteropChain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    display: 'ETH',
    txExplorerUrl: 'https://etherscan.io/tx/',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    type: 'evm',
    display: 'ARB',
    txExplorerUrl: 'https://arbiscan.io/tx/',
  },
  {
    id: 'base',
    name: 'Base',
    type: 'evm',
    display: 'BASE',
    txExplorerUrl: 'https://basescan.org/tx/',
  },
  {
    id: 'optimism',
    name: 'OP Mainnet',
    iconSlug: 'op-mainnet',
    type: 'evm',
    display: 'OP',
    txExplorerUrl: 'https://optimistic.etherscan.io/tx/',
  },
  {
    id: 'apechain',
    name: 'ApeChain',
    type: 'evm',
    display: 'APE',
    txExplorerUrl: 'https://apescan.io/tx/',
  },
  {
    id: 'polygonpos',
    iconSlug: 'polygon-pos',
    name: 'Polygon PoS',
    type: 'evm',
    display: 'POL',
    txExplorerUrl: 'https://polygonscan.com/tx/',
  },
  {
    id: 'zksync2',
    iconSlug: 'zksync-era',
    name: 'ZKsync Era',
    type: 'evm',
    display: 'ZK',
    txExplorerUrl: 'https://explorer.zksync.io/tx/',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    type: 'evm',
    display: 'ABS',
    txExplorerUrl: 'https://abscan.org/tx/',
  },
  {
    id: 'katana',
    iconSlug: 'katana',
    name: 'Katana',
    type: 'evm',
    display: 'KAT',
    txExplorerUrl: 'https://katanascan.com/tx/',
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    type: 'evm',
    display: 'BSC',
    txExplorerUrl: 'https://bscscan.com/tx/',
  },
  {
    id: 'solana',
    name: 'Solana',
    type: 'evm',
    display: 'SOL',
    txExplorerUrl: 'https://solscan.io/tx/',
  },
  {
    id: 'starknet',
    name: 'Starknet',
    type: 'evm',
    display: 'STRK',
    txExplorerUrl: 'https://starkscan.co/tx/',
  },
  {
    id: 'ink',
    name: 'Ink',
    type: 'evm',
    display: 'INK',
    txExplorerUrl: 'https://explorer.inkonchain.com/tx/',
  },
  {
    id: 'megaeth',
    name: 'MegaETH',
    type: 'evm',
    display: 'MEGA',
    txExplorerUrl: 'https://megaeth.blockscout.com/tx/',
  },
  {
    id: 'worldchain',
    iconSlug: 'world',
    name: 'World Chain',
    type: 'evm',
    display: 'WORLD',
    txExplorerUrl: 'https://worldscan.org/tx/',
  },
  {
    id: 'celo',
    name: 'Celo',
    type: 'evm',
    display: 'CELO',
    txExplorerUrl: 'https://celoscan.io/tx/',
  },
  {
    id: 'unichain',
    name: 'Unichain',
    type: 'evm',
    display: 'UNI',
    txExplorerUrl: 'https://uniscan.xyz/tx/',
  },
  {
    id: 'forknet',
    iconSlug: 'forknet',
    name: 'Forknet',
    type: 'evm',
    display: 'FORK',
    txExplorerUrl: 'https://forkscan.org/tx/',
  },
  {
    id: 'linea',
    name: 'Linea',
    type: 'evm',
    display: 'LINEA',
  },
]
