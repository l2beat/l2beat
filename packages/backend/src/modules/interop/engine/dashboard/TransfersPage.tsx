import type { InteropTransferRecord } from '@l2beat/database'
import { Address32, formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import {
  type ProcessorsStatus,
  ProcessorsStatusTable,
} from './ProcessorsStatusTable'
import { ShortenedHash } from './ShortenedHash'

function BooleanCell({
  value,
  trueLabel,
  falseLabel,
}: {
  value: boolean | undefined
  trueLabel: string
  falseLabel: string
}) {
  if (value === undefined) {
    return <span style={{ color: '#888' }}>-</span>
  }
  return (
    <span style={{ color: value ? '#e67e22' : '#3498db' }}>
      {value ? trueLabel : falseLabel}
    </span>
  )
}

function TransfersTable(props: {
  transfers: InteropTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Plugin</th>
          <th>Timestamp UTC</th>
          <th>Duration</th>
          <th>srcToken</th>
          <th>srcValue</th>
          <th>srcBurned</th>
          <th>dstToken</th>
          <th>dstValue</th>
          <th>dstMinted</th>
          <th>srcChain</th>
          <th>srcTx</th>
          <th>srcToken</th>
          <th>dstChain</th>
          <th>dstTx</th>
          <th>dstToken</th>
        </tr>
      </thead>
      <tbody>
        {props.transfers.map((e) => {
          const srcExplorerUrl = e.srcChain && props.getExplorerUrl(e.srcChain)
          const dstExplorerUrl = e.dstChain && props.getExplorerUrl(e.dstChain)

          return (
            <tr
              key={`${e.srcChain}-${e.srcTxHash}-${e.dstChain}-${e.dstTxHash}`}
            >
              <td>{e.plugin}</td>
              <td data-order={e.timestamp}>
                {new Date(e.timestamp * 1000).toLocaleString()}
              </td>
              <td>{e.duration && formatSeconds(e.duration)}</td>
              <td>
                {e.srcAmount} {e.srcSymbol}
              </td>
              <td data-order={e.srcValueUsd}>{formatDollars(e.srcValueUsd)}</td>
              <td>
                <BooleanCell value={e.srcWasBurned} trueLabel="burned" falseLabel="locked" />
              </td>
              <td>
                {e.dstAmount} {e.dstSymbol}
              </td>
              <td data-order={e.dstValueUsd}>{formatDollars(e.dstValueUsd)}</td>
              <td>
                <BooleanCell value={e.dstWasMinted} trueLabel="minted" falseLabel="released" />
              </td>
              <td>{e.srcChain}</td>
              <td>
                {srcExplorerUrl ? (
                  <a
                    target="_blank"
                    href={`${srcExplorerUrl}/tx/${e.srcTxHash}`}
                  >
                    <ShortenedHash hash={e.srcTxHash} />
                  </a>
                ) : (
                  <ShortenedHash hash={e.srcTxHash} />
                )}
              </td>
              <td>
                <TokenAddress
                  explorerUrl={srcExplorerUrl}
                  address={e.srcTokenAddress}
                />
              </td>
              <td>{e.dstChain}</td>
              <td>
                {dstExplorerUrl ? (
                  <a
                    target="_blank"
                    href={`${dstExplorerUrl}/tx/${e.dstTxHash}`}
                  >
                    <ShortenedHash hash={e.dstTxHash} />
                  </a>
                ) : (
                  <ShortenedHash hash={e.dstTxHash} />
                )}
              </td>
              <td>
                <TokenAddress
                  explorerUrl={dstExplorerUrl}
                  address={e.dstTokenAddress}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function TokenAddress({
  explorerUrl,
  address,
}: {
  explorerUrl: string | undefined
  address: string | undefined
}) {
  if (address === undefined) {
    return <span>undefined</span>
  }
  if (address === Address32.NATIVE) {
    return <span>native</span>
  }
  if (address === Address32.ZERO) {
    return <span>0x0</span>
  }
  if (!explorerUrl) {
    return null
  }
  const ethAddress = Address32.cropToEthereumAddress(Address32(address))
  return (
    <a target="_blank" href={`${explorerUrl}/address/${ethAddress}`}>
      <ShortenedHash hash={ethAddress} />
    </a>
  )
}

function TransfersPageLayout(props: {
  transfers: InteropTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  const eventsTable = <TransfersTable {...props} />

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
          title: `Transfers: ${props.transfers[0]?.type ?? ''}`,
          table: eventsTable,
          tableId: 'myTable',
          dataTableOptions: dataTableOptions,
        },
      ]}
      footer={<ProcessorsStatusTable processors={props.status} />}
    />
  )
}

export function renderTransfersPage(props: {
  transfers: InteropTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
  status: ProcessorsStatus[]
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<TransfersPageLayout {...props} />)
  )
}
