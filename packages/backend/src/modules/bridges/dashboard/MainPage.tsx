import type { BridgeEventStatsRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

function EventsTable(props: { events: BridgeEventStatsRecord[] }) {
  return (
    <table id="myTable" className="display">
      <thead>
        <tr>
          <th>Type</th>
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
            <tr>
              <td>{e.type}</td>
              <td>{e.count}</td>
              <td>{e.matched}</td>
              <td>
                <a href={`/bridges/unmatched/${e.type}`}>{e.unmatched}</a>
              </td>
              <td>{e.oldUnmatched}</td>
              <td>{e.unsupported}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function MainPageLayout(props: { events: BridgeEventStatsRecord[] }) {
  const eventsTable = <EventsTable {...props} />

  return (
    <DataTablePage
      showHome={false}
      tables={[
        {
          title: 'Events',
          table: eventsTable,
          tableId: 'myTable',
          dataTableOptions: {
            pageLength: 10,
            order: [[0, 'asc']],
          },
        },
      ]}
    />
  )
}

export function renderMainPage(props: { events: BridgeEventStatsRecord[] }) {
  return '<!DOCTYPE html>' + renderToStaticMarkup(<MainPageLayout {...props} />)
}
