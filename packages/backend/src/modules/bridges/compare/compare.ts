import type { Database } from '@l2beat/database'
import {
  type BridgeExplorerItem,
  getAcrossExplorerItems,
} from './getAcrossExplorerItems'

export async function compare(
  database: Database,
  input: {
    type: 'message' | 'transfer'
    types: string[]
    getExplorerItems: () => Promise<BridgeExplorerItem[]>
  }[],
) {
  for (const i of input) {
    const items = await getAcrossExplorerItems()

    const records =
      i.type === 'message'
        ? database.bridgeMessage.getExistingItems(items, i.types)
        : database.bridgeTransfer.getExistingItems(items, i.types)
  }
}
