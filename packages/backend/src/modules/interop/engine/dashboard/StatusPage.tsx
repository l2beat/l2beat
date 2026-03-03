import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'
import { DataTablePage } from './DataTablePage'
import { PluginsResyncControls } from './PluginsResyncControls'
import { PluginsStatusTable } from './PluginsStatusTable'

function StatusPageLayout(props: {
  pluginSyncStatuses: PluginSyncStatus[]
  showResyncControls: boolean
}) {
  const tableId = 'pluginsStatusTable'
  const statusTable = (
    <PluginsStatusTable
      pluginSyncStatuses={props.pluginSyncStatuses}
      tableId={tableId}
      className="display"
    />
  )

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Plugins status (refreshes every 5s)',
          table: statusTable,
          tableId,
          dataTableOptions: {
            order: [
              [0, 'asc'],
              [1, 'asc'],
            ],
          },
        },
      ]}
      footer={
        <>
          {props.showResyncControls ? (
            <PluginsResyncControls
              pluginSyncStatuses={props.pluginSyncStatuses}
            />
          ) : null}
          <script
            dangerouslySetInnerHTML={{
              __html: `
            setInterval(function() {
              window.location.reload();
            }, 5000);
          `,
            }}
          />
        </>
      }
    />
  )
}

export function renderStatusPage(props: {
  pluginSyncStatuses: PluginSyncStatus[]
  showResyncControls: boolean
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<StatusPageLayout {...props} />)
  )
}
