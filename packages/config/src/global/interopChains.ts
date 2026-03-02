export interface InteropChain {
  id: string
  name: string
  type: 'evm'
  display: string
  iconSlug?: string
}

export const INTEROP_CHAINS: InteropChain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    display: 'ETH',
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    type: 'evm',
    display: 'ARB',
  },
  {
    id: 'base',
    name: 'Base',
    type: 'evm',
    display: 'BASE',
  },
  {
    id: 'optimism',
    name: 'OP Mainnet',
    iconSlug: 'op-mainnet',
    type: 'evm',
    display: 'OP',
  },
  {
    id: 'apechain',
    name: 'ApeChain',
    type: 'evm',
    display: 'APE',
  },
  {
    id: 'polygonpos',
    iconSlug: 'polygon-pos',
    name: 'Polygon PoS',
    type: 'evm',
    display: 'POL',
  },
  {
    id: 'zksync2',
    iconSlug: 'zksync-era',
    name: 'ZKsync Era',
    type: 'evm',
    display: 'ZK',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    type: 'evm',
    display: 'ABS',
  },
  {
    id: 'katana',
    iconSlug: 'katana',
    name: 'Katana',
    type: 'evm',
    display: 'KAT',
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    type: 'evm',
    display: 'BSC',
  },
  {
    id: 'solana',
    name: 'Solana',
    type: 'evm',
    display: 'SOL',
  },
  {
    id: 'starknet',
    name: 'Starknet',
    type: 'evm',
    display: 'STRK',
  },
  {
    id: 'ink',
    name: 'Ink',
    type: 'evm',
    display: 'INK',
  },
  {
    id: 'megaeth',
    name: 'MegaETH',
    type: 'evm',
    display: 'MEGA',
  },
  {
    id: 'worldchain',
    iconSlug: 'world',
    name: 'World Chain',
    type: 'evm',
    display: 'WORLD',
  },
  {
    id: 'celo',
    name: 'Celo',
    type: 'evm',
    display: 'CELO',
  },
  {
    id: 'unichain',
    name: 'Unichain',
    type: 'evm',
    display: 'UNI',
  },
  {
    id: 'forknet',
    iconSlug: 'forknet',
    name: 'Forknet',
    type: 'evm',
    display: 'FORK',
  },
  {
    id: 'linea',
    name: 'Linea',
    type: 'evm',
    display: 'LINEA',
  },
]
