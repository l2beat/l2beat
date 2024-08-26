import { Insertable, Selectable } from 'kysely'
import { NetworkRpc } from '../../kysely/token-db/types'

export interface NetworkRpcRecord {
  id: string
  networkId: string
  url: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<NetworkRpc>): NetworkRpcRecord {
  return row
}

export function toRow(record: NetworkRpcRecord): Insertable<NetworkRpc> {
  return record
}
