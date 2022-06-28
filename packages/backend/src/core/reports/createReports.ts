import { AssetId, EthereumAddress } from '@l2beat/common'

import { ProjectInfo } from '../../model'
import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { BalancePerProject, createReport } from './createReport'

export interface ProjectDetails {
  bridges: EthereumAddress[]
  assetIds: AssetId[]
}

export function createReports(
  prices: PriceRecord[],
  balances: BalanceRecord[],
  projects: ProjectInfo[],
): ReportRecord[] {
  const priceMap = new Map(prices.map((p) => [p.assetId, p]))
  const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

  if (!ethPrice) {
    return []
  }

  const balancesPerProject = aggregateBalancesPerProject(projects, balances)

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

export function aggregateBalancesPerProject(
  projects: ProjectInfo[],
  balances: BalanceRecord[],
): BalancePerProject[] {
  const balancesPerProject = []

  for (const { projectId, bridges } of projects) {
    const projectBalances = balances.filter((balance) =>
      bridges.some((bridge) => bridge.address === balance.holderAddress),
    )

    const assets = new Map<AssetId, number>()
    for (const bridge of bridges) {
      for (const token of bridge.tokens) {
        assets.set(token.id, token.decimals)
      }
    }

    for (const [assetId, decimals] of assets) {
      const assetBalances = projectBalances.filter(
        (balance) => balance.assetId === assetId,
      )

      balancesPerProject.push({
        projectId,
        balance: assetBalances.reduce((acc, { balance }) => acc + balance, 0n),
        assetId: assetId,
        decimals,
      })
    }
  }

  return balancesPerProject
}
