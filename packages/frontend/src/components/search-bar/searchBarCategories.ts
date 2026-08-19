export interface SearchBarCategoryConfig {
  name: string
  /** Shown below the rank-ordered groups in search results */
  pinToBottom?: boolean
}

export const searchBarCategories = {
  l2: {
    name: 'Scaling',
  },
  da: {
    name: 'Data Availability',
  },
  interop: {
    name: 'Interoperability',
  },
  zkCatalog: {
    name: 'ZK Catalog',
  },
  ecosystems: {
    name: 'Ecosystems',
  },
  privacy: {
    name: 'Privacy',
  },
  tokens: {
    name: 'Tokens',
    pinToBottom: true,
  },
  other: {
    name: 'Other',
  },
} as const satisfies Record<string, SearchBarCategoryConfig>

export type SearchBarCategory = keyof typeof searchBarCategories
