export interface ZkCatalogAttester {
  id: string
  name: string
  link: string
}

export const ATTESTERS = {
  L2BEAT: {
    id: 'l2beat',
    name: 'L2BEAT',
    link: 'https://l2beat.com',
  },
} as const satisfies Record<string, ZkCatalogAttester>
