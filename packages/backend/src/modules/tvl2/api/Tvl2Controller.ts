import {
  assert,
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { groupBy } from 'lodash'

import { Tvl2Config } from '../../../config/Config'
import { calculateValue } from '../indexers/ValueIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRepository } from '../repositories/ValueRepository'
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
  canonical: string
  external: string
  native: string
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
    private readonly valueRepository: ValueRepository,
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

  async getTvl(): Promise<Tvl2Result> {
    // TODO: we should return daily, sixHourly and hourly results.
    const result: Tvl2Result = {
      daily: [],
    }

    const projects = this.projects.map((x) => x.id)
    const dailyValues = await this.valueRepository.getDailyForProjects(projects)
    const dailyValuesByTimestamp = groupBy(dailyValues, 'timestamp')
    for (const [timestamp, values] of Object.entries(dailyValuesByTimestamp)) {
      const valuesByProject = groupBy(values, 'projectId')
      const projects: Record<string, Tvl2ProjectResult> = {}
      for (const [projectId, values] of Object.entries(valuesByProject)) {
        const result = values.reduce(
          (acc, curr) => {
            acc.canonical += curr.canonical
            acc.external += curr.external
            acc.native += curr.native
            return acc
          },
          { canonical: 0n, external: 0n, native: 0n },
        )
        projects[projectId] = {
          canonical: result.canonical.toString(),
          external: result.external.toString(),
          native: result.native.toString(),
        }
      }
      result.daily.push({
        timestamp: Number(timestamp),
        projects,
      })
    }

    return result
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

    const amounts = await this.amountRepository.getDailyByConfigId(
      amountConfigs.map((x) => x.configId),
    )
    const priceId = this.priceConfigIds.get(assetId)
    assert(priceId, 'PriceId not found!')
    const prices = await this.priceRepository.getDailyByConfigId(priceId)
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
      }, 0n)
      values.push([Number(timestamp), Number(value)])
    }

    return values
  }
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
