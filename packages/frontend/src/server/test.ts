import { ProjectId, toBatches, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { getDb } from './database'

const db = getDb()

async function main() {
  const promise = range(50000).flatMap((i) => [
    db.indexerState.findByIndexerId(`123-${i}`),
    db.dataAvailability.getByDaLayersAndTimeRange(
      ['ethereum', 'avail'],
      [UnixTime(1761609600), UnixTime(1761004800)],
    ),
    db.activity.getByProjectAndTimeRange(ProjectId.ETHEREUM, [
      UnixTime(1761609600),
      UnixTime(1761004800),
    ]),
    db.syncMetadata.getByFeatureAndIds('activity', [ProjectId.ETHEREUM]),
    db.realTimeAnomalies.getOngoingAnomalies(['arbitrum', 'base', 'optimism']),
  ])
  const batches = toBatches(promise, 100)

  for (const [i, batch] of Object.entries(batches)) {
    console.log(i, Number(i) * 100 + batch.length)
    await Promise.all(batch)
  }
}

main().catch(console.error)
