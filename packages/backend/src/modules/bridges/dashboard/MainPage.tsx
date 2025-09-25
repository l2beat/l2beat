import type {
  BridgeEventStatsRecord,
  BridgeMessageStatsRecord,
  BridgeTransfersStatsRecord,
} from '@l2beat/database'
import { formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

function EventsTable(props: { events: BridgeEventStatsRecord[] }) {
  return (
    <table id="eventsTable" className="display">
      <thead>
        <tr>
          <th>Type</th>
          <th>All</th>
          <th>Matched</th>
          <th>Unmatched</th>
          <th>Umatched ({'>'} 2h ago)</th>
          <th>Unsupported</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((e) => {
          return (
            <tr>
              <td>{e.type}</td>
              <td>
                <a href={`/bridges/events/all/${e.type}`}>{e.count}</a>
              </td>
              <td>
                <a href={`/bridges/events/matched/${e.type}`}>{e.matched}</a>
              </td>
              <td>
                <a href={`/bridges/events/unmatched/${e.type}`}>
                  {e.unmatched}
                </a>
              </td>
              <td>
                <a href={`/bridges/events/old-unmatched/${e.type}`}>
                  {e.oldUnmatched}
                </a>
              </td>
              <td>
                <a href={`/bridges/events/unsupported/${e.type}`}>
                  {e.unsupported}
                </a>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const NETWORKS: [
  { name: string; display: string },
  { name: string; display: string },
][] = [
  [
    {
      name: 'ethereum',
      display: 'ETH',
    },
    {
      name: 'base',
      display: 'BASE',
    },
  ],
  [
    {
      name: 'ethereum',
      display: 'ETH',
    },
    {
      name: 'arbitrum',
      display: 'ARB',
    },
  ],
  [
    {
      name: 'ethereum',
      display: 'ETH',
    },
    {
      name: 'optimism',
      display: 'OP',
    },
  ],
  [
    {
      name: 'base',
      display: 'BASE',
    },
    {
      name: 'arbitrum',
      display: 'ARB',
    },
  ],
  [
    {
      name: 'base',
      display: 'BASE',
    },
    {
      name: 'optimism',
      display: 'OP',
    },
  ],
  [
    {
      name: 'arbitrum',
      display: 'ARB',
    },
    {
      name: 'optimism',
      display: 'OP',
    },
  ],
]

// currently this component is used also for Transfers
function MessagesTable(props: {
  items: BridgeTransfersStatsRecord[] | BridgeMessageStatsRecord[]
  id: string
  type: 'messages' | 'transfers'
}) {
  return (
    <table id={props.id} className="display">
      <thead>
        <tr>
          <th rowSpan={2}>Type</th>
          <th rowSpan={2}>Count</th>
          <th rowSpan={2}>Median Duration</th>
          {NETWORKS.map((n) => (
            <>
              <th colSpan={2}>
                {n[0].display} {'>'} {n[1].display}
              </th>
              <th colSpan={2}>
                {n[0].display} {'<'} {n[1].display}
              </th>
            </>
          ))}
        </tr>
        <tr>
          {NETWORKS.map((_) => (
            <>
              <th>Count</th>
              <th>Duration</th>
              <th>Count</th>
              <th>Duration</th>
            </>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.items.map((t) => {
          return (
            <tr>
              <td>{t.type}</td>
              <td>
                <a href={`/bridges/${props.type}/${t.type}`}>{t.count}</a>
              </td>
              <td data-order={t.medianDuration}>
                {formatSeconds(t.medianDuration)}
              </td>
              {NETWORKS.map((n) => {
                const srcDstCount = t.chains.find(
                  (tt) =>
                    tt.sourceChain === n[0].name &&
                    tt.destinationChain === n[1].name,
                )?.count
                const srcDstDuration = t.chains.find(
                  (tt) =>
                    tt.sourceChain === n[0].name &&
                    tt.destinationChain === n[1].name,
                )?.medianDuration
                const dstSrcCount = t.chains.find(
                  (tt) =>
                    tt.sourceChain === n[1].name &&
                    tt.destinationChain === n[0].name,
                )?.count
                const dstSrcDuration = t.chains.find(
                  (tt) =>
                    tt.sourceChain === n[1].name &&
                    tt.destinationChain === n[0].name,
                )?.medianDuration
                return (
                  <>
                    <td>
                      {srcDstCount && (
                        <a
                          href={`/bridges/${props.type}/${t.type}?srcChain=${n[0].name}&dstChain=${n[1].name}`}
                        >
                          {srcDstCount}
                        </a>
                      )}
                    </td>
                    <td data-order={srcDstDuration ?? ''}>
                      {srcDstDuration && formatSeconds(srcDstDuration)}
                    </td>
                    <td>
                      {dstSrcCount && (
                        <a
                          href={`/bridges/${props.type}/${t.type}?srcChain=${n[1].name}&dstChain=${n[0].name}`}
                        >
                          {dstSrcCount}
                        </a>
                      )}
                    </td>
                    <td data-order={dstSrcDuration ?? ''}>
                      {dstSrcDuration && formatSeconds(dstSrcDuration)}
                    </td>
                  </>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MainPageLayout(props: {
  events: BridgeEventStatsRecord[]
  messages: BridgeMessageStatsRecord[]
  transfers: BridgeTransfersStatsRecord[]
}) {
  const eventsTable = <EventsTable {...props} />
  const messagesTable = (
    <MessagesTable
      id="messagesTable"
      items={props.messages}
      type={'messages'}
    />
  )
  const transfersTable = (
    <MessagesTable
      id="transfersTable"
      items={props.transfers}
      type={'transfers'}
    />
  )

  return (
    <DataTablePage
      showHome={false}
      tables={[
        {
          title: 'Events',
          table: eventsTable,
          tableId: 'eventsTable',
          dataTableOptions: {
            pageLength: 10,
            order: [[0, 'asc']],
          },
        },
        {
          // TODO: colvis group
          // TODO: route to lists
          title: 'Messages',
          table: messagesTable,
          tableId: 'messagesTable',
          dataTableOptions: {
            pageLength: 10,
            order: [[0, 'asc']],
          },
        },
        {
          title: 'Transfers',
          table: transfersTable,
          tableId: 'transfersTable',
          dataTableOptions: {
            pageLength: 10,
            order: [[0, 'asc']],
          },
        },
      ]}
    />
  )
}

export function renderMainPage(props: {
  events: BridgeEventStatsRecord[]
  messages: BridgeMessageStatsRecord[]
  transfers: BridgeTransfersStatsRecord[]
}) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(<MainPageLayout {...props} />)
}
