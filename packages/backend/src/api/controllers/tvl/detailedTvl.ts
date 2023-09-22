import { Logger } from '@l2beat/shared'
import {
  assert,
  AssetId,
  ChainId,
  DetailedTvlApiProject,
  EthereumAddress,
  ProjectAssetsBreakdownApiResponse,
  ProjectId,
  ReportType,
  Token,
} from '@l2beat/shared-pure'
import { Dictionary, mapValues } from 'lodash'

import { ReportProject } from '../../../core/reports/ReportProject'
import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { BalanceRecord } from '../../../peripherals/database/BalanceRepository'
import { PriceRecord } from '../../../peripherals/database/PriceRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'
import { groupByAndOmit, nestedGroupBy } from './grouping'

export type ReportsPerProjectIdAndTimestamp = ReturnType<
  typeof groupByProjectIdAndTimestamp
>

export type ReportsPerProjectIdAndAsset = ReturnType<
  typeof groupByProjectIdAndAssetType
>

export function groupByProjectIdAndTimestamp(
  reports: AggregatedReportRecord[],
) {
  return nestedGroupBy(
    reports,
    (report) => report.projectId,
    (report) => report.timestamp,
  )
}

export function groupByProjectIdAndAssetType(reports: ReportRecord[]) {
  return nestedGroupBy(
    reports,
    (report) => report.projectId,
    (report) => report.reportType,
  )
}

export function getProjectTokensCharts(
  reports: ReportsPerProjectIdAndAsset,
  projectId: ProjectId,
): DetailedTvlApiProject['tokens'] {
  // type => ReportRecord[]
  const assetValuesPerProject = reports[projectId.toString()]

  const baseResult: DetailedTvlApiProject['tokens'] = {
    CBV: [],
    EBV: [],
    NMV: [],
  }

  // Project may be missing reports
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!assetValuesPerProject) {
    return baseResult
  }

  // Sort assets per type by USD value
  const tokens = Object.entries(assetValuesPerProject).reduce(
    (prev, [reportType, reports]) => {
      return {
        ...prev,
        [reportType]: reports
          .map((report) => ({
            assetId: report.asset,
            chainId: report.chainId,
            assetType: report.reportType,
            usdValue: asNumber(report.usdValue, 2),
          }))
          .sort((a, b) => b.usdValue - a.usdValue),
      }
    },
    baseResult,
  )

  return tokens
}

type CanonicalAssetsBreakdown = ReturnType<
  ReturnType<typeof getCanonicalAssetsBreakdown>
>
type NonCanonicalAssetsBreakdown = ReturnType<
  ReturnType<typeof getNonCanonicalAssetsBreakdown>
>

/**
 * Merge data from reports with data from tokens
 * @param reports Report for latest timestamp
 * @param tokens Tokens data to search within and merge with
 * @param type Type of the asset to search & merge for
 */
export function getNonCanonicalAssetsBreakdown(logger: Logger) {
  return function (
    reports: ReportRecord[],
    tokens: Token[],
    reportType: ReportType,
  ) {
    return tokens
      .filter((token) => token.type === reportType)
      .flatMap((token) => {
        const assetId = token.id

        const report = reports.find((rp) => rp.asset === assetId)

        if (!report) {
          logger.warn(
            'Could not find report for token during asset breakdown generations',
            {
              tokenId: token.id.toString(),
              tokenChainId: token.chainId.toString(),
              tokenFormula: token.formula,
              tokenName: token.name,
              tokenBucket: reportType,
            },
          )

          return []
        }

        const amount = asNumber(report.amount, token.decimals)
        const usdValue = asNumber(report.usdValue, 2)
        const usdPrice = usdValue / amount

        return {
          projectId: report.projectId,
          assetId: token.id,
          chainId: report.chainId,
          amount: amount.toString(),
          usdValue: usdValue.toString(),
          usdPrice: usdPrice.toString(),
          tokenAddress: token.address,
        }
      })
  }
}

/**
 * Merge data from reports with data from balances
 * @notice Reports cannot be used as base data because they do not contain
 *         information about the escrow address and actual escrow token balance
 * @param balances Balances for latest timestamp
 * @param prices Prices for latest timestamp
 * @param projects Projects to search within
 */
