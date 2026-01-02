import type { InteropEventRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import {
  type ProcessorsStatus,
  ProcessorsStatusTable,
} from './ProcessorsStatusTable'

function ShortenedHash({ hash }: { hash: string }) {
  if (hash.length <= 14) return <>{hash}</>
  return (
    <>
      <span style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        {hash}
      </span>
      {`${hash.slice(0, 6)}...${hash.slice(-4)}`}
    </>
  )
}

function EventsTable(props: {
  events: InteropEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="events" className="display">
      <thead>
        <tr>
          <th>Timestamp UTC</th>
          <th>Chain</th>
          <th>Tx Hash</th>
          <th>$srcChain</th>
          <th>$dstChain</th>
          <th>Args</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((e) => {
          const explorerUrl = props.getExplorerUrl(e.chain)
          const srcChain = (e.args as { $srcChain?: string }).$srcChain
          const dstChain = (e.args as { $dstChain?: string }).$dstChain

          return (
            <tr key={`${e.chain}-${e.ctx.txHash}-${e.ctx.logIndex}`}>
              <td data-order={e.timestamp}>
                {new Date(e.timestamp * 1000).toLocaleString()}
              </td>
              <td>{e.chain}</td>
              <td>
                {explorerUrl ? (
                  <a target="_blank" href={`${explorerUrl}/tx/${e.ctx.txHash}`}>
                    <ShortenedHash hash={e.ctx.txHash} />
                  </a>
                ) : (
                  <ShortenedHash hash={e.ctx.txHash} />
                )}
              </td>
              <td>{srcChain ?? ''}</td>
              <td>{dstChain ?? ''}</td>
              <td>
                {JSON.stringify(e.args, (_, value) =>
                  typeof value === 'bigint' ? `BigInt(${value})` : value,
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function EventsPageLayout(props: {
  events: InteropEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  const eventsTable = <EventsTable {...props} />

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
          title: `Interop Events: ${props.events[0]?.type ?? ''} (${props.events[0].direction ?? '<missing_direction>'})`,
          table: eventsTable,
          tableId: 'events',
          dataTableOptions: dataTableOptions,
        },
      ]}
      footer={<ProcessorsStatusTable processors={props.status} />}
    />
  )
}

export function renderEventsPage(props: {
  events: InteropEventRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<EventsPageLayout {...props} />)
  )
}
