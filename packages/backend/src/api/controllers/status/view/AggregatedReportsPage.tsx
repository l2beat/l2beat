import { Hash256, UnixTime } from '@l2beat/shared-pure'
import React from 'react'

import { Page } from './Page'
import { reactToHtml } from './reactToHtml'

interface Aggregated {
  timestamp: UnixTime
  configHash: Hash256
}

interface AggregatedPageProps {
  statuses: Aggregated[]
}

export function AggregatedPage({ statuses }: AggregatedPageProps) {
  const columns = ['Timestamp', 'Date', 'Config Hash']

  return (
    <Page title="Aggregated Reports">
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statuses.map((s, i) => (
            <tr key={i}>
              <td key={`${i}-0`}>{s.timestamp.toString()}</td>
              <td key={`${i}-1`}>
                {s.timestamp.toDate().toLocaleString('pl')}
              </td>
              <td key={`${i}-2`}>{s.configHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}

export function renderAggregatedPage(props: AggregatedPageProps) {
  return reactToHtml(<AggregatedPage {...props} />)
}
