import { Logger } from '@l2beat/backend-tools'
import {
  Configuration,
  IndexerOptions,
  MultiIndexer,
  RemovalConfiguration,
  SavedConfiguration,
  UpdateConfiguration,
} from '@l2beat/uif'

import { HourlyIndexer } from '../HourlyIndexer'
import { ONE_HOUR_MS } from '../utils'
import { PriceConfig } from './PriceConfig'
import { PriceIndexerRepository } from './PriceIndexerRepository'
import { PriceRepository } from './PriceRepository'
import { PriceService } from './PriceService'

export class PriceIndexer extends MultiIndexer<PriceConfig> {
  private readonly apiId: string

  constructor(
    private readonly indexerId: string,
    private readonly priceService: PriceService,
    private readonly priceRepository: PriceRepository,
    private readonly priceIndexerRepository: PriceIndexerRepository,
    hourlyIndexer: HourlyIndexer,
    logger: Logger,
    configurations: Configuration<PriceConfig>[],
    options?: IndexerOptions,
  ) {
    super(logger, [hourlyIndexer], configurations, options)
    this.apiId = getCommonApiId(configurations)
  }

  override async multiInitialize(): Promise<SavedConfiguration<PriceConfig>[]> {
    return this.priceIndexerRepository.load(this.indexerId)
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: UpdateConfiguration<PriceConfig>[],
  ): Promise<number> {
    // we only query 24 hours at a time
    const adjustedTo = Math.min(to, from + 23)

    const prices = await this.priceService.getHourlyPrices(
      this.apiId,
      from * ONE_HOUR_MS,
      adjustedTo * ONE_HOUR_MS,
    )

    const dataToSave = configurations
      // TODO: don't update currentHeight for configs that have data
      // TODO: test data downloaded to middle of the range
      .filter((c) => !c.hasData)
      .flatMap((configuration) => {
        return prices.map(({ timestamp, price }) => ({
          tokenSymbol: configuration.properties.tokenSymbol,
          timestamp,
          price,
        }))
      })
    await this.priceRepository.save(dataToSave)

    return adjustedTo
  }

  override async removeData(
    configurations: RemovalConfiguration<PriceConfig>[],
  ): Promise<void> {
    for (const c of configurations) {
      await this.priceRepository.deletePrices(
        c.properties.tokenSymbol,
        c.from,
        c.to,
      )
    }
  }

  override async saveConfigurations(
    configurations: SavedConfiguration<PriceConfig>[],
  ): Promise<void> {
    return this.priceIndexerRepository.save(this.indexerId, configurations)
  }
}

function getCommonApiId(configurations: Configuration<PriceConfig>[]): string {
  const apiId = configurations[0]?.properties.apiId
  if (!apiId) {
    throw new Error('At least one configuration is required')
  }
  if (configurations.some((c) => c.properties.apiId !== apiId)) {
    throw new Error('All configurations must have the same apiId')
  }
  return apiId
}
