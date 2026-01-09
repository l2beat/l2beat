export type InteropChains = typeof INTEROP_CHAINS
export const INTEROP_CHAINS = [
  {
    id: 'ethereum',
    iconSlug: 'ethereum',
    name: 'Ethereum',
    type: 'evm',
    display: 'ETH',
  },
  {
    id: 'arbitrum',
    iconSlug: 'arbitrum',
    name: 'Arbitrum',
    type: 'evm',
    display: 'ARB',
  },
  {
    id: 'base',
    iconSlug: 'base',
    name: 'Base',
    type: 'evm',
    display: 'BASE',
  },
  {
    id: 'optimism',
    iconSlug: 'optimism',
    name: 'Optimism',
    type: 'evm',
    display: 'OP',
  },
  {
    id: 'apechain',
    iconSlug: 'apechain',
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
    iconSlug: 'abstract',
    name: 'Abstract',
    type: 'evm',
    display: 'ABS',
  },
] as const
