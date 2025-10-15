import type { InteropMessageRecord } from '@l2beat/database'
import { formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import {
  type ProcessorsStatus,
  ProcessorsStatusTable,
} from './ProcessorsStatusTable'

function MessagesTable(props: {
  messages: InteropMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Timestamp UTC</th>
          <th>Duration</th>
          <th>App</th>
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
              <td>{e.app}</td>
              <td>{e.srcChain}</td>
              <td>
                {srcExplorerUrl ? (
                  <a
                    target="_blank"
                    href={`${srcExplorerUrl}/tx/${e.srcTxHash}`}
                  >
                    {e.srcTxHash}
                  </a>
                ) : (
                  e.srcTxHash
                )}
              </td>
              <td>{e.dstChain}</td>
              <td>
                {dstExplorerUrl ? (
                  <a
                    target="_blank"
                    href={`${dstExplorerUrl}/tx/${e.dstTxHash}`}
                  >
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
  messages: InteropMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  const eventsTable = <MessagesTable {...props} />

  const dataTableOptions = {
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
      showHome={true}
      tables={[
        {
          title: `Messages: ${props.messages[0]?.type ?? ''}`,
          table: eventsTable,
          tableId: 'myTable',
          dataTableOptions: dataTableOptions,
        },
      ]}
      footer={<ProcessorsStatusTable processors={props.status} />}
    />
  )
}

export function renderMessagesPage(props: {
  messages: InteropMessageRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<MessagesPageLayout {...props} />)
  )
}
