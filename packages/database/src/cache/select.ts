import { Cache } from './entity'

export const selectCache = [
  'key',
  'value',
  'chainId',
  'blockNumber',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof Cache)[]
