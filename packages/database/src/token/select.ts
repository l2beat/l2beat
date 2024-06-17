import { Token } from './entity'

export const selectToken = [
  'id',
  'address',
  'createdAt',
  'networkId',
  'updatedAt',
] as const satisfies (keyof Token)[]
