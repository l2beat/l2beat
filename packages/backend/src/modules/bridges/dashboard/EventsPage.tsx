import type { BridgeEventRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

export function EventsTable(props: {
  events: BridgeEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Chain</th>
          <th>Tx Hash</th>
          <th>Args</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((e) => {
          const explorerUrl = props.getExplorerUrl(e.chain)

          return (
            <tr>
              <td data-order={e.timestamp}>
                {new Date(e.timestamp * 1000).toLocaleString()}
              </td>
              <td>{e.chain}</td>
              <td>
                {explorerUrl ? (
                  <a href={`${explorerUrl}/tx/${e.txHash}`}>{e.txHash}</a>
                ) : (
                  e.txHash
                )}
              </td>
              <td>{JSON.stringify(e.args)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function EventsPageLayout(props: {
  events: BridgeEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const eventsTable = <EventsTable {...props} />
  const title = `Bridge Events: ${props.events[0]?.type ?? ''}`

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

export function renderEventsPage(props: {
  events: BridgeEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<EventsPageLayout {...props} />)
  )
}
