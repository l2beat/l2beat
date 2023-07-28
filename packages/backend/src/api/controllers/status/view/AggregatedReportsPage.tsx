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
  uniqueHashes: Hash256[]
}

export function AggregatedPage({
  statuses,
  uniqueHashes,
}: AggregatedPageProps) {
  const columns = ['Timestamp', 'Date', 'Config Hash']

  return (
    <Page title="Aggregated Reports">
      <h2>Unique hashes count: {uniqueHashes.length}</h2>
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
              <td
                style={{ color: getColorClass(uniqueHashes, s.configHash) }}
                key={`${i}-2`}
              >
                {s.configHash}
              </td>
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

const getColorClass = (uniqueHashes: Hash256[], hash: Hash256) => {
  const colors = ['green', 'blue', 'yellow', 'orange', 'purple']
  const index = uniqueHashes.findIndex((u) => u === hash)

  if (index === -1) {
    return 'red'
  }
  return colors[index]
}
