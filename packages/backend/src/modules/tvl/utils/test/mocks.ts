import type { AmountRecord, PriceRecord, ValueRecord } from '@l2beat/database'
import {
  AssetId,
  CoingeckoId,
  type CoingeckoPriceConfigEntry,
  EthereumAddress,
  ProjectId,
  type TotalSupplyEntry,
  UnixTime,
} from '@l2beat/shared-pure'
import { mockObject } from 'earl'

const DECIMALS = 18
const USD_DECIMALS = 2

export const MOCKS_FOR_TVL = {
  amountRecord,
  amountConfiguration,
  priceRecord,
  priceConfiguration,
  valueRecord,
  DECIMALS,
  USD_DECIMALS,
}

function amountRecord(configId: string, timestamp: number): AmountRecord {
  return {
    configId: configId,
    timestamp: new UnixTime(timestamp),
    amount: BigInt(timestamp) * 10n ** BigInt(DECIMALS),
  }
}

function amountConfiguration(v: Partial<TotalSupplyEntry>) {
  return mockObject<TotalSupplyEntry>({
    type: 'totalSupply',
    address: EthereumAddress.ZERO,
    chain: 'chain',
    project: ProjectId('project'),
    source: 'canonical',
    sinceTimestamp: UnixTime.ZERO,
    includeInTotal: true,
    decimals: DECIMALS,
    assetId: AssetId.create(v.chain ?? 'chain', v.address),
    symbol: 'SYMBOL',
    isAssociated: false,
    category: 'other',
    ...v,
  })
}

function priceRecord(id: string, timestamp: number): PriceRecord {
  return {
    configId: id,
    timestamp: new UnixTime(timestamp),
    priceUsd: 1,
  }
}

function priceConfiguration(v: Partial<CoingeckoPriceConfigEntry>) {
  return mockObject<CoingeckoPriceConfigEntry>({
    assetId: AssetId.create(v.chain ?? 'chain', v.address),
    address: EthereumAddress.ZERO,
    chain: 'chain',
    sinceTimestamp: UnixTime.ZERO,
    type: 'coingecko',
    coingeckoId: CoingeckoId('coingeckoId'),
    ...v,
  })
}

function valueRecord(v?: Partial<ValueRecord>) {
  return {
    projectId: ProjectId('project'),
    dataSource: 'chain',
    timestamp: new UnixTime(0),
    canonical: 0n,
    canonicalAssociated: 0n,
    canonicalForTotal: 0n,
    canonicalAssociatedForTotal: 0n,
    external: 0n,
    externalAssociated: 0n,
    externalForTotal: 0n,
    externalAssociatedForTotal: 0n,
    native: 0n,
    nativeAssociated: 0n,
    nativeForTotal: 0n,
    nativeAssociatedForTotal: 0n,
    ether: 0n,
    stablecoin: 0n,
    ...v,
  }
}
