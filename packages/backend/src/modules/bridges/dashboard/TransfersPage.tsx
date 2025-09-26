import type { BridgeTransferRecord } from '@l2beat/database'
import { EthereumAddress, formatSeconds } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

function TransfersTable(props: {
  transfers: BridgeTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Timestamp UTC</th>
          <th>Duration</th>
          <th>srcChain</th>
          <th>srcTx</th>
          <th>srcToken</th>
          <th>srcRawAmount</th>
          <th>dstChain</th>
          <th>dstTx</th>
          <th>dstToken</th>
          <th>dstRawAmount</th>
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
                e.srcTokenAddress !==
                  '&& e.srcTokenAddress !== EthereumAddress.ZERO' &&
                e.srcTokenAddress !== EthereumAddress.ZERO ? (
                  <a
                    target="_blank"
                    href={`${srcExplorerUrl}/address/${e.srcTokenAddress}`}
                  >
                    {e.srcTokenAddress}
                  </a>
                ) : (
                  e.srcTokenAddress
                )}
              </td>
              <td>{e.srcRawAmount}</td>
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
                {srcExplorerUrl &&
                e.dstTokenAddress !== 'native' &&
                e.dstTokenAddress !== EthereumAddress.ZERO ? (
                  <a
                    target="_blank"
                    href={`${srcExplorerUrl}/address/${e.dstTokenAddress}`}
                  >
                    {e.dstTokenAddress}
                  </a>
                ) : (
                  e.dstTokenAddress
                )}
              </td>
              <td>{e.dstRawAmount}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function TransfersPageLayout(props: {
  transfers: BridgeTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const eventsTable = <TransfersTable {...props} />

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
      showHome={true}
      tables={[
        {
          title: `Transfers: ${props.transfers[0]?.type ?? ''}`,
          table: eventsTable,
          tableId: 'myTable',
          dataTableOptions: dataTableOptions,
        },
      ]}
    />
  )
}

export function renderTransfersPage(props: {
  transfers: BridgeTransferRecord[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<TransfersPageLayout {...props} />)
  )
}
