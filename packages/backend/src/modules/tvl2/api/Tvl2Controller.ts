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
import { createPriceId } from '../utils/createPriceId'

export interface Tvl2Project {
  id: ProjectId
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

type AmountConfigMap = Map<
  ProjectId,
  (AmountConfigEntry & { configId: string })[]
>

type PriceConfigIdMap = Map<string, string>

export class Tvl2Controller {
  private readonly amountConfig: AmountConfigMap
  private readonly priceConfigIds: PriceConfigIdMap
  private readonly projects: {
    id: ProjectId
    minTimestamp: UnixTime
  }[]
  private readonly minTimestamp: UnixTime

  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    projects: ProjectId[],
    config: Tvl2Config,
  ) {
    // We're calculating the configIds on startup to avoid doing it on every request.
    this.amountConfig = getAmountConfigMap(config)
    this.priceConfigIds = getPriceConfigIds(config)
    this.projects = projects.flatMap((id) => {
      const config = this.amountConfig.get(id)
      if (!config) {
        return []
      }
      assert(config, 'Config not found: ' + id.toString())
      const minTimestamp = config
        .map((x) => x.sinceTimestamp)
        .reduce((a, b) => UnixTime.min(a, b))
      return { id, minTimestamp }
    })
    this.minTimestamp = this.projects
      .map((x) => x.minTimestamp)
      .reduce((a, b) => UnixTime.min(a, b))
      .toEndOf('day')
  }

  async getTvl(maxTimestamp: UnixTime): Promise<Tvl2Result> {
    // TODO: we should return daily, sixHourly and hourly results.
    const result: Tvl2Result = {
      daily: [],
    }

    for (let t = this.minTimestamp; t.lte(maxTimestamp); t = t.add(1, 'days')) {
      result.daily.push(await this.getTvlAt(t))
    }
    return result
  }

  async getTvlAt(timestamp: UnixTime): Promise<Tvl2TimestampedResult> {
    const results: Record<string, Tvl2ProjectResult> = {}
    for (const project of this.projects) {
      if (timestamp.gte(project.minTimestamp)) {
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
    assert(projectConfigs, 'Config not found: ' + project.toString())

    const configIds = projectConfigs.map((x) => x.configId)
    const records = await this.amountRepository.getByConfigIdsAndTimestamp(
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
      const amountConfig = projectConfigs.find(
        (x) => x.configId === record.configId,
      )
      assert(amountConfig, 'Config not found')

      const priceId = this.priceConfigIds.get(createAssetId(amountConfig))
      const price = prices.find((x) => x.configId === priceId)
      assert(price, 'Price not found')

      const value = calculateValue({
        amount: record.amount,
        priceUsd: price.priceUsd,
        decimals: amountConfig.decimals,
      })

      results[amountConfig.source] += value
    }
    return results
  }

  async getTokenChart(
    token: { address: EthereumAddress | 'native'; chain: string },
    project: ProjectId,
  ) {
    const projectAmounts = this.amountConfig.get(project)
    if (!projectAmounts) return

    const assetId = createAssetId(token)
    const amountConfigs = projectAmounts.filter(
      (x) => createAssetId(x) === assetId,
    )

    const amounts = await this.amountRepository.getByConfigId(
      amountConfigs.map((x) => x.configId),
    )
    const priceId = this.priceConfigIds.get(assetId)
    assert(priceId, 'PriceId not found!')
    const prices = await this.priceRepository.getByConfigId(priceId)
    const pricesMap = new Map(
      prices.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )

    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const values: [number, number][] = []
    for (const [timestamp, amounts] of Object.entries(amountsByTimestamp)) {
      const price = pricesMap.get(Number(timestamp))
      assert(price, 'Programmer error ' + timestamp)
      const value = amounts.reduce((acc, curr) => {
        // not a fan of this solution,
        // but sometimes there's multiple amountConfigs
        const amountConfig = amountConfigs.find(
          (x) => x.configId === curr.configId,
        )
        assert(amountConfig, 'Amount config not found')
        const value = calculateValue({
          amount: curr.amount,
          priceUsd: price,
          decimals: amountConfig.decimals,
        })
        return acc + value
      }, 0)
      values.push([Number(timestamp), value])
    }

    return values
  }
}

const USD_DECIMALS = 2
function calculateValue({
  amount,
  priceUsd,
  decimals,
}: {
  amount: bigint
  priceUsd: number
  decimals: number
}) {
  const value = (Number(amount) * priceUsd) / 10 ** decimals

  // we want to expose the balance as an integer, keeping the USD decimal places
  // not sure it it's necessary to calculate cents when we calculate billions
  return Math.floor(value * 10 ** USD_DECIMALS)
}

function getAmountConfigMap(config: Tvl2Config) {
  const groupedEntries = Object.entries(groupBy(config.amounts, 'project'))
  const amountConfigEntries = groupedEntries.map(([k, v]) => {
    const projectId = ProjectId(k)
    const amountWithIds = v.map((x) => ({ ...x, configId: createAmountId(x) }))

    return [projectId, amountWithIds] as const
  })

  return new Map(amountConfigEntries)
}

function createAssetId(price: {
  address: EthereumAddress | 'native'
  chain: string
}): string {
  return `${price.chain}-${price.address.toString()}`
}

function getPriceConfigIds(config: Tvl2Config): PriceConfigIdMap {
  const result = new Map<string, string>()
  for (const p of config.prices) {
    result.set(createAssetId(p), createPriceId(p))
  }

  return result
}
