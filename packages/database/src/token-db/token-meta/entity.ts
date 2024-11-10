import { StringWithAutocomplete } from '@l2beat/shared-pure'
import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { TokenMeta } from '../../kysely/generated/types'

export interface TokenMetaRecord {
  id: string
  tokenId: string
  externalId: string | null
  source: StringWithAutocomplete<'Aggregate' | 'Overrides'>
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
