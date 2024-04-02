import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'

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
  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private readonly priceIndexer: { get safeHeight(): number },
    private readonly projects: Tvl2Project[],
  ) {}

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
    const records = await this.amountRepository.getByProjectIdAndTimestamp(
      project,
      timestamp,
    )

    const prices = await this.priceRepository.getByTimestamp(timestamp)

    const results = {
      canonical: 0,
      external: 0,
      native: 0,
    }
    for (const record of records) {
      const price = prices.find(
        (x) => x.chain === record.chain && x.address === record.address,
      )
      if (!price) {
        // TODO: better error handling.
        throw new Error(
          `Price not found for ${
            record.chain
          } ${record.address.toString()} @ ${timestamp.toNumber()}`,
        )
      }
      // TODO: divide by token decimals.
      results[record.origin] += Number(record.amount) * price.priceUsd
    }
    return results
  }
}
