import {
  DetailedTvlApiChartPoint,
  TvlApiChartPoint,
  UnixTime,
} from '@l2beat/shared-pure'

import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { asNumber } from './asNumber'

interface DetailedBalanceInTime {
  timestamp: UnixTime
  usdTvl: bigint
  ethTvl: bigint
  usdEbv: bigint
  ethEbv: bigint
  usdCbv: bigint
  ethCbv: bigint
  usdNmv: bigint
  ethNmv: bigint
}

export function addMissingTimestamps(
  points: TvlApiChartPoint[],
  hours: number,
): TvlApiChartPoint[] {
  if (points.length === 0) return []
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const timestampValues = new Map(
    points.map(([t, v1, v2]) => [t.toString(), [v1, v2]]),
  )
  const allPoints: TvlApiChartPoint[] = []
  for (
    let timestamp = min;
    timestamp.lte(max);
    timestamp = timestamp.add(hours, 'hours')
  ) {
    const existing = timestampValues.get(timestamp.toString())
    const previous = allPoints[allPoints.length - 1]
    allPoints.push([
      timestamp,
      existing?.[0] ?? previous[1],
      existing?.[1] ?? previous[2],
    ])
  }
  return allPoints
}

export function addDetailedMissingTimestamps(
  points: DetailedTvlApiChartPoint[],
  hours: number,
): DetailedTvlApiChartPoint[] {
  if (points.length === 0) return []
  const [min] = points[0]
  const [max] = points[points.length - 1]
  const timestampValues = new Map(
    points.map(([t, ...values]) => [t.toString(), values]),
  )
  const allPoints: DetailedTvlApiChartPoint[] = []
  for (
    let timestamp = min;
    timestamp.lte(max);
    timestamp = timestamp.add(hours, 'hours')
  ) {
    const existing = timestampValues.get(timestamp.toString())
    const previous = allPoints[allPoints.length - 1]

    allPoints.push([
      timestamp,
      existing?.[0] ?? previous[1],
      existing?.[1] ?? previous[2],
      existing?.[2] ?? previous[3],
      existing?.[3] ?? previous[4],
      existing?.[4] ?? previous[5],
      existing?.[5] ?? previous[6],
      existing?.[6] ?? previous[7],
      existing?.[7] ?? previous[8],
    ])
  }
  return allPoints
}

export function getProjectAssetChartData(
  projectAssetReports: ReportRecord[],
  decimals: number,
) {
  const balancesInTime = projectAssetReports.map((report) => ({
    timestamp: report.timestamp,
    usd: report.usdValue,
    asset: report.amount,
  }))

  return getChartPoints(balancesInTime, decimals)
}

export function getChartPoints(
  balances: { usd: bigint; asset: bigint; timestamp: UnixTime }[],
  decimals: number,
  usdFirst = false,
): TvlApiChartPoint[] {
  const existing: TvlApiChartPoint[] = balances.map((b) => {
    const usd = asNumber(b.usd, 2)
    const asset = asNumber(b.asset, decimals)
    return usdFirst ? [b.timestamp, usd, asset] : [b.timestamp, asset, usd]
  })

  return existing
}

export function covertBalancesToChartPoints(
  balancesInTime: DetailedBalanceInTime[],
  decimals: number,
  usdFirst = false,
): DetailedTvlApiChartPoint[] {
  const USD_DECIMALS = 2

  const existingBalanceChartPoints: DetailedTvlApiChartPoint[] =
    balancesInTime.map((bit) => {
      const [usdTvl, usdCbv, usdEbv, usdNmv] = [
        bit.usdTvl,
        bit.usdCbv,
        bit.usdEbv,
        bit.usdNmv,
      ].map((usdBalance) => asNumber(usdBalance, USD_DECIMALS))

      const [ethTvl, ethCbv, ethEbv, ethNmv] = [
        bit.ethTvl,
        bit.ethCbv,
        bit.ethEbv,
        bit.ethNmv,
      ].map((ethBalance) => asNumber(ethBalance, decimals))

      return usdFirst
        ? [
            bit.timestamp,
            usdTvl,
            usdCbv,
            usdEbv,
            usdNmv,
            ethTvl,
            ethCbv,
            ethEbv,
            ethNmv,
          ]
        : [
            bit.timestamp,
            ethTvl,
            ethCbv,
            ethEbv,
            ethNmv,
            usdTvl,
            usdCbv,
            usdEbv,
            usdNmv,
          ]
    })

  return existingBalanceChartPoints
}
