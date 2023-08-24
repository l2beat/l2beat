import { assert, AssetId, ChainId, ProjectId, Token } from '@l2beat/shared-pure'

import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { TotalSupplyRecord } from '../../peripherals/database/TotalSupplyRepository'
import { BalancePerProject, createReport } from './createReport'

export function createEBVReports(
  prices: PriceRecord[],
  balances: BalanceRecord[],
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
    balances,
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
  balances: BalanceRecord[],
  totalSupplies: TotalSupplyRecord[],
  tokens: Token[],
  chainId: ChainId,
): BalancePerProject[] {
  const result: BalancePerProject[] = []

  for (const { id, sinceTimestamp, decimals } of tokens) {
    const assetBalances = balances.filter(
      (b) => b.assetId === id && b.timestamp.gte(sinceTimestamp),
    )
    const assetSupplies = totalSupplies.filter(
      (s) => s.assetId === id && s.timestamp.gte(sinceTimestamp),
    )

    assert(
      assetSupplies.length <= 1,
      'Expected only one supply asset, delete this if you are adding a new one',
    )

    const chainIdsMatch =
      assetBalances.every((b) => b.chainId === chainId) &&
      assetSupplies.every((b) => b.chainId === chainId)
    assert(chainIdsMatch, 'ChainIds do not match for a given asset balance')

    const totalBalance = assetSupplies.reduce(
      (acc, { totalSupply }) => acc + totalSupply,
      0n,
    )
    const premintBalance = assetBalances.reduce(
      (acc, { balance }) => acc + balance,
      0n,
    )

    assert(
      totalBalance >= premintBalance,
      'Total supply has to be bigger than premint balance',
    )

    result.push({
      projectId,
      chainId,
      balance: totalBalance - premintBalance,
      assetId: id,
      type: 'EBV',
      decimals: decimals,
    })
  }
  return result
}
