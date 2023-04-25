import {
  AssetId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import { BalanceRecord } from '../../peripherals/database/BalanceRepository'
import { PriceRecord } from '../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../peripherals/database/ReportRepository'
import { BalancePerProject, createReport } from './createReport'
import { ReportProject } from './ReportProject'

export function createReports(
  prices: PriceRecord[],
  balances: BalanceRecord[],
  projects: ReportProject[],
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
  projects: ReportProject[],
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
        type: ValueType.CBV,
        decimals,
      })
    }
  }

  return balancesPerProject
}

export interface ReportPerEscrow {
  projectId: ProjectId
  escrow: EthereumAddress
  balance: bigint
}

export function createReportsPerEscrow(
  prices: PriceRecord[],
  balances: BalanceRecord[],
  projects: ReportProject[],
): ReportPerEscrow[] {
  const priceMap = new Map(prices.map((p) => [p.assetId, p]))
  const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

  if (!ethPrice) {
    return []
  }

  const balancesPerEscrow = aggregateBalancesPerEscrow(projects, balances)

  const reports = []
  for (const balance of balancesPerEscrow) {
    const price = priceMap.get(balance.assetId)
    if (!price) {
      continue
    }
    reports.push({
      ...createReport(price, balance, ethPrice),
      escrow: balance.escrow,
    })
  }

  const escrowBalances = []
  for (const project of projects) {
    for (const escrow of project.escrows) {
      // sum balanceUsd per escrow
      const escrowBalanceUsd = reports
        .filter((report) => report.escrow === escrow.address)
        .reduce((acc, report) => acc + report.balanceUsd, 0n)

      escrowBalances.push({
        projectId: project.projectId,
        escrow: escrow.address,
        balance: escrowBalanceUsd,
      })
    }
  }

  return escrowBalances
}

export interface BalancePerEscrow {
  balance: bigint
  decimals: number
  projectId: ProjectId
  assetId: AssetId
  escrow: EthereumAddress
}

export function aggregateBalancesPerEscrow(
  projects: ReportProject[],
  balances: BalanceRecord[],
): BalancePerEscrow[] {
  const balancesPerEscrow: BalancePerEscrow[] = []

  for (const { projectId, escrows } of projects) {
    const projectBalances = balances.filter((balance) =>
      escrows.some(
        (escrow) =>
          escrow.address === balance.holderAddress &&
          escrow.sinceTimestamp.lte(balance.timestamp),
      ),
    )

    for (const escrow of escrows) {
      const assets = new Map<AssetId, TokenDetails>()

      for (const token of escrow.tokens) {
        assets.set(token.id, {
          decimals: token.decimals,
          sinceTimestamp: token.sinceTimestamp,
        })
      }

      for (const [assetId, { decimals, sinceTimestamp }] of assets) {
        const assetBalances = projectBalances.filter(
          (balance) =>
            balance.assetId === assetId &&
            balance.holderAddress === escrow.address &&
            balance.timestamp.gte(sinceTimestamp),
        )

        balancesPerEscrow.push({
          projectId,
          balance: assetBalances.reduce(
            (acc, { balance }) => acc + balance,
            0n,
          ),
          assetId: assetId,
          decimals,
          escrow: escrow.address,
        })
      }
    }
  }

  return balancesPerEscrow
}
