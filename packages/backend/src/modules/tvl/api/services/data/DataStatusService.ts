import {
  MultiIndexerEntry,
  getAggLayerIndexerId,
  getCirculatingSupplyIndexerId,
  getPremintedIndexerId,
  toIndexerId,
} from '@l2beat/config'
import { Database, IndexerStateRecord } from '@l2beat/database'
import {
  assert,
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  AmountConfigEntry,
  CirculatingSupplyEntry,
  CoingeckoPriceConfigEntry,
  PremintedEntry,
  UnixTime,
} from '@l2beat/shared-pure'

export const CONSIDER_EXCLUDED_AFTER_DAYS = 7

const MAX_CONFIGURATIONS_LENGTH_FOR_QUERY = 100

export class DataStatusService {
  constructor(private readonly db: Database) {}

  async getAmountsStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const configurations = await this.getConfigurationsStatus(
      entries,
      targetTimestamp,
    )

    const preminted = await this.getPremintedStatus(entries, targetTimestamp)

    const circulating = await this.getCirculatingSupplyStatus(
      entries,
      targetTimestamp,
    )

    const aggLayer = await this.getAgglayerStatus(entries, targetTimestamp)

    return {
      lagging: [
        ...configurations.lagging,
        ...preminted.lagging,
        ...circulating.lagging,
        ...aggLayer.lagging,
      ],
      excluded: new Set([
        ...configurations.excluded,
        ...preminted.excluded,
        ...circulating.excluded,
        ...aggLayer.excluded,
      ]),
    }
  }

  async getPremintedStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    return this.getStatus(
      entries.filter(
        (c): c is PremintedEntry & { configId: string } =>
          c.type === 'preminted',
      ),
      targetTimestamp,
      (c) => getPremintedIndexerId(c.chain, c.address),
      (indexer, entries) =>
        entries.find(
          (cc) =>
            cc.chain === indexer.indexerId.split('::')[1].split('_')[0] &&
            cc.address === indexer.indexerId.split('::')[1].split('_')[1],
        ),
    )
  }

  async getAgglayerStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    return this.getStatus(
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

  async getCirculatingSupplyStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    return this.getStatus(
      entries.filter(
        (c): c is CirculatingSupplyEntry & { configId: string } =>
          c.type === 'circulatingSupply',
      ),
      targetTimestamp,
      (c) => getCirculatingSupplyIndexerId(c.coingeckoId),
      (indexer, entries) =>
        entries.find(
          (cc) =>
            cc.coingeckoId.toString() === indexer.indexerId.split('::')[1],
        ),
    )
  }

  private async getStatus<T extends AmountConfigEntry & { configId: string }>(
    entries: T[],
    targetTimestamp: UnixTime,
    getIndexerId: (entry: T) => string,
    findConfig: (indexer: IndexerStateRecord, entries: T[]) => T | undefined,
  ) {
    const processed = new Set<string>()
    const lagging: { id: string; latestTimestamp: UnixTime }[] = []
    const excluded = new Set<string>()

    const indexerState = await this.db.indexerState.getByIndexerIds(
      entries.map(getIndexerId),
    )

    for (const indexer of indexerState) {
      const config = findConfig(indexer, entries)
      assert(config, `Config should be defined for ${indexer.indexerId}`)
      processed.add(config.configId)

      const syncStatus = new UnixTime(indexer.safeHeight)
      if (syncStatus.gte(targetTimestamp)) {
        continue
      }

      // TODO: what about max height?

      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(config.configId)
      } else {
        lagging.push({
          id: config.configId,
          latestTimestamp: syncStatus,
        })
      }
    }

    const unprocessed = entries.filter((c) => !processed.has(c.configId))
    unprocessed.forEach((u) => excluded.add(u.configId))

    return { excluded, lagging }
  }

  /** WARNING: It supports only TVL configurations for now */
  async getConfigurationsStatus(
    entries: ((AmountConfigEntry | CoingeckoPriceConfigEntry) & {
      configId: string
    })[],
    targetTimestamp: UnixTime,
  ) {
    const multiIndexerEntries = entries.filter(
      (c) => c.type !== 'circulatingSupply' && c.type !== 'preminted',
    )

    const configurations = await this.getConfigurations(multiIndexerEntries)

    const processed = new Set<string>()
    const lagging = []
    const excluded = new Set<string>()

    for (const c of configurations) {
      processed.add(c.id)

      const status = c.currentHeight ? new UnixTime(c.currentHeight) : undefined

      // newly added configuration
      if (status === undefined) {
        excluded.add(c.id)
        continue
      }
      // fully synced configuration
      if (status.gte(targetTimestamp)) {
        continue
      }

      // phased out configuration - but we still want to display its data
      if (c.maxHeight && c.maxHeight === c.currentHeight) {
        continue
      }

      // decide whether it is excluded or lagging
      if (status.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(c.id)
      } else {
        lagging.push({
          id: c.id,
          latestTimestamp: status,
        })
      }
    }

    const unprocessed = multiIndexerEntries.filter(
      (c) => !processed.has(c.configId),
    )
    unprocessed.forEach((u) => excluded.add(u.configId))

    return {
      excluded,
      lagging,
    }
  }

  async getConfigurations(
    entries: (MultiIndexerEntry & { configId: string })[],
  ) {
    if (entries.length <= MAX_CONFIGURATIONS_LENGTH_FOR_QUERY) {
      return await this.db.indexerConfiguration.getByConfigurationIds(
        entries.map((c) => c.configId),
      )
    }

    const indexerIds = [...new Set(entries.map(toIndexerId)).values()]

    const configurations =
      await this.db.indexerConfiguration.getByIndexerIds(indexerIds)

    const requestedIds = new Set(entries.map((c) => c.configId))

    return configurations.filter((c) => requestedIds.has(c.id))
  }
}

function getExclusionBoundary(targetTimestamp: UnixTime): UnixTime {
  return targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days')
}
