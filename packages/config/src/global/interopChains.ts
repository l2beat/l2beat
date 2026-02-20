export interface InteropChain {
  id: string
  name: string
  type: 'evm'
  display: string
  iconSlug?: string
  isUpcoming?: boolean
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
    isUpcoming: true,
  },
  {
    id: 'solana',
    iconSlug: 'soon',
    name: 'Solana',
    type: 'evm',
    display: 'SOL',
    isUpcoming: true,
  },
  {
    id: 'starknet',
    name: 'Starknet',
    type: 'evm',
    display: 'STRK',
    isUpcoming: true,
  },
  {
    id: 'ink',
    name: 'Ink',
    type: 'evm',
    display: 'INK',
    isUpcoming: true,
  },
  {
    id: 'megaeth',
    name: 'MegaETH',
    type: 'evm',
    display: 'MEGA',
    isUpcoming: true,
  },
  {
    id: 'worldchain',
    iconSlug: 'world',
    name: 'World Chain',
    type: 'evm',
    display: 'WORLD',
    isUpcoming: true,
  },
  {
    id: 'celo',
    name: 'Celo',
    type: 'evm',
    display: 'CELO',
    isUpcoming: true,
  },
  {
    id: 'unichain',
    name: 'Unichain',
    type: 'evm',
    display: 'UNI',
    isUpcoming: true,
  },
  {
    id: 'forknet',
    iconSlug: 'forknet',
    name: 'Forknet',
    type: 'evm',
    display: 'FORK',
  },
]
