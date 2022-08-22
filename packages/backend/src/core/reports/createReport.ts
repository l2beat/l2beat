import { AssetId, ProjectId } from '@l2beat/types'

import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'

export interface BalancePerProject {
  assetId: AssetId
  balance: bigint
  decimals: number
  projectId: ProjectId
}

const ETH_PRECISION = 6n
const USD_PRECISION = 2n

export function createReport(
  price: PriceRecord,
  balance: BalancePerProject,
  ethPrice: number,
): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    price.priceUsd,
    balance.decimals,
    balance.balance,
    ethPrice,
  )

  return {
    timestamp: price.timestamp,
    projectId: balance.projectId,
    asset: balance.assetId,
    balance: balance.balance,
    balanceUsd,
    balanceEth,
  }
}

export function convertBalance(
  priceUsd: number,
  decimals: number,
  balance: bigint,
  ethPrice: number,
) {
  const bigintPrice = getBigIntPrice(priceUsd, decimals)
  const usdBalance = (balance * bigintPrice) / 10n ** 18n
  const balanceUsd = usdBalance / 10n ** (18n - USD_PRECISION)

  const etherBigInt = getBigIntPrice(ethPrice, 18)
  const etherBalance = (usdBalance * 10n ** 18n) / etherBigInt
  const balanceEth = etherBalance / 10n ** (18n - ETH_PRECISION)
  return { balanceUsd, balanceEth }
}

export function getBigIntPrice(price: number, decimals: number) {
  const integerPart = BigInt(Math.floor(price)) * 10n ** 8n
  const fractionPart = BigInt(Math.floor((price % 1) * 100000000))
  const fixedPrice = integerPart + fractionPart
  return fixedPrice * 10n ** (18n * 2n - 8n - BigInt(decimals))
}
