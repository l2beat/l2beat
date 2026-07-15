import { expect } from 'earl'
import type { LensColumn, Tile } from '../dashboard/types'
import { buildQuery } from './queryMetric'

describe(buildQuery.name, () => {
  it('passes tile and column KQL directly to Elasticsearch', () => {
    const tile: Tile = {
      panelId: 'panel',
      title: 'Tile',
      section: 'Section',
      index: 'logs-*',
      timeFrom: 'now-24h',
      timeTo: 'now',
      query: 'service.name: backend',
      controlFilters: [{ match_phrase: { environment: 'production' } }],
      metricColumnId: 'metric',
      columns: {},
    }
    const column: LensColumn = {
      operationType: 'count',
      filter: { query: 'status >= 500', language: 'kuery' },
    }

    expect(buildQuery(tile, column)).toEqual({
      bool: {
        filter: [
          {
            range: {
              '@timestamp': { gte: 'now-24h', lte: 'now' },
            },
          },
          { match_phrase: { environment: 'production' } },
          { kql: { query: 'service.name: backend' } },
          { kql: { query: 'status >= 500' } },
        ],
      },
    })
  })
})
