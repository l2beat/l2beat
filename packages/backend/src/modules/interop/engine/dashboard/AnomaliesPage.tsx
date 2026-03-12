import type { InteropSuspiciousTransferRecord } from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import { ShortenedHash } from './ShortenedHash'
import {
  type DataRowResult,
  interpret,
  VALUE_DIFF_ALERT_THRESHOLD_PERCENT,
} from './stats'

const SPARKLINE_WIDTH = 140
const SPARKLINE_HEIGHT = 26

function formatCount(value: number) {
  return Math.round(value).toLocaleString()
}

function formatSignedDiff(value: number | null, digits = 0) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}`
}

function formatPercent(value: number | null) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatGapPercent(value: number | null) {
  if (value === null) return '-'
  return `${value.toFixed(2)}%`
}

function formatUtcDateTime(timestamp: number) {
  return new Date(timestamp * 1000).toISOString().replace('T', ' ').slice(0, 19)
}

function getPercentColor(value: number | null) {
  if (value === null) return '#6b7280'
  const capped = Math.min(Math.abs(value), 100)
  const intensity = capped / 100
  const lightness = 55 - Math.round(intensity * 20)
  const hue = value >= 0 ? 140 : 0
  return `hsl(${hue}, 80%, ${lightness}%)`
}

function getGapColor(value: number | null) {
  if (value === null) return '#6b7280'
  return value > VALUE_DIFF_ALERT_THRESHOLD_PERCENT ? '#b91c1c' : '#15803d'
}

function getSummaryValues(
  last: number | null,
  prevDay: number | null,
  prev7d: number | null,
) {
  const diffDay = last === null || prevDay === null ? null : last - prevDay
  const diff7d = last === null || prev7d === null ? null : last - prev7d
  const pctDiffDay =
    diffDay === null || prevDay === null || prevDay === 0 || last === null
      ? null
      : (diffDay / prevDay) * 100
  const pctDiff7d =
    diff7d === null || prev7d === null || prev7d === 0 || last === null
      ? null
      : (diff7d / prev7d) * 100
  return { diffDay, diff7d, pctDiffDay, pctDiff7d }
}

function MetricLine(props: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', color: '#6b7280', whiteSpace: 'nowrap' }}>
      {props.children}
    </div>
  )
}

function ColoredPercent(props: { value: number | null }) {
  return (
    <span
      style={{
        color: getPercentColor(props.value),
        fontWeight: 600,
      }}
    >
      {formatPercent(props.value)}
    </span>
  )
}

function CountDeltaCell(props: {
  diffDay: number | null
  diff7d: number | null
  pctDiffDay: number | null
  pctDiff7d: number | null
}) {
  return (
    <>
      <MetricLine>
        1d {formatSignedDiff(props.diffDay, 0)} (
        <ColoredPercent value={props.pctDiffDay} />)
      </MetricLine>
      <MetricLine>
        7d {formatSignedDiff(props.diff7d, 0)} (
        <ColoredPercent value={props.pctDiff7d} />)
      </MetricLine>
    </>
  )
}

function PercentBySourceCell(props: {
  srcPctDay: number | null
  srcPct7d: number | null
  dstPctDay: number | null
  dstPct7d: number | null
}) {
  return (
    <>
      <MetricLine>
        Src 1d <ColoredPercent value={props.srcPctDay} /> · 7d{' '}
        <ColoredPercent value={props.srcPct7d} />
      </MetricLine>
      <MetricLine>
        Dst 1d <ColoredPercent value={props.dstPctDay} /> · 7d{' '}
        <ColoredPercent value={props.dstPct7d} />
      </MetricLine>
    </>
  )
}

type SparklineDomain = {
  min: number
  max: number
}

function maxOrZero(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return Math.max(...values)
}

function toSparklinePoints(
  values: number[],
  width: number,
  height: number,
  domain?: SparklineDomain,
) {
  if (values.length === 0) {
    return ''
  }

  const chartMin = domain?.min ?? Math.min(...values, 0)
  const chartMax = domain?.max ?? Math.max(...values, 0)
  const minMaxEqual = chartMax === chartMin
  const constantNormalized = chartMax === 0 ? 0 : 1
  const range = Math.max(chartMax - chartMin, 1)
  const xDenominator = Math.max(values.length - 1, 1)

  return values
    .map((value, index) => {
      const normalized = minMaxEqual
        ? constantNormalized
        : (value - chartMin) / range
      const x = (index / xDenominator) * (width - 1)
      const y = (1 - normalized) * (height - 1)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

function Sparkline(props: {
  values: number[]
  color: string
  width?: number
  height?: number
  domain?: SparklineDomain
}) {
  const width = props.width ?? SPARKLINE_WIDTH
  const height = props.height ?? SPARKLINE_HEIGHT
  const points = toSparklinePoints(props.values, width, height, props.domain)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={props.color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MiniChartsCell(props: { row: DataRowResult }) {
  const seriesPoints =
    props.row.rawDataPoints.length > 0
      ? props.row.rawDataPoints
      : props.row.dataPoints
  const countValues = seriesPoints.map((point) => point.transferCount)
  const srcVolumeValues = seriesPoints.map((point) => point.totalSrcValueUsd)
  const dstVolumeValues = seriesPoints.map((point) => point.totalDstValueUsd)
  const countDomain = {
    min: 0,
    max: maxOrZero(countValues),
  }
  const volumeDomain = {
    min: 0,
    max: maxOrZero([...srcVolumeValues, ...dstVolumeValues]),
  }

  return (
    <div style={{ minWidth: `${SPARKLINE_WIDTH}px` }}>
      <MetricLine>
        Count
        <span style={{ color: '#2563eb', fontWeight: 600 }}> ●</span>
      </MetricLine>
      <div style={{ background: '#f8fafc', borderRadius: 4 }}>
        <Sparkline values={countValues} color="#2563eb" domain={countDomain} />
      </div>
      <MetricLine>
        Vol
        <span style={{ color: '#7c3aed', fontWeight: 600 }}> S</span> /
        <span style={{ color: '#f97316', fontWeight: 600 }}> D</span>
      </MetricLine>
      <div style={{ background: '#f8fafc', borderRadius: 4 }}>
        <div style={{ position: 'relative' }}>
          <Sparkline
            values={srcVolumeValues}
            color="#7c3aed"
            domain={volumeDomain}
          />
          <div style={{ position: 'absolute', inset: 0 }}>
            <Sparkline
              values={dstVolumeValues}
              color="#f97316"
              domain={volumeDomain}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function AnomaliesTable(props: { stats: DataRowResult[] }) {
  return (
    <table id="anomalies" className="display">
      <thead>
        <tr>
          <th>Day (UTC)</th>
          <th>Transfer ID</th>
          <th>Count</th>
          <th>Count Δ</th>
          <th>Volume (USD)</th>
          <th>Volume Δ%</th>
          <th>Src/Dst diff %</th>
          <th>Avg vol/tx</th>
          <th>Avg vol/tx Δ%</th>
          <th>Mini charts</th>
          <th>Interpretation</th>
        </tr>
      </thead>
      <tbody>
        {props.stats.map((row, idx) => {
          const countSummary = getSummaryValues(
            row.counts.last,
            row.counts.prevDay,
            row.counts.prev7d,
          )
          const srcValueSummary = getSummaryValues(
            row.srcVolume.valueUsd.last,
            row.srcVolume.valueUsd.prevDay,
            row.srcVolume.valueUsd.prev7d,
          )
          const dstValueSummary = getSummaryValues(
            row.dstVolume.valueUsd.last,
            row.dstVolume.valueUsd.prevDay,
            row.dstVolume.valueUsd.prev7d,
          )
          const srcAvgVolumeSummary = getSummaryValues(
            row.srcVolume.avgValuePerTransfer.last,
            row.srcVolume.avgValuePerTransfer.prevDay,
            row.srcVolume.avgValuePerTransfer.prev7d,
          )
          const dstAvgVolumeSummary = getSummaryValues(
            row.dstVolume.avgValuePerTransfer.last,
            row.dstVolume.avgValuePerTransfer.prevDay,
            row.dstVolume.avgValuePerTransfer.prev7d,
          )
          const interpretation = interpret(row)

          return (
            <tr key={`${row.id}-${row.timestamp}-${idx}`}>
              <td data-order={row.timestamp}>
                {row.timestamp}{' '}
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  ({row.dataPoints.length}d)
                </span>
              </td>
              <td>
                <a
                  href={`/interop/anomalies/${encodeURIComponent(row.id)}`}
                  title="View chart for this id"
                >
                  {row.id}
                </a>
                <MetricLine>chart</MetricLine>
              </td>
              <td data-order={row.counts.last}>
                {formatCount(row.counts.last)}
              </td>
              <td data-order={Math.abs(countSummary.pctDiffDay ?? 0)}>
                <CountDeltaCell
                  diffDay={countSummary.diffDay}
                  diff7d={countSummary.diff7d}
                  pctDiffDay={countSummary.pctDiffDay}
                  pctDiff7d={countSummary.pctDiff7d}
                />
              </td>
              <td
                data-order={Math.max(
                  row.srcVolume.valueUsd.last,
                  row.dstVolume.valueUsd.last,
                )}
              >
                <MetricLine>
                  Src {formatDollars(row.srcVolume.valueUsd.last)}
                </MetricLine>
                <MetricLine>
                  Dst {formatDollars(row.dstVolume.valueUsd.last)}
                </MetricLine>
              </td>
              <td
                data-order={Math.max(
                  Math.abs(srcValueSummary.pctDiffDay ?? 0),
                  Math.abs(dstValueSummary.pctDiffDay ?? 0),
                )}
              >
                <PercentBySourceCell
                  srcPctDay={srcValueSummary.pctDiffDay}
                  srcPct7d={srcValueSummary.pctDiff7d}
                  dstPctDay={dstValueSummary.pctDiffDay}
                  dstPct7d={dstValueSummary.pctDiff7d}
                />
              </td>
              <td data-order={row.srcDstDiff.lastPercent ?? -1}>
                <div
                  style={{
                    fontSize: '11px',
                    color: getGapColor(row.srcDstDiff.lastPercent),
                    fontWeight: row.srcDstDiff.isHigh ? 700 : 600,
                  }}
                >
                  Now {formatGapPercent(row.srcDstDiff.lastPercent)}
                </div>
                <MetricLine>
                  1d {formatGapPercent(row.srcDstDiff.prevDayPercent)} · 7d{' '}
                  {formatGapPercent(row.srcDstDiff.prev7dPercent)}
                </MetricLine>
              </td>
              <td
                data-order={Math.max(
                  row.srcVolume.avgValuePerTransfer.last ?? 0,
                  row.dstVolume.avgValuePerTransfer.last ?? 0,
                )}
              >
                <MetricLine>
                  Src {formatDollars(row.srcVolume.avgValuePerTransfer.last)}
                </MetricLine>
                <MetricLine>
                  Dst {formatDollars(row.dstVolume.avgValuePerTransfer.last)}
                </MetricLine>
              </td>
              <td
                data-order={Math.max(
                  Math.abs(srcAvgVolumeSummary.pctDiffDay ?? 0),
                  Math.abs(dstAvgVolumeSummary.pctDiffDay ?? 0),
                )}
              >
                <PercentBySourceCell
                  srcPctDay={srcAvgVolumeSummary.pctDiffDay}
                  srcPct7d={srcAvgVolumeSummary.pctDiff7d}
                  dstPctDay={dstAvgVolumeSummary.pctDiffDay}
                  dstPct7d={dstAvgVolumeSummary.pctDiff7d}
                />
              </td>
              <td>
                <MiniChartsCell row={row} />
              </td>
              <td>{interpretation || '-'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function SuspiciousTransfersTable(props: {
  transfers: InteropSuspiciousTransferRecord[]
  valueDiffThresholdPercent: number
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="suspicious-transfers" className="display">
      <thead>
        <tr>
          <th>Timestamp UTC</th>
          <th>Plugin</th>
          <th>Transfer ID</th>
          <th>Type</th>
          <th>Src chain</th>
          <th>Dst chain</th>
          <th>Src token</th>
          <th>Dst token</th>
          <th>Src value (USD)</th>
          <th>Dst value (USD)</th>
          <th>Diff %</th>
          <th>Src tx</th>
          <th>Dst tx</th>
        </tr>
      </thead>
      <tbody>
        {props.transfers.map((transfer) => (
          <tr
            key={`${transfer.transferId}-${transfer.srcTxHash}-${transfer.dstTxHash}`}
          >
            <td data-order={transfer.timestamp}>
              {formatUtcDateTime(transfer.timestamp)}
            </td>
            <td>{transfer.plugin}</td>
            <td>{transfer.transferId}</td>
            <td>{transfer.type}</td>
            <td>{transfer.srcChain}</td>
            <td>{transfer.dstChain}</td>
            <td>
              <TokenUiLink
                chain={transfer.srcChain}
                tokenAddress={transfer.srcTokenAddress}
                tokenSymbol={transfer.srcSymbol}
              />
            </td>
            <td>
              <TokenUiLink
                chain={transfer.dstChain}
                tokenAddress={transfer.dstTokenAddress}
                tokenSymbol={transfer.dstSymbol}
              />
            </td>
            <td data-order={transfer.srcValueUsd ?? -1}>
              {formatDollars(transfer.srcValueUsd)}
            </td>
            <td data-order={transfer.dstValueUsd ?? -1}>
              {formatDollars(transfer.dstValueUsd)}
            </td>
            <td data-order={transfer.valueDifferencePercent}>
              <span
                style={{
                  color:
                    transfer.valueDifferencePercent >
                    props.valueDiffThresholdPercent
                      ? '#b91c1c'
                      : '#15803d',
                  fontWeight: 700,
                }}
              >
                {formatGapPercent(transfer.valueDifferencePercent)}
              </span>
            </td>
            <td>
              <TransferTxHash
                chain={transfer.srcChain}
                txHash={transfer.srcTxHash}
                getExplorerUrl={props.getExplorerUrl}
              />
            </td>
            <td>
              <TransferTxHash
                chain={transfer.dstChain}
                txHash={transfer.dstTxHash}
                getExplorerUrl={props.getExplorerUrl}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TransferTxHash(props: {
  chain: string
  txHash: string
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const explorerUrl = props.getExplorerUrl(props.chain)
  if (!explorerUrl) {
    return <>{props.txHash}</>
  }

  return (
    <a target="_blank" href={`${explorerUrl}/tx/${props.txHash}`}>
      <ShortenedHash hash={props.txHash} />
    </a>
  )
}

function TokenUiLink(props: {
  chain: string
  tokenAddress: string | undefined
  tokenSymbol: string | undefined
}) {
  const href = getTokenUiHref({
    chain: props.chain,
    tokenAddress: props.tokenAddress,
  })
  const label = getTokenLabel(props.tokenSymbol, props.tokenAddress)

  if (!href) {
    return <>{label}</>
  }

  return (
    <a target="_blank" href={href}>
      {label}
    </a>
  )
}

function getTokenUiHref(props: {
  chain: string
  tokenAddress: string | undefined
}): string | undefined {
  if (!props.chain || !props.tokenAddress) {
    return undefined
  }

  let address = props.tokenAddress

  if (props.tokenAddress !== Address32.NATIVE) {
    address = Address32.cropToEthereumAddress(Address32(props.tokenAddress))
  }

  return `https://tokens.l2beat.com/tokens/${props.chain}/${address}`
}

