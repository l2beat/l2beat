import { Insertable, Selectable } from 'kysely'
import { Token } from '../../kysely/token-db/types'

export interface TokenRecord {
  id: string
  networkId: string
  address: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<Token>): TokenRecord {
  return row
}

export function toRow(record: TokenRecord): Insertable<Token> {
  return record
}
