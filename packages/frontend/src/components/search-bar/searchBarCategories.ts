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
  other: {
    name: 'Other',
  },
} as const satisfies Record<string, { name: string }>

export type SearchBarCategory = keyof typeof searchBarCategories
export type SearchBarCategoryMeta<
  T extends SearchBarCategory = SearchBarCategory,
> = (typeof searchBarCategories)[T]
