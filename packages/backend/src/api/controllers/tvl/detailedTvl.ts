import { AssetId, ProjectId } from '@l2beat/shared-pure'
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

  const tokens = []

  for (const [asset, reports] of Object.entries(assetValuesPerProject)) {
    const tvl = reports.reduce((acc, report) => acc + report.usdValue, 0n)
    tokens.push({
      assetId: AssetId(asset),
      tvl: asNumber(tvl, 2),
    })
  }

  return tokens
}
