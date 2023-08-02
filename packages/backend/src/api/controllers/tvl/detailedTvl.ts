import { AssetId, DetailedTvlApiTopToken, ProjectId } from '@l2beat/shared-pure'
import { groupBy, mapValues } from 'lodash'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

export type ReportsPerProjectIdAndTimestamp = ReturnType<
  typeof groupByProjectIdAndTimestamp
>

export type ReportsPerProjectIdAndAsset = ReturnType<
  typeof groupByProjectIdAndAsset
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

export function groupByProjectIdAndAsset(reports: ReportRecord[]) {
  return nestedGroupBy(
    reports,
    (report) => report.projectId,
    (report) => report.asset,
  )
}

type ObjectValues<T> = T[keyof T]
type GroupingFunction<T> = (item: T) => ObjectValues<T>

export function nestedGroupBy<T extends ReportRecord | AggregatedReportRecord>(
  items: T[],
  firstLevel: GroupingFunction<T>,
  secondLevel: GroupingFunction<T>,
) {
  return mapValues(
    mapValues(groupBy(items, firstLevel), (firstGroupingResult) =>
      groupBy(firstGroupingResult, secondLevel),
    ),
  )
}

export function getProjectTokensCharts(
  reports: ReportsPerProjectIdAndAsset,
  projectId: ProjectId,
): { assetId: AssetId; tvl: number }[] {
  const assetValuesPerProject = reports[projectId.toString()]

  // Project may be missing reports
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!assetValuesPerProject) {
    return []
  }

  const tokens = Object.entries(assetValuesPerProject).map(
    ([asset, reports]) => {
      const tokenUsdTvl = reports.reduce(
        (acc, report) => acc + report.usdValue,
        0n,
      )

      return {
        assetId: AssetId(asset),
        tvl: asNumber(tokenUsdTvl, 2),
      }
    },
  )

  return tokens
}

export function getTopProjectTokens(
  groupedReports: ReportsPerProjectIdAndAsset,
  projectId: ProjectId,
  amountOfTopTokens = 15,
): DetailedTvlApiTopToken[] {
  const projectTokensByAsset = groupedReports[projectId.toString()]

  // Project may be missing reports
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!projectTokensByAsset) {
    return []
  }

  const topTokens = []

  for (const [, reports] of Object.entries(projectTokensByAsset)) {
    for (const latestReport of reports) {
      topTokens.push({
        assetId: latestReport.asset,
        chainId: latestReport.chainId,
        valueType: latestReport.type,
        value: asNumber(latestReport.usdValue, 2),
      })
    }
  }

  return topTokens
    .sort(
      (primaryReport, secondaryReport) =>
        primaryReport.value - secondaryReport.value,
    )
    .slice(0, amountOfTopTokens)
    .map(({ value: _value, ...rest }) => rest)
}
