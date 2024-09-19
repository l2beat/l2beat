import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { Token } from '../../kysely/generated/types'

export interface TokenRecord {
  id: string
  networkId: string
  address: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableTokenRecord = Omit<
  TokenRecord,
  'id' | 'createdAt' | 'updatedAt'
>

export function upsertableToRow(
  record: UpsertableTokenRecord,
): Insertable<Token> {
  return {
    ...record,
    id: nanoid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
