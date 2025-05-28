import type { IndexerConfigurationRecord } from '@l2beat/database'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'

export async function getLivenessTxs(
  projectId: string,
  subtype: TrackedTxsConfigSubtype,
) {
  const db = getDb()
  const to = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const from = to - 30 * UnixTime.DAY

  const configurationIds = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )
  const relevantConfigs = getRelevantConfigs(
    configurationIds,
    projectId,
    subtype,
    from,
    to,
  )

  const records = await db.liveness.getByConfigurationIdWithinTimeRange(
    relevantConfigs.map((c) => c.id),
    from,
    to,
  )

  if (records.length === 0) {
    return {
      success: false,
      error: 'Missing data.',
    } as const
  }

  return {
    success: true,
    data: {
      projectId,
      subtype,
      timestamps: records.map((r) => r.timestamp),
    },
  } as const
}

function getRelevantConfigs(
  configurationIds: IndexerConfigurationRecord[],
  projectId: string,
  subtype: TrackedTxsConfigSubtype,
  from: UnixTime,
  to: UnixTime,
) {
  const parsed = configurationIds.map((c) => ({
    ...c,
    properties: JSON.parse(c.properties) as {
      subtype: TrackedTxsConfigSubtype
      projectId: string
    },
  }))

  return parsed.filter(
    (c) =>
      c.properties.projectId === projectId &&
      c.properties.subtype === subtype &&
      c.minHeight <= to &&
      (!c.maxHeight || c.maxHeight >= from),
  )
}
