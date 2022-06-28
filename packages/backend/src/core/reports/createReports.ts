import { AssetId, EthereumAddress, ProjectId } from '@l2beat/common'

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
  projectDetailsById: Map<ProjectId, ProjectDetails>,
  decimalsByAssetId: Map<AssetId, number>,
): ReportRecord[] {
  const priceMap = new Map(prices.map((p) => [p.assetId, p]))
  const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

  if (!ethPrice) {
    return []
  }

  const balancesPerProject = aggregateBalancesPerProject(
    projectDetailsById,
    balances,
  )

  const reports: ReportRecord[] = []
  for (const balance of balancesPerProject) {
    const decimals = decimalsByAssetId.get(balance.assetId)
    if (decimals === undefined) {
      continue
    }
    const price = priceMap.get(balance.assetId)
    if (!price) {
      continue
    }

    reports.push(createReport(price, decimals, balance, ethPrice))
  }

  return reports
}

export function aggregateBalancesPerProject(
  projects: Map<ProjectId, ProjectDetails>,
  balances: BalanceRecord[],
): BalancePerProject[] {
  const balancesPerProject = []
  for (const [projectId, project] of projects) {
    const projectBalances = balances.filter((balance) =>
      project.bridges.some((bridge) => bridge === balance.holderAddress),
    )

    for (const assetId of project.assetIds) {
      const assetBalances = projectBalances.filter(
        (balance) => balance.assetId === assetId,
      )

      balancesPerProject.push({
        projectId,
        balance: assetBalances.reduce((acc, { balance }) => acc + balance, 0n),
        assetId: assetId,
      })
    }
  }
  return balancesPerProject
}
