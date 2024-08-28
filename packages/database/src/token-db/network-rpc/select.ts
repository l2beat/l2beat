import { NetworkRpc } from '../../kysely/token-db/types'

export const selectNetworkRpc = [
  'id',
  'networkId',
  'url',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof NetworkRpc)[]
