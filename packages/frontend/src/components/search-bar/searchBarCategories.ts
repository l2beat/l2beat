export const searchBarCategories = {
  scaling: {
    name: 'Scaling',
  },
  bridges: {
    name: 'Bridges',
  },
  da: {
    name: 'Data Availability',
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
