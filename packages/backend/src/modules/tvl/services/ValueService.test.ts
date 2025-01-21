import type { AmountId, PriceId } from '@l2beat/backend-shared'
import type { Database } from '@l2beat/database'
import {
  type AmountConfigEntry,
  AssetId,
  EthereumAddress,
  ProjectId,
  type TotalSupplyEntry,
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
    const addressA = EthereumAddress.random()
    const CONFIG_A = mockObject<TotalSupplyEntry>({
      assetId: AssetId.create('chain', addressA),
      sinceTimestamp: UnixTime.ZERO,
      address: addressA,
      chain: 'chain',
      includeInTotal: true,
      untilTimestamp: undefined,
      decimals: DECIMALS,
      source: 'canonical',
      isAssociated: false,
      category: 'ether',
    })
    const addressB = EthereumAddress.random()
    const CONFIG_B = mockObject<TotalSupplyEntry>({
      assetId: AssetId.create('chain', addressB),
      sinceTimestamp: new UnixTime(300),
      address: addressB,
      chain: 'chain',
      includeInTotal: false,
      untilTimestamp: undefined,
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
      [AssetId.create(CONFIG_A.chain, CONFIG_A.address), 'a'],
      [AssetId.create(CONFIG_B.chain, CONFIG_B.address), 'b'],
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
