export const searchBarCategories = {
  scaling: {
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
  other: {
    name: 'Other',
  },
} as const satisfies Record<string, { name: string }>

export type SearchBarCategory = keyof typeof searchBarCategories
