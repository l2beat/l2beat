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

export class DatabaseReadingService {
  constructor(private readonly $: Dependencies) {
    this.$.logger = $.logger.for(this)
  }

  async getValuesForProjects(projects: ApiProject[], lastHour: UnixTime) {
    const values = await this.$.valueRepository.getForProjects(
      projects.map((p) => p.id),
    )

    const valuesToSync = filterTimestamps(
      values,
      this.$.syncOptimizer.sixHourlyCutOff,
      this.$.syncOptimizer.hourlyCutOff,
    )

    const valuesByProject = groupBy(valuesToSync, 'projectId')

    const valuesByProjectByTimestamp: Dictionary<Dictionary<ValueRecord[]>> = {}

    for (const [projectId, valueByProject] of Object.entries(valuesByProject)) {
      const vv = groupBy(valueByProject, 'timestamp')
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const filteredValues = filterSources(vv, project)

      // TODO: Interpolate here
      assert(
        vv[lastHour.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${lastHour.toString}`,
      )

      valuesByProjectByTimestamp[projectId] = filteredValues
    }

    return valuesByProjectByTimestamp
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
}

export function filterSources(
  vv: Dictionary<ValueRecord[]>,
  project: ApiProject,
) {
  return Object.fromEntries(
    Object.entries(vv).map(([timestamp, values]) => {
      const configuredSources = getConfiguredSources(
        values,
        project,
        new UnixTime(+timestamp),
      )

      // TODO; add log here that we have too much data in the db

      return [
        timestamp,
        values.filter((v) => configuredSources.includes(v.dataSource)),
      ]
    }),
  )
}

export function filterTimestamps(
  values: ValueRecord[],
  sixHourlyCutOff: UnixTime,
  hourlyCutOff: UnixTime,
) {
  return values.filter((value) => {
    if (value.timestamp.isFull('day')) {
      return true
    }

    if (value.timestamp.isFull('six hours')) {
      return value.timestamp.gte(sixHourlyCutOff)
    }

    if (value.timestamp.isFull('hour')) {
      return value.timestamp.gte(hourlyCutOff)
    }
  })
}

function getConfiguredSources(
  values: ValueRecord[],
  project: ApiProject,
  timestamp: UnixTime,
) {
  const valuesSources = values.map((x) => x.dataSource)
  const configuredSources = Array.from(project.sources.values())
    .filter((s) => s.minTimestamp.lte(timestamp))
    .map((s) => s.name)

  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  // TODO: Interpolate here
  assert(
    missingSources.length === 0,
    `Missing data sources [${missingSources.join(
      ', ',
    )}] for ${project.id.toString()} at ${timestamp.toNumber()}`,
  )
  return configuredSources
}
