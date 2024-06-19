import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { AmountRepository } from '../../repositories/AmountRepository'
import { PriceRepository } from '../../repositories/PriceRepository'
import {
  ValueRecord,
  ValueRepository,
} from '../../repositories/ValueRepository'
import { SyncOptimizer } from '../../utils/SyncOptimizer'
import { PriceId } from '../../utils/createPriceId'
import { ApiProject } from '../utils/types'

interface Dependencies {
  readonly valueRepository: ValueRepository
  readonly amountRepository: AmountRepository
  readonly priceRepository: PriceRepository
  readonly syncOptimizer: SyncOptimizer
  readonly ethPriceId: PriceId
  logger: Logger
}

export class DataService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getValuesForProjects(
    projects: ApiProject[],
    targetTimestamp: UnixTime,
  ) {
    const values = await this.$.valueRepository.getForProjects(
      projects.map((p) => p.id),
    )
    const valuesByProject = groupBy(values, 'projectId')

    const result = {
      valuesByTimestampForProject: {} as Dictionary<Dictionary<ValueRecord[]>>,
      lagging: new Map<
        string,
        { latestTimestamp: UnixTime; latestValue: ValueRecord }
      >(),
      syncing: new Set<string>(),
    }

    for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
      const valuesByTimestamp = groupBy(projectValues, 'timestamp')
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const { lagging, syncing } = getLaggingAndSyncing(
        valuesByTimestamp,
        targetTimestamp,
        project,
      )

      lagging.forEach((l) => result.lagging.set(l.source, { ...l }))
      syncing.forEach((s) => result.syncing.add(s))

      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}

      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        if (!this.shouldTimestampBeCalculated(new UnixTime(+timestamp))) {
          continue
        }

        const configuredValues = getConfiguredValuesForTimestamp(
          values,
          project,
          new UnixTime(+timestamp),
          result.lagging,
          result.syncing,
        )

        valuesByTimestampForProject[timestamp] = configuredValues
      }

      // TODO: Interpolate here
      assert(
        valuesByTimestamp[targetTimestamp.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${targetTimestamp.toString}`,
      )

      result.valuesByTimestampForProject[projectId] =
        valuesByTimestampForProject
    }

    return result
  }

  async getPricesAndAmountsForToken(
    amountConfigIds: string[],
    priceConfigId: string,
    minTimestamp: UnixTime,
    lastHour: UnixTime,
  ) {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      amountConfigIds,
      minTimestamp,
      lastHour,
    )
    const prices = await this.$.priceRepository.getByConfigIdsInRange(
      [priceConfigId],
      minTimestamp,
      lastHour,
    )
    const amountsByTimestamp = groupBy(amounts, 'timestamp')

    const pricesByTimestamp: Dictionary<number> = Object.fromEntries(
      prices.map((p) => [p.timestamp.toString(), p.priceUsd]),
    )

    const hourlyCutOff = this.$.syncOptimizer.hourlyCutOff
    const sixHourlyCutOff = this.$.syncOptimizer.sixHourlyCutOff
    // TODO: move to sync optimizer
    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()

    const amountsAndPrices: Dictionary<{ amount: bigint; price: number }> = {}
    for (const timestamp of timestamps) {
      const amounts = amountsByTimestamp[timestamp.toString()]
      const price = pricesByTimestamp[timestamp.toString()]
      // TODO: If we interpolate, do it here
      const amount = amounts?.reduce((acc, curr) => acc + curr.amount, 0n)
      amountsAndPrices[timestamp.toString()] = {
        amount: amount ?? 0n,
        price: price ?? 0,
      }
    }

    return {
      amountsAndPrices,
      hourlyStart: UnixTime.max(hourlyCutOff, minTimestamp).toEndOf('hour'),
      sixHourlyStart: UnixTime.max(sixHourlyCutOff, minTimestamp).toEndOf(
        'six hours',
      ),
      dailyStart: minTimestamp.toEndOf('day'),
    }
  }

  async getEthPrices() {
    const records = await this.$.priceRepository.getByConfigId(
      this.$.ethPriceId,
    )
    const prices = new Map(
      records.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )
    const timestamps = this.$.syncOptimizer.getAllTimestampsToSync()

    assert(
      timestamps.every((x) => prices.has(x.toNumber())),
      `Missing prices for ethereum`,
    )
    return prices
  }

  async getPricesByConfigIdsAndTimestamp(
    priceConfigIds: string[],
    timestamp: UnixTime,
  ) {
    const prices = await this.$.priceRepository.getByConfigIdsAndTimestamp(
      priceConfigIds,
      timestamp,
    )

    // TODO: interpolate here
    assert(
      prices.length === priceConfigIds.length,
      `Missing prices for ${timestamp.toNumber()}`,
    )

    return prices
  }

  async getAmountsByConfigIdsAndTimestamp(
    configIds: string[],
    timestamp: UnixTime,
  ) {
    // TODO: what to do when there are missing values?
    return await this.$.amountRepository.getByConfigIdsAndTimestamp(
      configIds,
      timestamp,
    )
  }

  shouldTimestampBeCalculated(timestamp: UnixTime) {
    if (timestamp.isFull('day')) {
      return true
    }

    if (timestamp.isFull('six hours')) {
      return timestamp.gte(this.$.syncOptimizer.sixHourlyCutOff)
    }

    if (timestamp.isFull('hour')) {
      return timestamp.gte(this.$.syncOptimizer.hourlyCutOff)
    }
  }
}

function getConfiguredValuesForTimestamp(
  values: ValueRecord[],
  project: ApiProject,
  timestamp: UnixTime,
  lagging: Map<string, { latestTimestamp: UnixTime; latestValue: ValueRecord }>,
  syncing: Set<string>,
) {
  const configuredSources = Array.from(project.sources.values())
    .filter((s) => s.minTimestamp.lte(timestamp))
    .filter((s) => !syncing.has(`${project.id}-${s.name}`))
    .map((s) => s.name)

  const configuredValues = values.filter((v) =>
    configuredSources.includes(v.dataSource),
  )

  const valuesSources = values.map((x) => x.dataSource)
  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  for (const source of missingSources) {
    const laggingEntry = lagging.get(`${project.id}-${source}`)
    assert(laggingEntry, `Missing lagging entry for ${project.id}-${source}`)

    configuredValues.push({
      ...laggingEntry.latestValue,
      timestamp: timestamp,
    })
  }

  return configuredValues
}

function getLaggingAndSyncing(
  valuesByTimestamp: Dictionary<ValueRecord[]>,
  targetTimestamp: UnixTime,
  project: ApiProject,
) {
  const lagging: {
    source: string
    latestTimestamp: UnixTime
    latestValue: ValueRecord
  }[] = []
  const syncing: string[] = []

  const latestValues = valuesByTimestamp[targetTimestamp.toString()]

  const configuredSources = Array.from(project.sources.values())

  for (const source of configuredSources) {
    const v = latestValues.find((v) => v.dataSource === source.name)

    if (v) {
      continue
    }

    if (v === undefined) {
      syncing.push(`${project.id}-${source.name}`)
      continue
    }

    const vv = valuesByTimestamp[
      targetTimestamp.add(-7, 'days').toString()
    ].find((v) => v.dataSource === source.name)

    if (vv === undefined) {
      syncing.push(`${project.id}-${source.name}`)
      continue
    }

    for (
      let i = targetTimestamp.add(-1, 'hours').toNumber();
      i <= targetTimestamp.add(-7, 'days').toNumber();
      i += 3600
    ) {
      const vvv = valuesByTimestamp[i.toString()].find(
        (v) => v.dataSource === source.name,
      )

      if (vvv) {
        lagging.push({
          source: `${project.id}-${source.name}`,
          latestTimestamp: new UnixTime(i),
          latestValue: vvv,
        })
      }
    }
  }

  return {
    lagging,
    syncing,
  }
}
