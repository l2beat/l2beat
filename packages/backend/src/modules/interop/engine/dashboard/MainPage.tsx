import type {
  InteropEventStatsRecord,
  InteropMessageDetailedStatsRecord,
  InteropMessageStatsRecord,
  InteropMessageUniqueAppsRecord,
  InteropPluginSyncedRangeRecord,
  InteropTransfersDetailedStatsRecord,
  InteropTransfersStatsRecord,
} from '@l2beat/database'
import type { InteropMissingTokenInfo } from '@l2beat/database/dist/repositories/InteropTransferRepository'
import {
  Address32,
  formatSeconds,
  type LongChainName,
} from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { getInteropChains } from '../../../../config/makeConfig'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import { generateNetworkPairs } from './generateNetworkPairs'
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

function formatDistanceFromNow(timestamp: number): string {
  const nowMs = Date.now()
  const timestampMs = timestamp * 1000
  const diffMs = Math.max(0, nowMs - timestampMs)
  if (diffMs < 60_000) {
    return '<1m'
  }

  const totalMinutes = Math.ceil(diffMs / 60_000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []

  if (days) {
    parts.push(`${days}d`)
  }
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes || parts.length === 0) {
    parts.push(`${minutes}m`)
  }

  return parts.join(' ')
}

function PluginsStatusTable(props: {
  syncedRanges: InteropPluginSyncedRangeRecord[]
  syncersManager: InteropSyncersManager
}) {
  return (
    <table>
      <caption>Plugins status</caption>
      <thead>
        <th>plugin</th>
        <th>chain</th>
        <th>sync mode</th>
        <th>distance from now</th>
        <th>toBlock</th>
        <th>last error</th>
      </thead>
      <tbody>
        {props.syncedRanges.map((r) => (
          <tr>
            <td>{r.pluginName}</td>
            <td>{r.chain}</td>
            <td>
              {props.syncersManager.getSyncer(
                r.pluginName,
                r.chain as LongChainName,
              )?.syncMode ?? 'error'}
            </td>
            <td>{formatDistanceFromNow(r.toTimestamp)}</td>
            <td>{r.toBlock}</td>
            <td>{r.lastError ?? ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function EventsTable(props: { events: InteropEventStatsRecord[] }) {
  return (
    <table id="eventsTable" className="display">
      <thead>
        <tr>
          <th>Type</th>
          <th>Direction</th>
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
            <tr key={e.type}>
              <td>{e.type}</td>
              <td>{e.direction}</td>
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

const NETWORKS = generateNetworkPairs(getInteropChains())

function MessagesTable(props: { items: MessageStats[]; id: string }) {
  return (
    <table id={props.id} className="display">
      <thead>
        <tr>
          <th rowSpan={2}>Type</th>
          <th rowSpan={2}>Count</th>
          <th rowSpan={2}>Median Duration</th>
          <th rowSpan={2}>Known %</th>
          {NETWORKS.map((n, idx) => (
            <React.Fragment key={`header-${idx}`}>
              <th colSpan={2}>
                {n[0].display} {'>'} {n[1].display}
              </th>
              <th colSpan={2}>
                {n[0].display} {'<'} {n[1].display}
              </th>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          {NETWORKS.map((_, idx) => (
            <React.Fragment key={`subheader-${idx}`}>
              <th>Count</th>
              <th>Duration</th>
              <th>Count</th>
              <th>Duration</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.items.map((t) => {
          return (
            <tr key={t.type}>
              <td>{t.type}</td>
              <td>
                <a href={`/interop/messages/${t.type}`}>{t.count}</a>
              </td>
              <td data-order={t.avgDuration}>{formatSeconds(t.avgDuration)}</td>
              {
                <td>
                  {t.count > 0
                    ? ((t.knownAppCount / t.count) * 100).toFixed(1) + '%'
                    : ''}
                </td>
              }
              {NETWORKS.map((n, idx) => {
                const srcDstCount = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )?.count
                const srcDstDuration = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )?.avgDuration
                const dstSrcCount = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )?.count
                const dstSrcDuration = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )?.avgDuration
                return (
                  <React.Fragment key={`${t.type}-${idx}`}>
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
                  </React.Fragment>
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
          {NETWORKS.map((n, idx) => (
            <React.Fragment key={`transfer-header-${idx}`}>
              <th
                colSpan={4}
                style={{ textAlign: 'center', border: '1px solid black' }}
              >
                {n[0].display} {'>'} {n[1].display}
              </th>
              <th colSpan={4} style={{ textAlign: 'center' }}>
                {n[0].display} {'<'} {n[1].display}
              </th>
            </React.Fragment>
          ))}
        </tr>
        <tr>
          {NETWORKS.map((_, idx) => (
            <React.Fragment key={`transfer-subheader-${idx}`}>
              <th>Count</th>
              <th>Duration</th>
              <th>srcValue</th>
              <th>dstValue</th>
              <th>Count</th>
              <th>Duration</th>
              <th>srcValue</th>
              <th>dstValue</th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.items.map((t) => {
          return (
            <tr key={t.type}>
              <td>{t.type}</td>
              <td>
                <a href={`/interop/transfers/${t.type}`}>{t.count}</a>
              </td>
              <td data-order={t.avgDuration}>{formatSeconds(t.avgDuration)}</td>
              <td data-order={t.srcValueSum}>{formatDollars(t.srcValueSum)}</td>
              <td data-order={t.dstValueSum}>{formatDollars(t.dstValueSum)}</td>
              {NETWORKS.map((n, idx) => {
                const forwardStats = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[0].name && tt.dstChain === n[1].name,
                )
                const backwardStats = t.chains.find(
                  (tt) =>
                    tt.srcChain === n[1].name && tt.dstChain === n[0].name,
                )

                const forwardCount = forwardStats?.count
                const forwardDuration = forwardStats?.avgDuration
                const forwardDstValue = forwardStats?.dstValueSum
                const forwardSrcValue = forwardStats?.srcValueSum
                const backwardCount = backwardStats?.count
                const backwardDuration = backwardStats?.avgDuration
                const backwardSrcValue = backwardStats?.srcValueSum
                const backwardDstValue = backwardStats?.dstValueSum
                return (
                  <React.Fragment key={`${t.type}-${idx}`}>
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
                  </React.Fragment>
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
            <tr key={`${t.chain}-${t.tokenAddress}`}>
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
  uniqueApps: InteropMessageUniqueAppsRecord[]
  syncedRanges: InteropPluginSyncedRangeRecord[]
  syncersManager: InteropSyncersManager
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
    <>
      <a href="/interop/configs" target="_blank">
        Automated configs
      </a>
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
            <PluginsStatusTable
              syncedRanges={props.syncedRanges}
              syncersManager={props.syncersManager}
            />
            <h3>Known apps for plugins</h3>
            {props.uniqueApps.map((u) => (
              <div>
                <h4>{u.plugin}</h4>
                <ul>
                  {u.apps.map((a) => (
                    <li>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
            <ProcessorsStatusTable processors={props.status} />
          </>
        }
      />
    </>
  )
}

export function renderMainPage(props: {
  events: InteropEventStatsRecord[]
  messages: MessageStats[]
  transfers: TransferStats[]
  status: ProcessorsStatus[]
  missingTokens: InteropMissingTokenInfo[]
  uniqueApps: InteropMessageUniqueAppsRecord[]
  syncedRanges: InteropPluginSyncedRangeRecord[]
  syncersManager: InteropSyncersManager
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(<MainPageLayout {...props} />)
}
