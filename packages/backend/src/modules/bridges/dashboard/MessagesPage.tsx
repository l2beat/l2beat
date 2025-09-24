import type { BridgeMessageRecord } from '@l2beat/database'
import { formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

function MessagesTable(props: {
  messages: BridgeMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Duration</th>
          <th>srcChain</th>
          <th>srcTx</th>
          <th>dstChain</th>
          <th>dstTx</th>
        </tr>
      </thead>
      <tbody>
        {props.messages.map((e) => {
          const srcExplorerUrl = e.srcChain && props.getExplorerUrl(e.srcChain)
          const dstExplorerUrl = e.dstChain && props.getExplorerUrl(e.dstChain)

          return (
            <tr>
              <td data-order={e.timestamp}>
                {new Date(e.timestamp * 1000).toLocaleString()}
              </td>
              <td>{e.duration && formatSeconds(e.duration)}</td>
              <td>{e.srcChain}</td>
              <td>
                {srcExplorerUrl ? (
                  <a href={`${srcExplorerUrl}/tx/${e.srcTxHash}`}>
                    {e.srcTxHash}
                  </a>
                ) : (
                  e.srcTxHash
                )}
              </td>
              <td>{e.dstChain}</td>
              <td>
                {dstExplorerUrl ? (
                  <a href={`${dstExplorerUrl}/tx/${e.dstTxHash}`}>
                    {e.dstTxHash}
                  </a>
                ) : (
                  e.dstTxHash
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MessagesPageLayout(props: {
  messages: BridgeMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const eventsTable = <MessagesTable {...props} />
  const title = `Bridge Events: ${props.messages[0]?.type ?? ''}`

  const dataTableOptions = {
    pageLength: 25,
    order: [[0, 'desc']], // Sort by timestamp descending
    columnDefs: [
      {
        targets: 0, // Timestamp column
        type: 'num', // Ensure numeric sorting
      },
    ],
  }

  return (
    <DataTablePage
      title={title}
      table={eventsTable}
      tableId="myTable"
      dataTableOptions={dataTableOptions}
    />
  )
}

export function renderMessagesPage(props: {
  messages: BridgeMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<MessagesPageLayout {...props} />)
  )
}
