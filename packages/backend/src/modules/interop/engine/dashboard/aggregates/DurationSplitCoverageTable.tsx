import type { InteropDurationSplit } from '@l2beat/config'
import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import React from 'react'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'

interface DurationSplitCoverageRow {
  projectId: string
  projectName: string
  bridgeType: KnownInteropBridgeType
  observedTransferTypes: string[]
  includedSplits: {
    label: string
    transferTypes: string[]
  }[]
  notIncludedTransferTypes: string[]
}

export function buildDurationSplitCoverageRows(
  transfers: InteropTransferRecord[],
  configs: InteropAggregationConfig[],
): DurationSplitCoverageRow[] {
  const classifier = new InteropTransferClassifier()
  const rows: DurationSplitCoverageRow[] = []

  for (const config of configs) {
    if (!config.durationSplit) continue

    const classifiedTransfers = classifier.classifyTransfers(
      transfers,
      config.plugins,
    )

    for (const [bridgeType, durationSplit] of Object.entries(
      config.durationSplit,
    ) as [KnownInteropBridgeType, InteropDurationSplit][]) {
      const includedSplits = durationSplit.map((split) => ({
        label: split.label,
        transferTypes: [...new Set(split.transferTypes)].sort(),
      }))
      const includedTransferTypes = new Set(
        includedSplits.flatMap((split) => split.transferTypes),
      )
      const observedTransferTypes = [
        ...new Set(
          classifiedTransfers[bridgeType].map((transfer) => transfer.type),
        ),
      ].sort()

      rows.push({
        projectId: config.id,
        projectName: config.shortName ?? config.name ?? config.id,
        bridgeType,
        observedTransferTypes,
        includedSplits,
        notIncludedTransferTypes: observedTransferTypes.filter(
          (transferType) => !includedTransferTypes.has(transferType),
        ),
      })
    }
  }

  return [...rows].sort(
    (a, b) =>
      b.notIncludedTransferTypes.length - a.notIncludedTransferTypes.length ||
      a.projectName.localeCompare(b.projectName) ||
      a.bridgeType.localeCompare(b.bridgeType),
  )
}

export function DurationSplitCoverageTable(props: {
  rows: DurationSplitCoverageRow[]
}) {
  return (
    <>
      <DurationSplitCoverageLegend />
      <table id="durationSplitCoverageTable" className="display">
        <thead>
          <tr>
            <th>Protocol</th>
            <th>Bridge Type</th>
            <th>Included in duration split</th>
            <th>Not included in duration split</th>
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row) => (
            <tr key={`${row.projectId}-${row.bridgeType}`}>
              <td>{row.projectName}</td>
              <td>{row.bridgeType}</td>
              <td
                data-order={row.includedSplits.reduce(
                  (acc, split) => acc + split.transferTypes.length,
                  0,
                )}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {row.includedSplits.map((split) => (
                    <div
                      key={`${row.projectId}-${row.bridgeType}-${split.label}`}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          marginBottom: '4px',
                        }}
                      >
                        {split.label}
                      </div>
                      {split.transferTypes.length > 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '4px',
                          }}
                        >
                          {split.transferTypes.map((transferType) => (
                            <TransferTypeBadge
                              key={`${row.projectId}-${row.bridgeType}-${split.label}-${transferType}`}
                              transferType={transferType}
                              color={
                                row.observedTransferTypes.includes(transferType)
                                  ? 'green'
                                  : 'yellow'
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyCell />
                      )}
                    </div>
                  ))}
                </div>
              </td>
              <td data-order={row.notIncludedTransferTypes.length}>
                {row.notIncludedTransferTypes.length > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    {row.notIncludedTransferTypes.map((transferType) => (
                      <TransferTypeBadge
                        key={`${row.projectId}-${row.bridgeType}-${transferType}`}
                        transferType={transferType}
                        color="red"
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyCell />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TransferTypeBadge(props: {
  transferType: string
  color: 'green' | 'red' | 'yellow'
}) {
  const palette =
    props.color === 'green'
      ? {
          backgroundColor: '#dcfce7',
          borderColor: '#86efac',
          color: '#166534',
        }
      : props.color === 'yellow'
        ? {
            backgroundColor: '#fef3c7',
            borderColor: '#fcd34d',
            color: '#92400e',
          }
        : {
            backgroundColor: '#fee2e2',
            borderColor: '#fca5a5',
            color: '#991b1b',
          }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        border: `1px solid ${palette.borderColor}`,
        backgroundColor: palette.backgroundColor,
        color: palette.color,
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: 1.2,
        padding: '2px 8px',
      }}
    >
      {props.transferType}
    </span>
  )
}

function EmptyCell() {
  return <span style={{ color: '#888' }}>-</span>
}

function DurationSplitCoverageLegend() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TransferTypeBadge transferType="Seen in transfers" color="green" />
        <span>Included in duration split and found in latest transfers</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TransferTypeBadge transferType="Configured only" color="yellow" />
        <span>
          Included in duration split but not found in latest transfers
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TransferTypeBadge transferType="Missing config" color="red" />
        <span>
          Found in latest transfers but not included in duration split
        </span>
      </div>
    </div>
  )
}
