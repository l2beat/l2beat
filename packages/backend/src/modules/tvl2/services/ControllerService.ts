import { assert, Logger } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

import { Dictionary, groupBy } from 'lodash'
import { ApiProject } from '../api/Tvl2Controller'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord, ValueRepository } from '../repositories/ValueRepository'
import { SyncOptimizer } from '../utils/SyncOptimizer'

export interface ControllerServiceDependencies {
  readonly valueRepository: ValueRepository
  readonly amountRepository: AmountRepository
  readonly priceRepository: PriceRepository
  readonly syncOptimizer: SyncOptimizer
  logger: Logger
}

export class ControllerService {
  constructor(private readonly $: ControllerServiceDependencies) {
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

    const projectsMinTimestamp = projects
      .map((x) => x.minTimestamp)
      .reduce((acc, curr) => UnixTime.min(acc, curr), UnixTime.now())

    const minTimestamp = projectsMinTimestamp.toEndOf('day')

    return {
      valuesByProjectByTimestamp,
      dailyStart: minTimestamp,
      sixHourlyStart: UnixTime.max(
        this.$.syncOptimizer.sixHourlyCutOff,
        minTimestamp,
      ).toEndOf('day'),
      hourlyStart: UnixTime.max(
        this.$.syncOptimizer.hourlyCutOff,
        minTimestamp,
      ),
    }
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
    const timestamps = this.getTimestamps(
      minTimestamp,
      sixHourlyCutOff,
      hourlyCutOff,
      lastHour,
    )

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

  private getTimestamps(
    minTimestamp: UnixTime,
    sixHourlyCutOff: UnixTime,
    hourlyCutOff: UnixTime,
    lastHour: UnixTime,
  ): UnixTime[] {
    const timestamps: UnixTime[] = []

    let t = minTimestamp.toEndOf('day')
    timestamps.push(t)

    while (t.add(1, 'days').lte(sixHourlyCutOff)) {
      t = t.add(1, 'days')
      timestamps.push(t)
    }

    while (t.add(6, 'hours').lte(hourlyCutOff)) {
      t = t.add(6, 'hours')
      timestamps.push(t)
    }

    while (t.add(1, 'hours').lte(lastHour)) {
      t = t.add(1, 'hours')
      timestamps.push(t)
    }
    return timestamps
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
