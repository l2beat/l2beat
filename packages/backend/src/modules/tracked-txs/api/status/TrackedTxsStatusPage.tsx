import React from 'react'

import { TableData, TableHead } from '../../../status/Components'
import { Page } from '../../../status/Page'
import { reactToHtml } from '../../../status/reactToHtml'
import { TrackedTxsConfigRecord } from '../../repositories/TrackedTxsConfigsRepository'

type TrackedTxsTableRow = TrackedTxsConfigRecord & { unused?: boolean }

export function TrackedTxsStatusPage({
  data: unsortedData,
}: {
  data: TrackedTxsTableRow[]
}) {
  const data = [...unsortedData].sort((a, b) =>
    a.projectId.localeCompare(b.projectId),
  )

  return (
    <Page title="Tracked txs">
      <h2 style={{ marginTop: '0px' }}>Active</h2>
      <Table data={data.filter((config) => !config.unused)} />
      <h2 style={{ marginTop: '0px' }}>Empty</h2>
      <Table data={data.filter((config) => config.unused)} />
    </Page>
  )
}

function Table({ data }: { data: TrackedTxsTableRow[] }) {
  return (
    <table>
      <thead>
        <tr>
          <TableHead>Project</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Config ID</TableHead>
          <TableHead>Until timestamp</TableHead>
          <TableHead>Last synced timestamp</TableHead>
        </tr>
      </thead>
      <tbody>
        {[...data].map((config) => (
          <tr>
            <TableData value={config.projectId} />
            <TableData value={config.type} />
            <TableData value={config.id} />
            <TableData
              value={config.untilTimestampExclusive?.toYYYYMMDD() ?? ''}
            />
            <TableData
              value={config.untilTimestampExclusive?.toYYYYMMDD() ?? ''}
            />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function renderTrackedTxsStatusPage(
  props: Parameters<typeof TrackedTxsStatusPage>[0],
) {
  return reactToHtml(<TrackedTxsStatusPage {...props} />)
}
