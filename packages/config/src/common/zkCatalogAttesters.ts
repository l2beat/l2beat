export interface ZkCatalogAttester {
  id: string
  name: string
  link: string
}

export const ZK_CATALOG_ATTESTERS = {
  L2BEAT: {
    id: 'l2beat',
    name: 'ETHBEAT',
    link: 'https://ethbeat.org',
  },
} as const satisfies Record<string, ZkCatalogAttester>
