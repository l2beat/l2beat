import React, { Fragment } from 'react'

import { TableData, TableHead } from '../../../status/Components'
import { Page } from '../../../status/Page'
import { reactToHtml } from '../../../status/reactToHtml'
import { DASHBOARD_COLORS } from '../../../update-monitor/api/view/constants'
import { TrackedTxsConfigRecord } from '../../repositories/TrackedTxsConfigsRepository'

type TrackedTxsTableRow = TrackedTxsConfigRecord & {
  unused: boolean
  synced: boolean
}

export function TrackedTxsStatusPage({
  data: rawData,
}: {
  data: TrackedTxsTableRow[]
}) {
  // Group and sort by project id
  const data = Object.entries(
    [...rawData].reduce((acc, curr) => {
      if (acc[curr.projectId]) {
        acc[curr.projectId].push(curr)
      } else {
        acc[curr.projectId] = [curr]
      }
      return acc
    }, {} as Record<string, TrackedTxsTableRow[]>),
  ).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Page title="Tracked txs">
      <div className="tabs">
        {data.map(([projectId, configs], i) => (
          <Fragment key={projectId}>
            <input type="radio" name="tabs" id={projectId} checked={i === 0} />
            <label
              htmlFor={projectId}
              style={{
                color: getStatusColor(configs),
              }}
            >
              {projectId}
            </label>
            <div className="tab">
              <Table data={configs} />
            </div>
          </Fragment>
        ))}
      </div>
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
          <tr
            style={{
              color: getStatusColor(config),
            }}
            key={config.id}
          >
            <TableData value={config.projectId} />
            <TableData value={config.type} />
            <TableData value={config.id} />
            <TableData
              value={
                config.untilTimestampExclusive?.toDate().toUTCString() ?? 'null'
              }
            />
            <TableData
              value={
                config.lastSyncedTimestamp?.toDate().toUTCString() ?? 'null'
              }
            />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function getStatusColor(
  configOrConfigs: TrackedTxsTableRow | TrackedTxsTableRow[],
) {
  const configs = Array.isArray(configOrConfigs)
    ? configOrConfigs
    : [configOrConfigs]

  if (configs.some((config) => config.unused)) {
    return DASHBOARD_COLORS.UNVERIFIED
  }
  if (configs.some((config) => !config.synced)) {
    return DASHBOARD_COLORS.IGNORED_IN_WATCH_MODE
  }
  return DASHBOARD_COLORS.WATCHED
}

export function renderTrackedTxsStatusPage(
  props: Parameters<typeof TrackedTxsStatusPage>[0],
) {
  return reactToHtml(<TrackedTxsStatusPage {...props} />)
}
