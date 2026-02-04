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
    name: 'Arbitrum',
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
    name: 'Optimism',
    type: 'evm',
    display: 'OP',
  },
  {
    id: 'apechain',
    name: 'Apechain',
    type: 'evm',
    display: 'APE',
  },
  {
    id: 'polygonpos',
    iconSlug: 'polygon-pos',
    name: 'Polygon POS',
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
    name: 'katana',
    type: 'evm',
    display: 'KAT',
  },
  {
    id: 'bsc',
    iconSlug: 'bsc',
    name: 'binance-smart-chain',
    type: 'evm',
    display: 'BSC',
  },
]
