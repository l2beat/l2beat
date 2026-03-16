import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { PluginSyncStatus } from '../sync/InteropSyncersManager'
import { DataTablePage } from './DataTablePage'
import { PluginsRestartFromNowControls } from './PluginsRestartFromNowControls'
import { PluginsResyncControls } from './PluginsResyncControls'
import { PluginsStatusTable } from './PluginsStatusTable'

function StatusPageLayout(props: {
  pluginSyncStatuses: PluginSyncStatus[]
  showResyncControls: boolean
}) {
  const tableId = 'pluginsStatusTable'
  const refreshToggleId = 'pluginsStatusAutoRefresh'
  const statusTable = (
    <>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor={refreshToggleId}>
          <input
            id={refreshToggleId}
            type="checkbox"
            defaultChecked
            style={{ marginRight: 8 }}
          />
          Refresh every 5 seconds
        </label>
      </div>
      <PluginsStatusTable
        pluginSyncStatuses={props.pluginSyncStatuses}
        tableId={tableId}
        className="display"
      />
    </>
  )

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Plugins status',
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
            <>
              <PluginsResyncControls
                pluginSyncStatuses={props.pluginSyncStatuses}
              />
              <PluginsRestartFromNowControls
                pluginSyncStatuses={props.pluginSyncStatuses}
              />
            </>
          ) : (
            <b>Resync operations disabled by environment variable</b>
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `
            setInterval(function() {
              var refreshToggle = document.getElementById('${refreshToggleId}');
              if (!refreshToggle || refreshToggle.checked) {
                window.location.reload();
              }
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
