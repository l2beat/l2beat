import { Insertable } from 'kysely'
import { TokenMeta } from '../../kysely/generated/types'
import { nanoid } from 'nanoid'

export interface TokenMetaRecord {
  id: string
  tokenId: string
  externalId: string | null
  source: string
  name: string | null
  symbol: string | null
  decimals: number | null
  logoUrl: string | null
  contractName: string | null
  updatedAt: Date
  createdAt: Date
}

export type UpsertableTokenMetaRecord = Omit<
  TokenMetaRecord,
  'id' | 'createdAt' | 'updatedAt'
>

export function upsertableToRow(
  record: UpsertableTokenMetaRecord,
): Insertable<TokenMeta> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
