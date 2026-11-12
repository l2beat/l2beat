/**
 * The story's footnotes, in the order the text first cites them, so the
 * numbers count up as a reader goes down the page.
 */
export const SOURCES = [
  {
    id: 'finality',
    title: 'Finality in proof-of-stake Ethereum',
    publisher: 'ethereum.org',
    href: 'https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/#finality',
  },
  {
    id: 'eip4844',
    title: 'EIP-4844: Shard blob transactions (Dencun)',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-4844',
  },
  {
    id: 'eip7691',
    title: 'EIP-7691: Blob throughput increase (Pectra)',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-7691',
  },
  {
    id: 'eip7594',
    title: 'EIP-7594: PeerDAS, peer data availability sampling (Fusaka)',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-7594',
  },
  {
    id: 'eip7892',
    title: 'EIP-7892: Blob parameter only hardforks',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-7892',
  },
  {
    id: 'gas',
    title: 'Gas and fees',
    publisher: 'ethereum.org',
    href: 'https://ethereum.org/en/developers/docs/gas/',
  },
  {
    id: 'eip1559',
    title: 'EIP-1559: Fee market change, the burned base fee',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-1559',
  },
  {
    id: 'blobs',
    title: 'Every blob, live',
    publisher: 'ETHBEAT',
    href: '/blobs',
  },
  {
    id: 'issuance',
    title: 'How The Merge changed ETH supply',
    publisher: 'ethereum.org',
    href: 'https://ethereum.org/en/roadmap/merge/issuance/',
  },
] as const

export type SourceId = (typeof SOURCES)[number]['id']

export function sourceNumber(id: SourceId) {
  return SOURCES.findIndex((s) => s.id === id) + 1
}
