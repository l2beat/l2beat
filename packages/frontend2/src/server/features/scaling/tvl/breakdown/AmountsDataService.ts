import { type Database } from '@l2beat/database'
import { type AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { type DataStatusService } from './DataStatusService'

interface Dependencies {
  readonly db: Database
  readonly dataStatusService: DataStatusService
}

export class AmountsDataService {
  constructor(private readonly $: Dependencies) {}

  async getLatestAmount(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const amounts = await this.$.db.amount.getByIdsAndTimestamp(
      configurations.map((c) => c.configId),
      targetTimestamp,
    )
    const status = await this.$.dataStatusService.getAmountsStatus(
      configurations,
      targetTimestamp,
    )

    const lagging = new Map()

    if (status.lagging.length > 0) {
      const uniqueTimestamps = new Set<number>()
      status.lagging.forEach((l) =>
        uniqueTimestamps.add(l.latestTimestamp.toNumber()),
      )

      const data = await this.$.db.amount.getByTimestamps(
        Array.from(uniqueTimestamps).map((u) => new UnixTime(u)),
      )
      const dataByConfigId = groupBy(data, 'configId')

      for (const laggingConfig of status.lagging) {
        const latestRecord = dataByConfigId[laggingConfig.id]?.find((d) =>
          d.timestamp.equals(laggingConfig.latestTimestamp),
        )

        if (latestRecord) {
          lagging.set(laggingConfig.id, {
            latestTimestamp: laggingConfig.latestTimestamp,
            latestValue: latestRecord,
          })
          amounts.push({ ...latestRecord, timestamp: targetTimestamp })
        }
      }
    }

    return {
      amounts,
      lagging,
      excluded: status.excluded,
    }
  }
}
