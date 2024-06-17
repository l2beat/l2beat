import { NetworkRpc } from '../kysely/generated/types'

export const selectNetworkRpc = [
  'id',
  'networkId',
  'url',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof NetworkRpc)[]
