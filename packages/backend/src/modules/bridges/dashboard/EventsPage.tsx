import type { BridgeEventRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

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
  return (
    <html>
      <head>
        <title>Bridge Events</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" />
        <link
          rel="stylesheet"
          href="https://cdn.datatables.net/1.13.7/css/jquery.dataTables.min.css"
        />
        <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js" />

        <style>{`
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            margin: 20px 0;
          }
        `}</style>
      </head>
      <body>
        <h1>Bridge Events: {props.events[0].type ?? ''}</h1>

        <EventsTable {...props} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
            $(document).ready(function() {
              $('#myTable').DataTable({
                pageLength: 25,
                order: [[0, 'desc']], // Sort by timestamp descending by default
                columnDefs: [
                  {
                    targets: 0, // Timestamp column
                    type: 'num' // Ensure numeric sorting
                  }
                ]
              });
            });
          `,
          }}
        />
      </body>
    </html>
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
