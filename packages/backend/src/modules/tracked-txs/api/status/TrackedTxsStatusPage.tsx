import React, { Fragment } from 'react'

import { TrackedTxConfigEntry } from '@l2beat/shared'
import { IndexerConfigurationRecord } from '../../../../tools/uif/IndexerConfigurationRepository'
import { TableData, TableHead } from '../../../status/Components'
import { Page } from '../../../status/Page'
import { reactToHtml } from '../../../status/reactToHtml'
import { DASHBOARD_COLORS } from '../../../update-monitor/api/view/constants'

type TrackedTxsTableRow = Omit<IndexerConfigurationRecord, 'properties'> & {
  properties: TrackedTxConfigEntry
} & {
  active: boolean
  healthy: boolean
  unused: boolean
}

export function TrackedTxsStatusPage({
  data: rawData,
}: {
  data: TrackedTxsTableRow[]
}) {
  // Group and sort by project id
  const data = Object.entries(
    [...rawData].reduce(
      (acc, curr) => {
        if (acc[curr.properties.projectId]) {
          acc[curr.properties.projectId].push(curr)
        } else {
          acc[curr.properties.projectId] = [curr]
        }
        return acc
      },
      {} as Record<string, TrackedTxsTableRow[]>,
    ),
  ).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Page title="Tracked txs">
      <div className="tabs">
        {data.map(([projectId, configs], i) => (
          <Fragment key={projectId}>
            <input
              type="radio"
              name="tabs"
              id={projectId}
              defaultChecked={i === 0}
            />
            <label
              htmlFor={projectId}
              style={{
                color: getStatusColor(configs),
              }}
            >
              {projectId}
            </label>
            <div className="tab">
              <h2 style={{ marginTop: 8 }}>{projectId}</h2>
              <h3>Active</h3>
              <Table data={configs.filter((c) => !c.unused && c.active)} />
              <h3>Inactive</h3>
              <Table data={configs.filter((c) => !c.unused && !c.active)} />
              <h3>Empty</h3>
              <Table data={configs.filter((c) => c.unused)} />
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
          <TableHead>Type</TableHead>
          <TableHead>Config ID</TableHead>
          <TableHead>Last synced timestamp</TableHead>
          <TableHead>Since timestamp</TableHead>
          <TableHead>Until timestamp</TableHead>
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
            <TableData value={config.properties.type} />
            <TableData value={config.id} />
            <TableData
              value={
                config.currentHeight &&
                new Date(config.currentHeight * 1000).toUTCString()
              }
            />
            <TableData
              value={new Date(config.minHeight * 1000).toUTCString()}
            />
            <TableData
              value={
                config.maxHeight &&
                new Date(config.maxHeight * 1000).toUTCString()
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

  if (configs.some((config) => !config.healthy)) {
    return DASHBOARD_COLORS.UNVERIFIED
  }
  return DASHBOARD_COLORS.WATCHED
}

export function renderTrackedTxsStatusPage(
  props: Parameters<typeof TrackedTxsStatusPage>[0],
) {
  return reactToHtml(<TrackedTxsStatusPage {...props} />)
}
