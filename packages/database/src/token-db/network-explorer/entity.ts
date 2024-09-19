import { Insertable } from 'kysely'
import { ExplorerType } from '../../kysely/generated/enums'
import { NetworkExplorer } from '../../kysely/generated/types'
import { nanoid } from 'nanoid'

export interface NetworkExplorerRecord {
  id: string
  networkId: string
  type: ExplorerType
  url: string
  apiKey: string
  updatedAt: Date
  createdAt: Date
}

export type UpsertableNetworkExplorerRecord = Omit<
  Insertable<NetworkExplorer>,
  'id' | 'updatedAt' | 'createdAt'
>

export function upsertableToRow(
  record: UpsertableNetworkExplorerRecord,
): NetworkExplorerRecord {
  return {
    ...record,
    id: nanoid(),
    updatedAt: new Date(),
    createdAt: new Date(),
  }
}
