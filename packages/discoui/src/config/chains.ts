export interface Chain {
  name: string
  displayName: string
  chainId: number
  shortName: string
  iconSlug?: string
}

export const AVAILABLE_CHAINS: Chain[] = [
  { name: 'ethereum', displayName: 'Ethereum', chainId: 1, shortName: 'eth' },
  {
    name: 'arbitrum',
    displayName: 'Arbitrum One',
    chainId: 42161,
    shortName: 'arb1',
  },
  {
    name: 'nova',
    displayName: 'Arbitrum Nova',
    chainId: 42170,
    shortName: 'arb-nova',
  },
  {
    name: 'optimism',
    displayName: 'OP Mainnet',
    chainId: 10,
    shortName: 'oeth',
  },
  {
    name: 'polygonpos',
    displayName: 'Polygon PoS',
    chainId: 137,
    shortName: 'matic',
    iconSlug: 'polygon-pos',
  },
  {
    name: 'bsc',
    displayName: 'BNB Smart Chain',
    chainId: 56,
    shortName: 'bnb',
  },
  {
    name: 'avalanche',
    displayName: 'Avalanche C-Chain',
    chainId: 43114,
    shortName: 'avax',
  },
  { name: 'celo', displayName: 'Celo', chainId: 42220, shortName: 'celo' },
  { name: 'linea', displayName: 'Linea', chainId: 59144, shortName: 'linea' },
  { name: 'base', displayName: 'Base', chainId: 8453, shortName: 'base' },
  {
    name: 'polygonzkevm',
    displayName: 'Polygon zkEVM',
    chainId: 1101,
    shortName: 'zkevm',
  },
  { name: 'gnosis', displayName: 'Gnosis', chainId: 100, shortName: 'gno' },
  {
    name: 'zksync2',
    displayName: 'ZKsync Era',
    chainId: 324,
    shortName: 'zksync',
    iconSlug: 'zksync-era',
  },
  {
    name: 'sepolia',
    displayName: 'Sepolia',
    chainId: 11155111,
    shortName: 'sep',
    iconSlug: 'ethereum',
  },
  { name: 'scroll', displayName: 'Scroll', chainId: 534352, shortName: 'scr' },
  { name: 'mantle', displayName: 'Mantle', chainId: 5000, shortName: 'mantle' },
  {
    name: 'metis',
    displayName: 'Metis',
    chainId: 1088,
    shortName: 'metis-andromeda',
  },
  {
    name: 'bobanetwork',
    displayName: 'Boba Network',
    chainId: 288,
    shortName: 'boba',
  },
  { name: 'mode', displayName: 'Mode', chainId: 34443, shortName: 'mode' },
  { name: 'zora', displayName: 'Zora', chainId: 7777777, shortName: 'zora' },
  {
    name: 'mantapacific',
    displayName: 'Manta Pacific',
    chainId: 169,
    shortName: 'manta',
  },
  {
    name: 'blast',
    displayName: 'Blast',
    chainId: 81457,
    shortName: 'blastmainnet',
  },
  { name: 'kinto', displayName: 'Kinto', chainId: 7887, shortName: 'kinto' },
  {
    name: 'katana',
    displayName: 'Katana',
    chainId: 747474,
    shortName: 'katana',
  },
  {
    name: 'unichain',
    displayName: 'Unichain',
    chainId: 130,
    shortName: 'unichain',
  },
  {
    name: 'hyperevm',
    displayName: 'HyperEVM',
    chainId: 999,
    shortName: 'hyperevm',
  },
  { name: 'ink', displayName: 'Ink', chainId: 57073, shortName: 'ink' },
  {
    name: 'everclear',
    displayName: 'Everclear',
    chainId: 25327,
    shortName: 'everclear',
  },
  {
    name: 'zircuit',
    displayName: 'Zircuit',
    chainId: 48900,
    shortName: 'zircuit',
  },
  { name: 'taiko', displayName: 'Taiko', chainId: 167000, shortName: 'taiko' },
  { name: 'zama', displayName: 'Zama', chainId: 261131, shortName: 'zama' },
  { name: 'facet', displayName: 'Facet', chainId: 1027303, shortName: 'facet' },
  {
    name: 'ethereal',
    displayName: 'Ethereal',
    chainId: 5064014,
    shortName: 'ethereal',
  },
  { name: 'jovay', displayName: 'Jovay', chainId: 5734951, shortName: 'jovay' },
  {
    name: 'robinhood',
    displayName: 'Robinhood Chain',
    chainId: 4663,
    shortName: 'robinhood',
  },
].toSorted((a, b) => a.chainId - b.chainId)

export function getChain(shortName: string): Chain {
  const chain = AVAILABLE_CHAINS.find((c) => c.shortName === shortName)
  if (chain === undefined) {
    throw new Error(`Unknown chain short name: ${shortName}`)
  }
  return chain
}

export function getChainIconUrl(chain: Chain): string {
  return `https://l2beat.com/icons/${chain.iconSlug ?? chain.name}.png`
}
