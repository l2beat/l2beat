import {
  AmountConfigEntry,
  assert,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { createAmountId } from '../utils/createAmountId'

interface Tvl2Project {
  id: ProjectId
  minTimestamp: UnixTime
  indexers: { get safeHeight(): number }[]
}

interface Tvl2Result {
  daily: Tvl2TimestampedResult[]
}

interface Tvl2TimestampedResult {
  timestamp: number
  projects: Record<string, Tvl2ProjectResult>
}

interface Tvl2ProjectResult {
  canonical: number
  external: number
  native: number
}

export class Tvl2Controller {
  private readonly amountConfig: Map<
    ProjectId,
    (AmountConfigEntry & { configId: string })[]
  >
  private readonly priceConfig: Map<string, number>

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly priceIndexer: { get safeHeight(): number },
    private readonly projects: Tvl2Project[],
    config: Tvl2Config,
  ) {
    const amountConfigEntries = Object.entries(
      groupBy(config.amounts, 'project'),
    ).map(
      ([k, v]) =>
        [
          ProjectId(k),
          v.map((x) => ({ ...x, configId: createAmountId(x) })),
        ] as const,
    )
    this.amountConfig = new Map(amountConfigEntries)
    this.priceConfig = new Map(
      config.prices.map((x) => [createAssetId(x), x.decimals]),
    )
  }

  async getTvl(): Promise<Tvl2Result> {
    const minTimestamp = this.projects
      .map((x) => x.minTimestamp)
      .reduce((a, b) => UnixTime.min(a, b))
      .toEndOf('day')

    const maxTimestamp = this.projects
      .flatMap((x) => x.indexers)
      .map((x) => new UnixTime(x.safeHeight))
      .concat(new UnixTime(this.priceIndexer.safeHeight))
      .reduce((a, b) => UnixTime.min(a, b))
      .toStartOf('day')

    const result: Tvl2Result = {
      daily: [],
    }
    for (let t = minTimestamp; t.lte(maxTimestamp); t = t.add(1, 'days')) {
      result.daily.push(await this.getTvlAt(t))
    }
    return result
  }

  async getTvlAt(timestamp: UnixTime): Promise<Tvl2TimestampedResult> {
    const results: Record<string, Tvl2ProjectResult> = {}
    for (const project of this.projects) {
      const maxTimestamp = project.indexers
        .map((x) => x.safeHeight)
        .concat(this.priceIndexer.safeHeight)
        .reduce((a, b) => Math.min(a, b))

      if (
        timestamp.gte(project.minTimestamp) &&
        timestamp.toNumber() <= maxTimestamp
      ) {
        results[project.id.toString()] = await this.getProjectTvl(
          project.id,
          timestamp,
        )
      }
    }
    return {
      timestamp: timestamp.toNumber(),
      projects: results,
    }
  }

  async getProjectTvl(
    project: ProjectId,
    timestamp: UnixTime,
  ): Promise<Tvl2ProjectResult> {
    const projectConfigs = this.amountConfig.get(project)

    assert(projectConfigs, 'Config not found')
    const configIds = projectConfigs.map((x) => x.configId)
    const records = await this.amountRepository.getByProjectIdAndTimestamp(
      configIds,
      timestamp,
    )

    const prices = await this.priceRepository.getByTimestamp(timestamp)

    const results = {
      canonical: 0,
      external: 0,
      native: 0,
    }
    for (const record of records) {
      // todo: if we sort by config id we can avoid this lookup.
      // and just use the index.
      const amountConfig = projectConfigs.find(
        (x) => x.configId === record.configId,
      )
      assert(amountConfig, 'Amount config not found')
      const assetId = createAssetId({
        address: amountConfig.address,
        chain: amountConfig.chain,
      })
      const price = prices.find((x) => createAssetId(x) === assetId)
      assert(price, 'Price not found')

      const decimals = this.priceConfig.get(assetId)
      assert(decimals, 'Decimals not found')

      results[amountConfig.source] +=
        (Number(record.amount) * price.priceUsd) / decimals
    }
    return results
  }
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}
