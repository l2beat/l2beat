import type { InteropTransferRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'
import { DataTablePage } from '../DataTablePage'
import { TransfersTable } from '../TransfersPage'
import {
  buildDurationSplitCoverageRows,
  DurationSplitCoverageTable,
} from './DurationSplitCoverageTable'
import {
  buildNotIncludedInAggregatesRows,
  NotIncludedInAggregatesTable,
} from './NotIncludedInAggregatesTable'

function AggregatesPageLayout(props: {
  transfers: InteropTransferRecord[]
  latestTransfers: InteropTransferRecord[]
  configs: InteropAggregationConfig[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const byPluginRows = buildNotIncludedInAggregatesRows(props.transfers)
  const transferTypeCoverageRows = buildDurationSplitCoverageRows(
    props.latestTransfers,
    props.configs,
  )

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Not included in latest aggregates by plugins',
          table: <NotIncludedInAggregatesTable rows={byPluginRows} />,
          tableId: 'notIncludedInAggregatesTable',
          dataTableOptions: {
            order: [[3, 'desc']],
            pageLength: 25,
          },
        },
        {
          title: 'Not included in latest aggregates',
          table: (
            <TransfersTable
              transfers={props.transfers}
              getExplorerUrl={props.getExplorerUrl}
              tableId="detailTable"
            />
          ),
          tableId: 'detailTable',
          dataTableOptions: {
            order: [[0, 'desc']],
            columnDefs: [{ targets: 0, type: 'num' }],
          },
        },
        {
          title: 'Transfer split coverage by protocol',
          table: <DurationSplitCoverageTable rows={transferTypeCoverageRows} />,
          tableId: 'durationSplitCoverageTable',
          dataTableOptions: {
            order: [[3, 'desc']],
            pageLength: 25,
          },
        },
      ]}
    />
  )
}

export function renderAggregatesPage(props: {
  transfers: InteropTransferRecord[]
  latestTransfers: InteropTransferRecord[]
  configs: InteropAggregationConfig[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(<AggregatesPageLayout {...props} />)
  )
}
