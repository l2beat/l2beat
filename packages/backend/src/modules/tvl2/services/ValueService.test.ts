import {
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { AmountId } from '../utils/createAmountId'
import { AssetId, createAssetId } from '../utils/createAssetId'
import { PriceId } from '../utils/createPriceId'
import { ValueService } from './ValueService'

import { MOCKS_FOR_TVL } from '../utils/test/mocks'

const { amountRecord, priceRecord, valueRecord, DECIMALS, USD_DECIMALS } =
  MOCKS_FOR_TVL

describe(ValueService.name, () => {
  it(ValueService.prototype.calculateTvlForTimestamps.name, async () => {
    const amountRepository = mockObject<AmountRepository>({
      getByConfigIdsInRange: async () => [
        amountRecord('a', 200),
        amountRecord('a', 300),
        amountRecord('b', 200), // this should be filtered out due to sinceTimestamp of CONFIG_B
        amountRecord('b', 300),
      ],
    })
    const priceRepository = mockObject<PriceRepository>({
      getByConfigIdsInRange: async () => [
        priceRecord('a', 200),
        priceRecord('a', 300),
        priceRecord('b', 200),
        priceRecord('b', 300),
      ],
    })

    const project: ProjectId = ProjectId('project')
    const source: string = 'chain'
    const CONFIG_A = mockObject<AmountConfigEntry>({
      sinceTimestamp: UnixTime.ZERO,
      address: EthereumAddress.random(),
      chain: 'chain',
      includeInTotal: true,
      decimals: DECIMALS,
      source: 'canonical',
    })
    const CONFIG_B = mockObject<AmountConfigEntry>({
      sinceTimestamp: new UnixTime(300),
      address: EthereumAddress.random(),
      chain: 'chain',
      includeInTotal: false,
      decimals: DECIMALS,
      source: 'external',
    })
    const amountConfigs: Map<AmountId, AmountConfigEntry> = new Map([
      ['a', CONFIG_A],
      ['b', CONFIG_B],
    ])
    const priceConfigIds: Map<AssetId, PriceId> = new Map([
      [createAssetId(CONFIG_A), 'a'],
      [createAssetId(CONFIG_B), 'b'],
    ])
    const timestamps: UnixTime[] = [
      new UnixTime(100),
      new UnixTime(200),
      new UnixTime(300),
    ]

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

    expect(result).toEqual([
      valueRecord(100),
      valueRecord(200, {
        canonical: 200n * 10n ** BigInt(USD_DECIMALS),
        canonicalForTotal: 200n * 10n ** BigInt(USD_DECIMALS),
      }),
      valueRecord(300, {
        canonical: 300n * 10n ** BigInt(USD_DECIMALS),
        canonicalForTotal: 300n * 10n ** BigInt(USD_DECIMALS),
        external: 300n * 10n ** BigInt(USD_DECIMALS),
      }),
    ])

    expect(amountRepository.getByConfigIdsInRange).toHaveBeenOnlyCalledWith(
      ['a', 'b'],
      new UnixTime(100),
      new UnixTime(300),
    )

    expect(priceRepository.getByConfigIdsInRange).toHaveBeenOnlyCalledWith(
      ['a', 'b'],
      new UnixTime(100),
      new UnixTime(300),
    )
  })
})
