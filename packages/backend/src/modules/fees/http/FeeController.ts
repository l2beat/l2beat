import { assert } from '@l2beat/backend-tools'
import { CoingeckoQueryService } from '@l2beat/shared'
import { CoingeckoId, L2FeesApiResponse, UnixTime } from '@l2beat/shared-pure'

import { Project } from '../../../model/Project'
import { GasPriceRepository } from '../repositories/GasPriceRepository'

export class FeeController {
  public constructor(
    private readonly gasPriceRepository: GasPriceRepository,
    private readonly priceService: CoingeckoQueryService,

    private readonly projects: Project[],
  ) {}

  async getFees(): Promise<L2FeesApiResponse> {
    const projects = this.projects.filter((p) => !p.isArchived)
    const priceFrom = UnixTime.now()
    const priceTo = priceFrom.add(-14, 'days')
    const ethPrices = await this.priceService.getUsdPriceHistoryHourly(
      CoingeckoId('ethereum'),
      priceFrom,
      priceTo,
    )

    const promises = projects.map(async (project) => {
      const gasPrices = await this.gasPriceRepository.findByProject(
        project.projectId,
      )

      const remappedPrices = gasPrices.map((price) => {
        const ethPrice = ethPrices.find(
          (ep) => ep.timestamp === price.timestamp,
        )

        assert(ethPrice, `Missing eth price for ${+price.timestamp}`)

        const gasPriceEth = price.gasPriceGwei / 1e9
        const gasPriceUsd = gasPriceEth * ethPrice.value

        return {
          project: project.projectId,
          timestamp: price.timestamp.toNumber(),
          gasPriceGwei: price.gasPriceGwei,
          gasPriceUsd: gasPriceUsd,
        }
      })

      return {
        [project.projectId]: remappedPrices.map((rp) => [
          rp.timestamp,
          rp.gasPriceGwei,
          rp.gasPriceUsd,
        ]),
      }
    })

    const awaited = await Promise.all(promises)

    return {
      // FIX This shit
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      projects: awaited as unknown as any,
    }
  }
}