function getTokenLabel(
  tokenSymbol: string | undefined,
  tokenAddress: string | undefined,
) {
  if (tokenSymbol) {
    return tokenSymbol
  }

  if (!tokenAddress) {
    return '-'
  }

  if (tokenAddress === Address32.NATIVE) {
    return 'native'
  }

  if (tokenAddress === Address32.ZERO) {
    return '0x0'
  }

  const address = Address32.cropToEthereumAddress(Address32(tokenAddress))
  return <ShortenedHash hash={address} />
}

function AnomaliesPageLayout(props: {
  stats: DataRowResult[]
  suspiciousTransfers: InteropSuspiciousTransferRecord[]
  valueDiffThresholdPercent: number
  minimumSideValueUsdThreshold: number
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const anomaliesTable = <AnomaliesTable stats={props.stats} />
  const suspiciousTransfersTable = (
    <SuspiciousTransfersTable
      transfers={props.suspiciousTransfers}
      valueDiffThresholdPercent={props.valueDiffThresholdPercent}
      getExplorerUrl={props.getExplorerUrl}
    />
  )

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Aggregated Transfer Anomalies (Latest per ID)',
          table: anomaliesTable,
          tableId: 'anomalies',
          dataTableOptions: {
            order: [
              [0, 'desc'],
              [1, 'asc'],
            ],
            scrollX: true,
            fixedHeader: true,
            autoWidth: false,
            columnDefs: [
              {
                targets: [2],
                type: 'num',
              },
              {
                targets: [3, 5, 8, 9, 10],
                orderable: false,
              },
            ],
          },
        },
        {
          title: `Suspicious Raw Transfers (Src/Dst mismatch > ${props.valueDiffThresholdPercent.toFixed(2)}%, src & dst > ${formatDollars(props.minimumSideValueUsdThreshold)})`,
          table: suspiciousTransfersTable,
          tableId: 'suspicious-transfers',
          dataTableOptions: {
            order: [
              [10, 'desc'],
              [0, 'desc'],
            ],
            scrollX: true,
            fixedHeader: true,
            autoWidth: false,
            columnDefs: [
              {
                targets: [0, 10],
                type: 'num',
              },
              {
                targets: [8, 9],
                type: 'num-fmt',
              },
            ],
          },
        },
      ]}
    />
  )
}

export function renderAnomaliesPage(props: {
  stats: DataRowResult[]
  suspiciousTransfers: InteropSuspiciousTransferRecord[]
  valueDiffThresholdPercent: number
  minimumSideValueUsdThreshold: number
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<AnomaliesPageLayout {...props} />)
  )
}
