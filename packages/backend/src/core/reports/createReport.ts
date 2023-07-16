import {
  AssetId,
  ChainId,
  ProjectId,
  UnixTime,
  ValueType,
} from '@l2beat/shared-pure'

import { ReportRecord } from '../../peripherals/database/ReportRepository'

export interface BalancePerProject {
  assetId: AssetId
  chainId: ChainId
  type: ValueType
  balance: bigint
  decimals: number
  projectId: ProjectId
}

export interface PriceAtTimestamp {
  priceUsd: number
  timestamp: UnixTime
}

const ETH_PRECISION = 6n
const USD_PRECISION = 2n

export function createReport(
  price: PriceAtTimestamp,
  balance: BalancePerProject,
  ethPrice: number,
): ReportRecord {
  const { usdValue, ethValue } = balanceToValue(
    price.priceUsd,
    balance.decimals,
    balance.balance,
    ethPrice,
  )

  return {
    timestamp: price.timestamp,
    projectId: balance.projectId,
    chainId: balance.chainId,
    asset: balance.assetId,
    type: balance.type,
    amount: balance.balance,
    usdValue,
    ethValue,
  }
}

export function balanceToValue(
  priceUsd: number,
  decimals: number,
  balance: bigint,
  ethPrice: number,
) {
  const bigintPrice = getBigIntPrice(priceUsd, decimals)
  const usdBalance = (balance * bigintPrice) / 10n ** 18n
  const usdValue = usdBalance / 10n ** (18n - USD_PRECISION)

  const etherBigInt = getBigIntPrice(ethPrice, 18)
  const etherBalance = (usdBalance * 10n ** 18n) / etherBigInt
  const ethValue = etherBalance / 10n ** (18n - ETH_PRECISION)
  return { usdValue, ethValue }
}

export function getBigIntPrice(price: number, decimals: number) {
  const integerPart = BigInt(Math.floor(price)) * 10n ** 8n
  const fractionPart = BigInt(Math.floor((price % 1) * 100000000))
  const fixedPrice = integerPart + fractionPart
  return fixedPrice * 10n ** (18n * 2n - 8n - BigInt(decimals))
}
