/**
 * What search covers, one example per kind, so visitors see it finds more
 * than projects: the button cycles through them and the empty dialog offers
 * them as searches to try.
 */
export const SEARCH_BAR_EXAMPLES: {
  /** After "Search" on the button; short enough not to truncate there. */
  hint: string
  /** The search a chip runs; none for a hint that is not a name. */
  query?: string
  kind?: string
}[] = [
  { hint: 'Layer 2s, e.g. Base', query: 'Base', kind: 'Layer 2' },
  { hint: 'tokens, e.g. USDC', query: 'USDC', kind: 'Token' },
  { hint: 'privacy, e.g. Railgun', query: 'Railgun', kind: 'Privacy' },
  { hint: 'DA layers, e.g. Celestia', query: 'Celestia', kind: 'DA' },
  { hint: 'bridges, e.g. Across', query: 'Across', kind: 'Interop' },
  {
    hint: 'zkVMs, e.g. RISC Zero',
    query: 'RISC Zero',
    kind: 'ZK Catalog',
  },
  { hint: 'by contract address' },
]
