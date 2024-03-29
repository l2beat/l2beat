import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'

export class Tvl2Controller {
  constructor(
    private readonly amountRepository: AmountRepository,
    private readonly priceRepository: PriceRepository,
    private projects: ProjectId[],
  ) {}

  async getTvl() {
    const now = UnixTime.now().toStartOf('hour')
    const results: Record<
      string,
      { canonical: number; external: number; native: number }
    > = {}
    for (const project of this.projects) {
      results[project.toString()] = await this.getProjectTvl(project, now)
    }
    return results
  }

  async getProjectTvl(project: ProjectId, timestamp: UnixTime) {
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
          `Price not found for ${record.chain} ${record.address} @ ${timestamp}`,
        )
      }
      // TODO: divide by token decimals.
      results[record.origin] += Number(record.amount) * price.priceUsd
    }
    return results
  }
}
