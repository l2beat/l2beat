import { AmountConfigEntry, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { AmountId } from '../utils/createAmountId'
import { AssetId } from '../utils/createAssetId'
import { PriceId } from '../utils/createPriceId'
import { ValueService } from './ValueService'

describe(ValueService.name, () => {
  it(ValueService.prototype.calculateTvlForTimestamps.name, async () => {
    const priceRepository: PriceRepository = mockObject<PriceRepository>({})
    const amountRepository: AmountRepository = mockObject<AmountRepository>({})

    const project: ProjectId = ProjectId('project')
    const source: string = 'chain'
    const amountConfigs: Map<AmountId, AmountConfigEntry> = new Map()
    const priceConfigIds: Map<AssetId, PriceId> = new Map()
    const timestamps: UnixTime[] = []

    const service = new ValueService({
      priceRepository,
      amountRepository,
    })

    const result = await service.calculateTvlForTimestamps(
      project,
      source,
      amountConfigs,
      priceConfigIds,
      timestamps,
    )

    expect(result).toEqual([])
  })
})
