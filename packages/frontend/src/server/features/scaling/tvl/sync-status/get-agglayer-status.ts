import { getAggLayerIndexerId } from '@l2beat/config'
import {
  type AggLayerL2Token,
  type AggLayerNativeEtherPreminted,
  type AggLayerNativeEtherWrapped,
  type AmountConfigEntry,
  type UnixTime,
} from '@l2beat/shared-pure'
import { getStatus } from './get-status'

export async function getAggLayerStatus(
  entries: (AmountConfigEntry & { configId: string })[],
  targetTimestamp: UnixTime,
) {
  return getStatus(
    entries.filter(
      (
        c,
      ): c is (
        | AggLayerL2Token
        | AggLayerNativeEtherPreminted
        | AggLayerNativeEtherWrapped
      ) & { configId: string } =>
        c.type === 'aggLayerL2Token' ||
        c.type === 'aggLayerNativeEtherPreminted' ||
        c.type === 'aggLayerNativeEtherWrapped',
    ),
    targetTimestamp,
    (c) => getAggLayerIndexerId(c.chain),
    (indexer, entries) =>
      entries.find((cc) => cc.chain === indexer.indexerId.split('::')[1]),
  )
}
