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

  async getValuesForProjects(projects: ApiProject[], target: UnixTime) {
    const values = await this.$.valueRepository.getForProjects(
      projects.map((p) => p.id),
    )
    const valuesByProject = groupBy(values, 'projectId')

    const result: Dictionary<Dictionary<ValueRecord[]>> = {}

    for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
      const valuesByTimestamp = groupBy(projectValues, 'timestamp')
      const project = projects.find((p) => p.id === projectId)
      assert(project, `Project ${projectId.toString()} not found`)

      const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}

      for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
        if (!this.shouldTimestampBeCalculated(new UnixTime(+timestamp))) {
          continue
        }

        const configuredSources = getConfiguredSourcesForTimestamp(
          values,
          project,
          new UnixTime(+timestamp),
        )

        const onlyConfiguredValues = values.filter((v) =>
          configuredSources.includes(v.dataSource),
        )

        valuesByTimestampForProject[timestamp] = onlyConfiguredValues
      }

      // TODO: Interpolate here
      assert(
        valuesByTimestamp[target.toString()],
        `Missing value for last hour for ${projectId}, timestamp: ${target.toString}`,
      )

      result[projectId] = valuesByTimestampForProject
    }

    return result
  }

  async getPricesAndAmountsForToken(
    amountConfigIds: string[],
    priceConfigId: string,
    minTimestamp: UnixTime,
    target: UnixTime,
  ) {
    const amounts = await this.$.amountRepository.getByConfigIdsInRange(
      amountConfigIds,
      minTimestamp,
      target,
    )
    const prices = await this.$.priceRepository.getByConfigIdsInRange(
      [priceConfigId],
      minTimestamp,
      target,
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

  async getEthPrices(target: UnixTime) {
    const records = await this.$.priceRepository.getByConfigId(
      this.$.ethPriceId,
    )
    const prices = new Map(
      records.map((x) => [x.timestamp.toNumber(), x.priceUsd]),
    )
    assert(
      prices.get(target.toNumber()),
      `Missing latest price for ethereum @ ${target.toString()}`,
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

function getConfiguredSourcesForTimestamp(
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
