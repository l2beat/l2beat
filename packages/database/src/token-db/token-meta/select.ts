import { TokenMetaRecord } from './entity'

export const selectTokenMeta = [
  'id',
  'tokenId',
  'externalId',
  'source',
  'name',
  'symbol',
  'decimals',
  'logoUrl',
  'contractName',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof TokenMetaRecord)[]
