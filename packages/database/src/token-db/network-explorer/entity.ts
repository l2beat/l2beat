import { Insertable, Selectable } from 'kysely'
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

export function toRecord(
  row: Selectable<NetworkExplorer>,
): NetworkExplorerRecord {
  return row
}

export function toRow(
  record: NetworkExplorerRecord,
): Insertable<NetworkExplorer> {
  return record
}
