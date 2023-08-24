import {
  assert,
  AssetId,
  ChainId,
  ProjectId,
  Token,
  ValueType,
} from '@l2beat/shared-pure'

import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { TotalSupplyRecord } from '../../peripherals/database/TotalSupplyRepository'
import { BalancePerProject, createReport } from './createReport'

export function createTotalSupplyFormulaReports(
  prices: PriceRecord[],
  totalSupplies: TotalSupplyRecord[],
  tokens: Token[],
  projectId: ProjectId,
  chainId: ChainId,
): ReportRecord[] {
  const priceMap = new Map(prices.map((p) => [p.assetId, p]))
  const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

  if (!ethPrice) {
    return []
  }

  const balancesPerProject = transformBalances(
    projectId,
    totalSupplies,
    tokens,
    chainId,
  )

  const reports: ReportRecord[] = []
  for (const balance of balancesPerProject) {
    const price = priceMap.get(balance.assetId)
    if (!price) {
      continue
    }
    reports.push(createReport(price, balance, ethPrice))
  }

  return reports
}

function transformBalances(
  projectId: ProjectId,
  totalSupplies: TotalSupplyRecord[],
  tokens: Token[],
  chainId: ChainId,
): BalancePerProject[] {
  const result: BalancePerProject[] = []

  for (const { id, sinceTimestamp, decimals, bucket } of tokens) {
    const assetSupplies = totalSupplies.filter(
      (s) => s.assetId === id && s.timestamp.gte(sinceTimestamp),
    )

    assert(
      assetSupplies.length <= 1,
      'Expected only one supply asset, delete this if you are adding a new one',
    )

    const chainIdsMatch = assetSupplies.every((b) => b.chainId === chainId)
    assert(chainIdsMatch, 'ChainIds do not match for a given asset balance')

    const totalBalance = assetSupplies.reduce(
      (acc, { totalSupply }) => acc + totalSupply,
      0n,
    )

    result.push({
      projectId,
      chainId,
      balance: totalBalance,
      assetId: id,
      type: bucket,
      decimals: decimals,
    })
  }
  return result
}
