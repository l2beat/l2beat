import { DetailedTvlApiProject, ProjectId } from '@l2beat/shared-pure'
import { groupBy, mapValues } from 'lodash'

import { AggregatedReportRecord } from '../../../peripherals/database/AggregatedReportRepository'
import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

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
    (report) => report.type,
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
    (prev, [valueType, reports]) => {
      return {
        ...prev,
        [valueType]: reports
          .map((report) => ({
            assetId: report.asset,
            chainId: report.chainId,
            valueType: report.type,
            usdValue: asNumber(report.usdValue, 2),
          }))
          .sort((a, b) => b.usdValue - a.usdValue),
      }
    },
    baseResult,
  )

  return tokens
}
