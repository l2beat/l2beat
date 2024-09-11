import { AmountId, AssetId, PriceId, createAssetId } from '@l2beat/config'
import { Database } from '@l2beat/database'
import {
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { MOCKS_FOR_TVL } from '../utils/test/mocks'
import { ValueService } from './ValueService'

const { amountRecord, priceRecord, valueRecord, DECIMALS, USD_DECIMALS } =
  MOCKS_FOR_TVL

describe(ValueService.name, () => {
  it(ValueService.prototype.calculateTvlForTimestamps.name, async () => {
    const amountRepository = mockObject<Database['amount']>({
      getByConfigIdsInRange: async () => [
        amountRecord('a', 200),
        amountRecord('a', 300),
        amountRecord('b', 200), // this should be filtered out due to sinceTimestamp of CONFIG_B
        amountRecord('b', 300),
      ],
    })
    const priceRepository = mockObject<Database['price']>({
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
      isAssociated: false,
      category: 'ether',
    })
    const CONFIG_B = mockObject<AmountConfigEntry>({
      sinceTimestamp: new UnixTime(300),
      address: EthereumAddress.random(),
      chain: 'chain',
      includeInTotal: false,
      decimals: DECIMALS,
      source: 'external',
      isAssociated: false,
      category: 'stablecoin',
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

    const service = new ValueService(
      mockObject<Database>({
        price: priceRepository,
        amount: amountRepository,
      }),
    )

    const result = await service.calculateTvlForTimestamps(
      project,
      source,
      amountConfigs,
      priceConfigIds,
      timestamps,
    )

    expect(result).toEqual([
      valueRecord({ timestamp: new UnixTime(100) }),
      valueRecord({
        timestamp: new UnixTime(200),
        canonical: 200n * 10n ** BigInt(USD_DECIMALS),
        canonicalForTotal: 200n * 10n ** BigInt(USD_DECIMALS),
        ether: 200n * 10n ** BigInt(USD_DECIMALS),
      }),
      valueRecord({
        timestamp: new UnixTime(300),
        canonical: 300n * 10n ** BigInt(USD_DECIMALS),
        canonicalForTotal: 300n * 10n ** BigInt(USD_DECIMALS),
        external: 300n * 10n ** BigInt(USD_DECIMALS),
        ether: 300n * 10n ** BigInt(USD_DECIMALS),
        stablecoin: 300n * 10n ** BigInt(USD_DECIMALS),
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
