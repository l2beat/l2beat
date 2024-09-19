import { Insertable } from 'kysely'
import { nanoid } from 'nanoid'
import { ExplorerType } from '../../kysely/generated/enums'
import { NetworkExplorer } from '../../kysely/generated/types'

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
