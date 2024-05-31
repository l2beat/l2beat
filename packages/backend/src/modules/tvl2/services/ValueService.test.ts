import {
  AmountConfigEntry,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { ValueRecord } from '../repositories/ValueRepository'
import { AmountId } from '../utils/createAmountId'
import { AssetId, createAssetId } from '../utils/createAssetId'
import { PriceId } from '../utils/createPriceId'
import { ValueService } from './ValueService'

describe(ValueService.name, () => {
  it(ValueService.prototype.calculateTvlForTimestamps.name, async () => {
    const amountRepository = mockObject<AmountRepository>({
      getByConfigIdsInRange: async () => [
        amount('a', 200),
        amount('a', 300),
        amount('b', 200), // this should be filtered out due to sinceTimestamp of CONFIG_B
        amount('b', 300),
      ],
    })
    const priceRepository = mockObject<PriceRepository>({
      getByConfigIdsInRange: async () => [
        price('a', 200),
        price('a', 300),
        price('b', 200),
        price('b', 300),
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
      value(100),
      value(200, {
        canonical: 200n * 10n ** BigInt(USD_DECIMALS),
        canonicalForTotal: 200n * 10n ** BigInt(USD_DECIMALS),
      }),
      value(300, {
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

const DECIMALS = 18
const USD_DECIMALS = 2

function amount(configId: string, timestamp: number) {
  return {
    configId: configId,
    timestamp: new UnixTime(timestamp),
    amount: BigInt(timestamp) * 10n ** BigInt(DECIMALS),
  }
}

function price(id: string, timestamp: number) {
  return {
    configId: id,
    timestamp: new UnixTime(timestamp),
    priceUsd: 1,
  }
}

function value(timestamp: number, v?: Partial<ValueRecord>) {
  return {
    projectId: ProjectId('project'),
    dataSource: 'chain',
    timestamp: new UnixTime(timestamp),
    canonical: 0n,
    canonicalForTotal: 0n,
    external: 0n,
    externalForTotal: 0n,
    native: 0n,
    nativeForTotal: 0n,
    ...v,
  }
}
