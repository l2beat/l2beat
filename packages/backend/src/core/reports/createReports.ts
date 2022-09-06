import { AssetId, UnixTime } from '@l2beat/types'

import { ProjectInfo } from '../../model'
import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { BalancePerProject, createReport } from './createReport'

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

export interface TokenDetails {
  decimals: number
  sinceTimestamp: UnixTime
}

export function aggregateBalancesPerProject(
  projects: ProjectInfo[],
  balances: BalanceRecord[],
): BalancePerProject[] {
  const balancesPerProject = []

  for (const { projectId, escrows } of projects) {
    const projectBalances = balances.filter((balance) =>
      escrows.some(
        (escrow) =>
          escrow.address === balance.holderAddress &&
          escrow.sinceTimestamp.lte(balance.timestamp),
      ),
    )

    const assets = new Map<AssetId, TokenDetails>()
    for (const escrow of escrows) {
      for (const token of escrow.tokens) {
        assets.set(token.id, {
          decimals: token.decimals,
          sinceTimestamp: token.sinceTimestamp,
        })
      }
    }

    for (const [assetId, { decimals, sinceTimestamp }] of assets) {
      const assetBalances = projectBalances.filter(
        (balance) =>
          balance.assetId === assetId && balance.timestamp.gte(sinceTimestamp),
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
