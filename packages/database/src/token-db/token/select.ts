import { TokenRecord } from './entity'

export const selectToken = [
  'id',
  'address',
  'createdAt',
  'networkId',
  'updatedAt',
] as const satisfies (keyof TokenRecord)[]

export const selectTokenWithPrefix = <T extends string>(prefix: T) =>
  selectToken.map((s) => `${prefix}.${s}` as const)
