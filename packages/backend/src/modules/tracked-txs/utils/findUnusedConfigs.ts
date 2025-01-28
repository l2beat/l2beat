import type { Database } from '@l2beat/database'

export async function findUnusedConfigs(db: Database): Promise<string[]> {
  const allConfigs = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )
  const l2CostsConfigs = await db.l2Cost.getUsedConfigsIds()
  const livenessConfigs = await db.liveness.getUsedConfigsIds()

  const usedConfigs = new Set([...l2CostsConfigs, ...livenessConfigs])

  return allConfigs.filter((c) => !usedConfigs.has(c.id)).map((c) => c.id)
}
