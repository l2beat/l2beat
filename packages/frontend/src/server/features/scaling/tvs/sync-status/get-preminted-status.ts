import { getPremintedIndexerId } from '@l2beat/backend-shared'
import type {
  AmountConfigEntry,
  PremintedEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { getStatus } from './get-status'

export async function getPremintedStatus(
  entries: (AmountConfigEntry & { configId: string })[],
  targetTimestamp: UnixTime,
) {
  return getStatus(
    entries.filter(
      (c): c is PremintedEntry & { configId: string } => c.type === 'preminted',
    ),
    targetTimestamp,
    (c) => getPremintedIndexerId(c.chain, c.address),
    (indexer, entries) =>
      entries.find(
        (cc) =>
          cc.chain === indexer.indexerId.split('::')[1]!.split('_')[0] &&
          cc.address === indexer.indexerId.split('::')[1]!.split('_')[1],
      ),
  )
}
