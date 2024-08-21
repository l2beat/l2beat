import { type Database } from '@l2beat/database'
import { type AmountConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { type Dictionary, groupBy } from 'lodash'
import { type Clock } from './Clock'
import { type DataStatusService } from './DataStatusService'

interface Dependencies {
  readonly db: Database
  readonly dataStatusService: DataStatusService
  readonly clock: Clock
}

export class AmountsDataService {
  constructor(private readonly $: Dependencies) {}

  async getAggregatedAmounts(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const minTimestamp = configurations.reduce(
      (a, b) => UnixTime.min(a, b.sinceTimestamp),
      UnixTime.now(),
    )

    const amountRecords = await this.$.db.amount.getByConfigIdsInRange(
      configurations.map((c) => c.configId),
      minTimestamp,
      targetTimestamp,
    )
    const status = await this.$.dataStatusService.getAmountsStatus(
      configurations,
      targetTimestamp,
    )

    const amountsByTimestamp = groupBy(amountRecords, 'timestamp')

    const timestamps = this.$.clock.getAllTimestampsForApi(targetTimestamp, {
      minTimestampOverride: minTimestamp,
    })

    const aggregatedByTimestamp: Dictionary<bigint> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()] ?? []

      const interpolatedRecords = status.lagging
        .filter((l) => timestamp.gt(l.latestTimestamp))
        .map((l) => {
          const amount =
            amountsByTimestamp[l.latestTimestamp.toString()]?.find(
              (a) => a.configId === l.id,
            )?.amount ?? 0n
          return { amount }
        })

      const aggregatedAmount = [
        ...amounts.filter((a) => !status.excluded.has(a.configId)),
        ...interpolatedRecords,
      ].reduce((acc, curr) => acc + curr.amount, 0n)

      aggregatedByTimestamp[timestamp.toString()] = aggregatedAmount
    }

    return {
      amounts: aggregatedByTimestamp,
      laggingFrom: new Map<string, UnixTime>(
        status.lagging.map((l) => [l.id, l.latestTimestamp]),
      ),
      excluded: status.excluded,
    }
  }

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
