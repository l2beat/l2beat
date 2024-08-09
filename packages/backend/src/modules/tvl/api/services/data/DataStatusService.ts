import { assert } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  CoingeckoPriceConfigEntry,
  EscrowEntry,
  PremintedEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'

export const CONSIDER_EXCLUDED_AFTER_DAYS = 7
type MultiIndexerEntry =
  | TotalSupplyEntry
  | EscrowEntry
  | CoingeckoPriceConfigEntry
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

    return {
      lagging: [
        ...configurations.lagging,
        ...preminted.lagging,
        ...circulating.lagging,
      ],
      excluded: new Set([
        ...configurations.excluded,
        ...preminted.excluded,
        ...circulating.excluded,
      ]),
    }
  }

  async getPremintedStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const processed = new Set<string>()
    const lagging = []
    const excluded = new Set<string>()

    const preminted = entries.filter(
      (c): c is PremintedEntry & { configId: string } => c.type === 'preminted',
    )

    const indexerState = await this.db.indexerState.getByIndexerIds(
      preminted.map((c) => `preminted_indexer::${c.chain}_${c.address}`),
    )

    for (const indexer of indexerState) {
      const premintedConfig = preminted.find(
        (cc) =>
          cc.chain.toString() ===
            indexer.indexerId.split('::')[1].split('_')[0] &&
          cc.address.toString() ===
            indexer.indexerId.split('::')[1].split('_')[1],
      )
      assert(
        premintedConfig,
        `Config should be defined for ${indexer.indexerId}`,
      )
      processed.add(premintedConfig.configId)

      const syncStatus = new UnixTime(indexer.safeHeight)
      if (syncStatus.gte(targetTimestamp)) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(premintedConfig.configId)
      } else {
        lagging.push({
          id: premintedConfig.configId,
          latestTimestamp: syncStatus,
        })
      }
    }

    const unprocessed = preminted.filter((c) => !processed.has(c.configId))
    unprocessed.forEach((u) => excluded.add(u.configId))

    return { excluded, lagging }
  }

  async getCirculatingSupplyStatus(
    entries: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const processed = new Set<string>()
    const lagging = []
    const excluded = new Set<string>()

    const circulatingSupplyConfigs = entries.filter(
      (c): c is CirculatingSupplyEntry & { configId: string } =>
        c.type === 'circulatingSupply',
    )

    const indexersState = await this.db.indexerState.getByIndexerIds(
      circulatingSupplyConfigs.map(
        (c) => `circulating_supply_indexer::${c.coingeckoId}`,
      ),
    )

    for (const indexer of indexersState) {
      const circulatingSupplyConfig = circulatingSupplyConfigs.find(
        (cc) => cc.coingeckoId.toString() === indexer.indexerId.split('::')[1],
      )
      assert(
        circulatingSupplyConfig,
        `Config should be defined for ${indexer.indexerId}`,
      )
      processed.add(circulatingSupplyConfig.configId)

      const syncStatus = new UnixTime(indexer.safeHeight)
      if (syncStatus.gte(targetTimestamp)) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(circulatingSupplyConfig.configId)
      } else {
        lagging.push({
          id: circulatingSupplyConfig.configId,
          latestTimestamp: syncStatus,
        })
      }
    }

    const unprocessed = circulatingSupplyConfigs.filter(
      (c) => !processed.has(c.configId),
    )
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
      (c) =>
        c.type === 'escrow' ||
        c.type === 'totalSupply' ||
        c.type === 'coingecko',
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

function toIndexerId(config: MultiIndexerEntry) {
  switch (config.type) {
    case 'coingecko':
      return `price_indexer::${config.coingeckoId.toString()}`
    case 'escrow':
    case 'totalSupply':
      return `chain_amount_indexer::${config.chain}`
  }
}

function getExclusionBoundary(targetTimestamp: UnixTime): UnixTime {
  return targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days')
}
