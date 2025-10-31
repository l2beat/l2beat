import type {
  InteropEventStatsRecord,
  InteropMessageDetailedStatsRecord,
  InteropMessageStatsRecord,
  InteropTransfersDetailedStatsRecord,
  InteropTransfersStatsRecord,
} from '@l2beat/database'
import type { InteropMissingTokenInfo } from '@l2beat/database/dist/repositories/InteropTransferRepository'
import { formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Address32 } from '../../plugins/types'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import {
  type ProcessorsStatus,
  ProcessorsStatusTable,
} from './ProcessorsStatusTable'

type MessageStats = InteropMessageStatsRecord & {
  chains: InteropMessageDetailedStatsRecord[]
}

type TransferStats = InteropTransfersStatsRecord & {
  chains: InteropTransfersDetailedStatsRecord[]
}

function EventsTable(props: { events: InteropEventStatsRecord[] }) {
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
                <a href={`/interop/events/all/${e.type}`}>{e.count}</a>
              </td>
              <td>
                <a href={`/interop/events/matched/${e.type}`}>{e.matched}</a>
              </td>
              <td>
                <a href={`/interop/events/unmatched/${e.type}`}>
                  {e.unmatched}
                </a>
              </td>
              <td>
                <a href={`/interop/events/old-unmatched/${e.type}`}>
                  {e.oldUnmatched}
                </a>
              </td>
              <td>
                <a href={`/interop/events/unsupported/${e.type}`}>
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

function MessagesTable(props: { items: MessageStats[]; id: string }) {
  return (
    <table id={props.id} className="display">
      <thead>
        <tr>
          <th rowSpan={2}>Type</th>
          <th rowSpan={2}>Count</th>
          <th rowSpan={2}>Median Duration</th>
          <th rowSpan={2}>Known %</th>
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
                <a href={`/interop/messages/${t.type}`}>{t.count}</a>
              </td>
              <td data-order={t.medianDuration}>
                {formatSeconds(t.medianDuration)}
              </td>
              {
                <td>
                  {t.count > 0
                    ? ((t.knownAppCount / t.count) * 100).toFixed(1) + '%'
                    : ''}
                </td>
              }
              {NETWORKS.map((n) => {
                const srcDstCount = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )?.count
                const srcDstDuration = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )?.medianDuration
                const dstSrcCount = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )?.count
                const dstSrcDuration = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )?.medianDuration
                return (
                  <>
                    <td>
                      {srcDstCount && (
                        <a
                          href={`/interop/messages/${t.type}?srcChain=${n[0].name}&dstChain=${n[1].name}`}
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
                          href={`/interop/messages/${t.type}?srcChain=${n[1].name}&dstChain=${n[0].name}`}
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

function TransfersTable(props: { items: TransferStats[]; id: string }) {
  return (
    <table id={props.id} className="display">
      <thead>
        <tr>
          <th rowSpan={2}>Type</th>
          <th rowSpan={2}>Count</th>
          <th rowSpan={2}>Median Duration</th>
          <th rowSpan={2}>srcValue</th>
          <th rowSpan={2}>dstValue</th>
          {NETWORKS.map((n) => (
            <>
              <th
                colSpan={4}
                style={{ textAlign: 'center', border: '1px solid black' }}
              >
                {n[0].display} {'>'} {n[1].display}
              </th>
              <th colSpan={4} style={{ textAlign: 'center' }}>
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
              <th>srcValue</th>
              <th>dstValue</th>
              <th>Count</th>
              <th>Duration</th>
              <th>srcValue</th>
              <th>dstValue</th>
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
                <a href={`/interop/transfers/${t.type}`}>{t.count}</a>
              </td>
              <td data-order={t.medianDuration}>
                {formatSeconds(t.medianDuration)}
              </td>
              <td data-order={t.srcValueSum}>{formatDollars(t.srcValueSum)}</td>
              <td data-order={t.dstValueSum}>{formatDollars(t.dstValueSum)}</td>
              {NETWORKS.map((n) => {
                const forwardStats = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )
                const backwardStats = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )

                const forwardCount = forwardStats?.count
                const forwardDuration = forwardStats?.medianDuration
                const forwardDstValue = forwardStats?.dstValueSum
                const forwardSrcValue = forwardStats?.srcValueSum
                const backwardCount = backwardStats?.count
                const backwardDuration = backwardStats?.medianDuration
                const backwardSrcValue = backwardStats?.srcValueSum
                const backwardDstValue = backwardStats?.dstValueSum
                return (
                  <>
                    <td>
                      {
                        <a
                          href={`/interop/transfers/${t.type}?srcChain=${n[0].name}&dstChain=${n[1].name}`}
                        >
                          {forwardCount}
                        </a>
                      }
                    </td>
                    <td data-order={forwardDuration}>
                      {forwardDuration && formatSeconds(forwardDuration)}
                    </td>
                    <td data-order={forwardSrcValue}>
                      {formatDollars(forwardSrcValue)}
                    </td>
                    <td data-order={forwardDstValue}>
                      {formatDollars(forwardDstValue)}
                    </td>
                    <td>
                      {
                        <a
                          href={`/interop/transfers/${t.type}?srcChain=${n[1].name}&dstChain=${n[0].name}`}
                        >
                          {backwardCount}
                        </a>
                      }
                    </td>
                    <td data-order={backwardDuration}>
                      {backwardDuration && formatSeconds(backwardDuration)}
                    </td>
                    <td data-order={backwardSrcValue}>
                      {formatDollars(backwardSrcValue)}
                    </td>
                    <td data-order={backwardDstValue}>
                      {formatDollars(backwardDstValue)}
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

function MissingTokensTable(props: {
  missingTokens: InteropMissingTokenInfo[]
  getExplorerUrl: (chain: string) => string | undefined
  id: string
}) {
  return (
    <table id={props.id} className="display">
      <thead>
        <tr>
          <th>Chain</th>
          <th>Address</th>
          <th>Count</th>
          <th>Plugins</th>
        </tr>
      </thead>
      <tbody>
        {props.missingTokens.map((t) => {
          const explorerUrl = props.getExplorerUrl(t.chain)
          const address =
            t.tokenAddress !== 'native' && t.tokenAddress !== Address32.ZERO
              ? Address32.cropToEthereumAddress(t.tokenAddress as Address32)
              : t.tokenAddress
          return (
            <tr>
              <td>{t.chain}</td>
              <td>
                {explorerUrl &&
                t.tokenAddress !== 'native' &&
                t.tokenAddress !== Address32.ZERO ? (
                  <a target="_blank" href={`${explorerUrl}/address/${address}`}>
                    {address}
                  </a>
                ) : (
                  address
                )}
              </td>
              <td>{t.count}</td>
              <td>{t.plugins.join(', ')}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MainPageLayout(props: {
  events: InteropEventStatsRecord[]
  messages: MessageStats[]
  transfers: TransferStats[]
  status: ProcessorsStatus[]
  missingTokens: InteropMissingTokenInfo[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const eventsTable = <EventsTable {...props} />
  const messagesTable = (
    <MessagesTable id="messagesTable" items={props.messages} />
  )
  const transfersTable = (
    <TransfersTable id="transfersTable" items={props.transfers} />
  )
  const missingTokensTable = (
    <MissingTokensTable
      id="missingTokensTable"
      missingTokens={props.missingTokens}
      getExplorerUrl={props.getExplorerUrl}
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
            order: [[0, 'asc']],
          },
        },
        {
          title: 'Messages',
          table: messagesTable,
          tableId: 'messagesTable',
          dataTableOptions: {
            order: [[0, 'asc']],
          },
        },
        {
          title: 'Transfers',
          table: transfersTable,
          tableId: 'transfersTable',
          dataTableOptions: {
            order: [[0, 'asc']],
          },
        },
        {
          title: 'Missing Tokens',
          table: missingTokensTable,
          tableId: 'missingTokensTable',
          dataTableOptions: {
            order: [[2, 'desc']],
            pageLength: 25,
          },
        },
      ]}
      footer={
        <>
          <>
            <h3> Apps for message types </h3>
            {props.messages.map(
              (m) =>
                m.knownApps.length > 0 && (
                  <div key={m.type}>
                    <h4>{m.type}</h4>
                    <ul>
                      {m.knownApps.map((app) => (
                        <li key={app}>{app}</li>
                      ))}
                    </ul>
                  </div>
                ),
            )}
          </>
          <ProcessorsStatusTable processors={props.status} />
        </>
      }
    />
  )
}

export function renderMainPage(props: {
  events: InteropEventStatsRecord[]
  messages: MessageStats[]
  transfers: TransferStats[]
  status: ProcessorsStatus[]
  missingTokens: InteropMissingTokenInfo[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(<MainPageLayout {...props} />)
}
