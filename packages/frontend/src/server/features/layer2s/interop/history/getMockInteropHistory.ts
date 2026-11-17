import { UnixTime } from '@l2beat/shared-pure'
import { HOURLY_HISTORY_DAYS } from './buildHistoryPoints'
import type {
  InteropHistoryChainSeries,
  InteropHistoryData,
  InteropHistoryParams,
  InteropHistoryPoint,
  InteropHistoryProtocolSeries,
} from './types'

const MOCK_PROTOCOLS = [
  { id: 'cctpv2', name: 'CCTP V2', volume: 5e8, duration: 400 },
  { id: 'layerzero', name: 'LayerZero', volume: 2.5e8, duration: 500 },
  { id: 'relay', name: 'Relay', volume: 8e7, duration: 6 },
  { id: 'across', name: 'Across', volume: 3e7, duration: 12 },
  { id: 'across-v3', name: 'across-v3', volume: 2e7, duration: 10 },
]

/**
 * Generated history with each kind of bad data the page explains: missing
 * and off-hour snapshots, a blocked snapshot, carried lanes, a price spike,
 * a token outlier and an outage.
 */
export function getMockInteropHistory(
  params: InteropHistoryParams,
): InteropHistoryData {
  const hourly = params.resolution === 'hourly'
  const step = hourly ? UnixTime.HOUR : UnixTime.DAY
  const count = hourly ? HOURLY_HISTORY_DAYS * 24 : 240
  const end = UnixTime.toStartOf(UnixTime.now(), hourly ? 'hour' : 'day')
  const zeros = () => new Array<number>(count).fill(0)

  const points: InteropHistoryPoint[] = Array.from(
    { length: count },
    (_, i) => {
      const timestamp = end - (count - 1 - i) * step
      const missing = i % 47 === 13 || i % 61 === 30
      const offHour = !hourly && i % 37 === 5
      return {
        timestamp,
        snapshot: missing
          ? null
          : timestamp + (offHour ? 7 * UnixTime.HOUR : 0),
        isBlocked: i === Math.floor(count * 0.7),
        carriedLanes: i % 29 === 3 ? 12 : 0,
        partialLanes: i % 53 === 9 ? 2 : 0,
      }
    },
  )

  const protocols = MOCK_PROTOCOLS.filter(
    (p) => !params.protocolIds || params.protocolIds.includes(p.id),
  )
  const byProtocol: Record<string, InteropHistoryProtocolSeries> = {}
  for (const [k, protocol] of protocols.entries()) {
    const series: InteropHistoryProtocolSeries = {
      volume: zeros(),
      transferCount: zeros(),
      timedTransferCount: zeros(),
      durationSum: zeros(),
    }
    // The renamed plugin stops where its successor starts.
    const retired = protocol.id === 'across-v3'
    const successor = protocol.id === 'across'
    for (const [i, point] of points.entries()) {
      if (point.snapshot === null) continue
      if (retired && i > count / 3) continue
      if (successor && i <= count / 3) continue
      const outage =
        protocol.id === 'relay' && i > count / 2 && i < count / 2 + 3
      if (outage) continue
      const growth = 0.6 + (0.8 * i) / count
      const weekly = 1 + 0.25 * Math.sin((i * 2 * Math.PI) / (hourly ? 24 : 7))
      const noise = 0.8 + Math.random() * 0.4
      const volume = protocol.volume * growth * weekly * noise
      const transfers = Math.round(volume / (2000 + k * 1000))
      series.volume[i] = volume
      series.transferCount[i] = transfers
      series.timedTransferCount[i] = Math.round(transfers * 0.9)
      series.durationSum[i] =
        series.timedTransferCount[i] *
        protocol.duration *
        (0.8 + Math.random() * 0.4)
    }
    byProtocol[protocol.id] = series
  }

  const chains = params.from.filter((c) => params.to.includes(c)).slice(0, 6)
  const byChain: Record<string, InteropHistoryChainSeries> = {}
  for (const [k, chain] of chains.entries()) {
    const share = 1 / (k + 2)
    byChain[chain] = { inflow: zeros(), outflow: zeros() }
    for (const [i, point] of points.entries()) {
      if (point.snapshot === null) continue
      const total = Object.values(byProtocol).reduce(
        (sum, s) => sum + (s.volume[i] ?? 0),
        0,
      )
      byChain[chain].inflow[i] = total * share * (0.9 + Math.random() * 0.2)
      byChain[chain].outflow[i] = total * share * (0.9 + Math.random() * 0.2)
    }
  }

  const spike = Math.floor(count * 0.4)
  const outlier = Math.floor(count * 0.85)
  const [src = 'ethereum', dst = 'arbitrum'] = chains
  const lead = protocols[0]
  const laneCandidates: InteropHistoryData['laneCandidates'] = []
  const tokenCandidates: InteropHistoryData['tokenCandidates'] = []
  if (lead && points[spike]?.snapshot && points[outlier]?.snapshot) {
    const leadSeries = byProtocol[lead.id] as InteropHistoryProtocolSeries
    leadSeries.volume[spike] = (leadSeries.volume[spike] ?? 0) + 4.2e11
    leadSeries.volume[outlier] = (leadSeries.volume[outlier] ?? 0) + 9e8
    for (const chain of [src, dst]) {
      const series = byChain[chain]
      if (!series) continue
      if (chain === dst)
        series.inflow[spike] = (series.inflow[spike] ?? 0) + 4.2e11
      if (chain === src)
        series.outflow[spike] = (series.outflow[spike] ?? 0) + 4.2e11
      if (chain === dst)
        series.inflow[outlier] = (series.inflow[outlier] ?? 0) + 9e8
      if (chain === src)
        series.outflow[outlier] = (series.outflow[outlier] ?? 0) + 9e8
    }
    laneCandidates.push({
      point: spike,
      id: lead.id,
      bridgeType: 'burnAndMint',
      srcChain: src,
      dstChain: dst,
      volume: 4.2e11,
      topToken: 'DGLD',
    })
    tokenCandidates.push({
      point: outlier,
      id: lead.id,
      token: 'kt2f8Y',
      volume: 9e8,
      baseline: 1e5,
      lanes: [
        {
          bridgeType: 'burnAndMint',
          srcChain: src,
          dstChain: dst,
          volume: 9e8,
          laneVolume: 9.5e8,
          inSelection: true,
        },
      ],
    })
  }

  return {
    resolution: params.resolution,
    points,
    protocols: protocols.map((p) => ({
      id: p.id,
      name: p.name,
      iconUrl: undefined,
      isListed: p.id !== 'across-v3',
    })),
    byProtocol,
    byChain,
    laneCandidates,
    tokenCandidates,
  }
}
