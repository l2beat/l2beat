import React from 'react'

export interface ExperimentalStatsProps {
  visible: boolean
  showExcludingEth?: boolean
  inflows?: string
  outflows?: string
  batchCount?: number
  transactionCount?: number
}

export function ExperimentalStats(props: ExperimentalStatsProps) {
  if (!props.visible) {
    return null
  }

  const excludingEth = props.showExcludingEth && (
    <>
      {' '}
      <span style={{ fontSize: 'var(--font-s)' }}>(excl. ETH)</span>
    </>
  )

  return (
    <>
      <p className="LinkSection-Title">Experimental Stats (7 days)</p>
      <table className="LinkSection-Table">
        <tbody>
          {props.inflows !== undefined && (
            <tr>
              <th>Inflows</th>
              <td style={{ display: 'block' }}>
                {props.inflows}
                {excludingEth}
              </td>
            </tr>
          )}
          {props.outflows !== undefined && (
            <tr>
              <th>Outflows</th>
              <td style={{ display: 'block' }}>
                {props.outflows}
                {excludingEth}
              </td>
            </tr>
          )}
          {props.batchCount !== undefined && (
            <tr>
              <th>Batches</th>
              <td>{props.batchCount}</td>
            </tr>
          )}
          {props.transactionCount !== undefined && (
            <tr>
              <th>Transactions</th>
              <td>{props.transactionCount}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
