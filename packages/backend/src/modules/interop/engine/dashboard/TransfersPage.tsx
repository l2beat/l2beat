import type { InteropTransferRecord } from '@l2beat/database'
import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Address32 } from '../../plugins/types'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import {
  type ProcessorsStatus,
  ProcessorsStatusTable,
} from './ProcessorsStatusTable'

function TransfersTable(props: {
  transfers: InteropTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Timestamp UTC</th>
          <th>Duration</th>
          <th>srcToken</th>
          <th>srcValue</th>
          <th>dstToken</th>
          <th>dstValue</th>
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
            <tr>
              <td data-order={e.timestamp}>
                {new Date(e.timestamp * 1000).toLocaleString()}
              </td>
              <td>{e.duration && formatSeconds(e.duration)}</td>
              <td>
                {e.srcAmount} {e.srcAbstractTokenId?.split(':')[2]}
              </td>
              <td data-order={e.srcValueUsd}>{formatDollars(e.srcValueUsd)}</td>
              <td>
                {e.dstAmount} {e.dstAbstractTokenId?.split(':')[2]}
              </td>
              <td data-order={e.dstValueUsd}>{formatDollars(e.dstValueUsd)}</td>
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
              <td>
                {srcExplorerUrl &&
                  e.srcTokenAddress &&
                  e.srcTokenAddress !== 'native' &&
                  e.srcTokenAddress !== EthereumAddress.ZERO && (
                    <a
                      target="_blank"
                      href={`${srcExplorerUrl}/address/${Address32.cropToEthereumAddress(Address32(e.srcTokenAddress))}`}
                    >
                      {Address32.cropToEthereumAddress(
                        Address32(e.srcTokenAddress),
                      )}
                    </a>
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
              <td>
                {dstExplorerUrl &&
                  e.dstTokenAddress &&
                  e.dstTokenAddress !== 'native' &&
                  e.dstTokenAddress !== EthereumAddress.ZERO && (
                    <a
                      target="_blank"
                      href={`${dstExplorerUrl}/address/${Address32.cropToEthereumAddress(Address32(e.dstTokenAddress))}`}
                    >
                      {Address32.cropToEthereumAddress(
                        Address32(e.dstTokenAddress),
                      )}
                    </a>
                  )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
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