export function getCanonicalAssetsBreakdown(logger: Logger) {
  return function (
    balances: BalanceRecord[],
    prices: PriceRecord[],
    projects: ReportProject[],
  ) {
    return projects.flatMap((project) => {
      return project.escrows.flatMap((escrow) => {
        return escrow.tokens.flatMap((token) => {
          const escrowTokenBalance = balances.find(
            (balance) =>
              balance.holderAddress === escrow.address &&
              balance.assetId === token.id &&
              balance.chainId === token.chainId,
          )

          assert(
            escrowTokenBalance,
            'Balance should not be undefined within the response preparation',
          )

          // Ignore assets with 0 balance
          if (escrowTokenBalance.balance <= 0) {
            // Flat map
            return []
          }

          const price = prices.find((price) => price.assetId === token.id)

          if (!price) {
            logger.debug(
              'Missing price entry while preparing breakdown response',
              {
                projectId: project.projectId.toString(),
                assetId: token.id.toString(),
                chainId: token.chainId.toString(),
                escrowAddress: escrow.address.toString(),
              },
            )

            // Flat map
            return []
          }

          const amount = asNumber(escrowTokenBalance.balance, token.decimals)
          const usdValue = amount * price.priceUsd

          return {
            projectId: project.projectId,
            assetId: token.id,
            chainId: token.chainId,
            amount: amount.toString(),
            usdValue: usdValue.toString(),
            usdPrice: price.priceUsd.toString(),
            escrowAddress: escrow.address,
          }
        })
      })
    })
  }
}

/**
 * Group assets' breakdowns by projects' IDs, at the same time matching target api response shape
 * omitting duplicated data & filling the missing gaps to match primitive zod shape
 * @see ProjectAssetsBreakdownApiResponse
 */
export function groupAndMergeBreakdowns(
  projects: ReportProject[],
  breakdowns: {
    canonical: CanonicalAssetsBreakdown
    external: NonCanonicalAssetsBreakdown
    native: NonCanonicalAssetsBreakdown
  },
): ProjectAssetsBreakdownApiResponse['breakdowns'] {
  const groupedExternalBreakdownEntries = groupByAndOmit(
    breakdowns.external.sort((a, b) => Number(b.usdValue) - Number(a.usdValue)),
    'projectId',
  )

  const groupedNativeBreakdownEntries = groupByAndOmit(
    breakdowns.native.sort((a, b) => Number(b.usdValue) - Number(a.usdValue)),
    'projectId',
  )

  const groupedCanonicalBreakdownEntries = reshapeCanonicalResponse(
    mapValues(groupByAndOmit(breakdowns.canonical, 'projectId'), (breakdowns) =>
      groupByAndOmit(breakdowns, 'assetId'),
    ),
  )

  const base: ProjectAssetsBreakdownApiResponse['breakdowns'] = {}

  return projects.reduce((prev, curr) => {
    const projectId = curr.projectId.toString()

    // Grouped entires may be missing, fill the gaps with empty primitives
    // i.e no native assets
    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    const external = groupedExternalBreakdownEntries[projectId] ?? []
    const native = groupedNativeBreakdownEntries[projectId] ?? []
    const canonical = groupedCanonicalBreakdownEntries[projectId] ?? []
    /* eslint-enable @typescript-eslint/no-unnecessary-condition */

    return {
      ...prev,
      [projectId]: {
        external,
        native,
        canonical,
      },
    }
  }, base)
}

// We need to do this because for every asset we receive array of escrows, so we need to sum values from escrows for every asset, and add escrows field for every asset
function reshapeCanonicalResponse(
  breakdowns: Record<
    string,
    Dictionary<
      {
        chainId: ChainId
        amount: string
        usdValue: string
        usdPrice: string
        escrowAddress: EthereumAddress
      }[]
    >
  >,
) {
  return Object.fromEntries(
    Object.entries(breakdowns).map(([project, projectBreakdown]) => [
      project,
      Object.entries(projectBreakdown)
        .map(([asset, escrows]) => ({
          assetId: AssetId(asset),
          chainId: ChainId.ETHEREUM,
          usdValue: escrows
            .reduce((total, e) => total + Number(e.usdValue), 0)
            .toString(),
          amount: escrows
            .reduce((total, e) => total + Number(e.amount), 0)
            .toString(),
          escrows: escrows
            .map((e) => ({
              amount: e.amount,
              usdValue: e.usdValue,
              escrowAddress: e.escrowAddress,
            }))
            .sort((a, b) => Number(b.usdValue) - Number(a.usdValue)),
          usdPrice: escrows[0].usdPrice,
        }))
        .sort((a, b) => Number(b.usdValue) - Number(a.usdValue)),
    ]),
  )
}
