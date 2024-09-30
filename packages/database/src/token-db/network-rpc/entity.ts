import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { NetworkRpc } from '../../kysely/generated/types'

export interface NetworkRpcRecord {
  id: string
  networkId: string
  url: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableNetworkRpcRecord = Omit<
  Insertable<NetworkRpcRecord>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRow(
  record: UpsertableNetworkRpcRecord,
): Insertable<NetworkRpc> {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
