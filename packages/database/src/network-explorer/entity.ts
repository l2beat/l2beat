import { Insertable, Selectable } from 'kysely'
import { ExplorerType } from '../kysely/generated/enums'
import { NetworkExplorer as NetworkExplorerEntity } from '../kysely/generated/types'

export interface NetworkExplorer {
  id: string
  networkId: string
  type: ExplorerType
  url: string
  apiKey: string
  updatedAt: Date
  createdAt: Date
}

export function toRecord(
  row: Selectable<NetworkExplorerEntity>,
): NetworkExplorer {
  return row
}

export function toRow(
  record: NetworkExplorer,
): Insertable<NetworkExplorerEntity> {
  return record
}
