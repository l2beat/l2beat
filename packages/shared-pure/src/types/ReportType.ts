import { AssetType, isAssetType } from './AssetType'

export type ReportType = AssetType
export type AggregatedReportType = ReportType | 'TVL'

export function isReportType(value: string): value is ReportType {
  return isAssetType(value)
}

export function isAggregatedReportType(value: string): value is ReportType {
  return value === 'TVL' || isReportType(value)
}

export function ReportType(value: string): ReportType {
  if (!isReportType(value)) {
    throw new Error(`Invalid report type: ${value}`)
  }
  return value
}

export function AggregatedReportType(value: string): ReportType {
  if (!isAggregatedReportType(value)) {
    throw new Error(`Invalid aggregated report type: ${value}`)
  }
  return value
}
