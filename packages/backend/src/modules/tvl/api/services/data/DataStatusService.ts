import { assert } from '@l2beat/backend-tools'
import { Database } from '@l2beat/database'
import {
  AmountConfigEntry,
  CirculatingSupplyEntry,
  EscrowEntry,
  PremintedEntry,
  TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'

export const CONSIDER_EXCLUDED_AFTER_DAYS = 7

export class DataStatusService {
  constructor(private readonly db: Database) {}

  async getAmountsStatus(
    configurations: (AmountConfigEntry & { configId: string })[],
    targetTimestamp: UnixTime,
  ) {
    const chainIndexersConfigurations = configurations.filter(
      (c): c is (EscrowEntry | TotalSupplyEntry) & { configId: string } =>
        c.type === 'escrow' || c.type === 'totalSupply',
    )

    const { lagging, excluded } = await this.getConfigurationsStatus(
      chainIndexersConfigurations,
      targetTimestamp,
    )

    const circulatingSupplyConfigs = configurations.filter(
      (c): c is CirculatingSupplyEntry & { configId: string } =>
        c.type === 'circulatingSupply',
    )

    const indexersState = await this.db.indexerState.getByIndexerIds(
      circulatingSupplyConfigs.map(
        (c) => `circulating_supply_indexer::${c.coingeckoId}`,
      ),
    )

    const processed = new Set<string>()
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

    const preminted = configurations.filter(
      (c): c is PremintedEntry & { configId: string } => c.type === 'preminted',
    )

    const indexersState2 = await this.db.indexerState.getByIndexerIds(
      preminted.map((c) => `preminted_indexer::${c.chain}_${c.address}`),
    )

    for (const indexer of indexersState2) {
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

    circulatingSupplyConfigs
      .filter((c) => !processed.has(c.configId))
      .forEach((u) => excluded.add(u.configId))

    preminted
      .filter((c) => !processed.has(c.configId))
      .forEach((u) => excluded.add(u.configId))

    return {
      excluded,
      lagging,
    }
  }

  async getConfigurationsStatus(
    configurations: { configId: string }[],
    targetTimestamp: UnixTime,
  ) {
    const excluded = new Set<string>()
    const lagging = []

    const configurationsState =
      await this.db.indexerConfiguration.getByConfigurationIds(
        configurations.map((c) => c.configId),
      )

    const processed = new Set<string>()
    for (const config of configurationsState) {
      processed.add(config.id)
      const syncStatus = config.currentHeight
        ? new UnixTime(config.currentHeight)
        : undefined
      // newly added configuration
      if (syncStatus === undefined) {
        excluded.add(config.id)
        continue
      }
      // fully synced configuration
      if (syncStatus.gte(targetTimestamp)) {
        continue
      }

      // phased out configuration - but we still want to display its data
      if (config.maxHeight && config.maxHeight === config.currentHeight) {
        continue
      }

      // decide whether it is excluded or lagging
      if (syncStatus.lt(getExclusionBoundary(targetTimestamp))) {
        excluded.add(config.id)
      } else {
        lagging.push({
          id: config.id,
          latestTimestamp: syncStatus,
        })
      }
    }

    if (processed.size !== configurations.length) {
      const unprocessed = configurations.filter(
        (c) => !processed.has(c.configId),
      )
      unprocessed.forEach((u) => excluded.add(u.configId))
    }

    return {
      excluded,
      lagging,
    }
  }
}

function getExclusionBoundary(targetTimestamp: UnixTime): UnixTime {
  return targetTimestamp.add(-CONSIDER_EXCLUDED_AFTER_DAYS, 'days')
}
