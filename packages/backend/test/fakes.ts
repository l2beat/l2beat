import {
  AssetId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/common'

import { Token } from '../src/model'
import { BalanceRecord } from '../src/peripherals/database/BalanceRepository'
import { ReportRecord } from '../src/peripherals/database/ReportRepository'

const MAX_SAFE_POSTGRES_INT = 2 ** 31 - 1
export function fakeInt(max = MAX_SAFE_POSTGRES_INT): number {
  return Math.floor(Math.random() * max)
}

export function fakeBigInt(max = Number.MAX_SAFE_INTEGER): bigint {
  return BigInt(fakeInt(max))
}

export function fakeBoolean(): boolean {
  return Math.random() > 0.5
}

export function fakeUnixTime(max?: number): UnixTime {
  return new UnixTime(fakeInt(max))
}

export const fakeToken = (token?: Partial<Token>): Token => ({
  id: AssetId('fake-token'),
  coingeckoId: CoingeckoId('fake-token'),
  symbol: 'FKT',
  decimals: fakeInt(20),
  address: EthereumAddress.random(),
  ...token,
})

export const fakeBalance = (
  balance?: Partial<BalanceRecord>,
): BalanceRecord => ({
  timestamp: UnixTime.now(),
  assetId: AssetId('fake-asset'),
  holderAddress: EthereumAddress.random(),
  balance: fakeBigInt(),
  ...balance,
})

export const fakeReport = (report?: Partial<ReportRecord>): ReportRecord => ({
  timestamp: fakeUnixTime(),
  projectId: ProjectId('fake-project'),
  asset: AssetId('fake-asset'),
  balance: fakeBigInt(),
  balanceUsd: fakeBigInt(),
  balanceEth: fakeBigInt(),
  ...report,
})
