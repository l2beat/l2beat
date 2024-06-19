import { Insertable, Selectable } from 'kysely'
import { NetworkRpc as NetworkRpcEntity } from '../kysely/generated/types'

export interface NetworkRpc {
  id: string
  networkId: string
  url: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(row: Selectable<NetworkRpcEntity>): NetworkRpc {
  return row
}

export function toRow(record: NetworkRpc): Insertable<NetworkRpcEntity> {
  return record
}
