import { getCirculatingSupplyIndexerId } from '@l2beat/backend-shared'
import type {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { getStatus } from './get-status'

type Entry = AmountConfigEntry & { configId: string }

export async function getCirculatingSupplyStatus(
  entries: Entry[],
  targetTimestamp: UnixTime,
) {
  return getStatus(
    entries.filter(
      (c): c is CirculatingSupplyEntry & { configId: string } =>
        c.type === 'circulatingSupply',
    ),
    targetTimestamp,
    (c) => getCirculatingSupplyIndexerId(c.coingeckoId),
    (indexer, entries) =>
      entries.find(
        (cc) => cc.coingeckoId.toString() === indexer.indexerId.split('::')[1],
      ),
  )
}
