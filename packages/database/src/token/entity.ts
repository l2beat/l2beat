import { Insertable, Selectable } from 'kysely'
import { Token as TokenEntity } from '../kysely/generated/types'

export interface Token {
  id: string
  networkId: string
  address: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<TokenEntity>): Token {
  return row
}

export function toRow(record: Token): Insertable<TokenEntity> {
  return record
}
