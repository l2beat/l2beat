import type { BigQuery } from '@google-cloud/bigquery'
import { expect, mockFn, mockObject } from 'earl'

import { BigQueryClient, type BigQueryClientQuery } from './BigQueryClient'

describe(BigQueryClient.name, () => {
  describe(BigQueryClient.prototype.query.name, () => {
    it('should return query results', async () => {
      const queryResults = [
        {
          value: 'test',
        },
        {
          value: 'test2',
        },
      ]
      const mockGetQueryResults = mockFn().resolvesTo([queryResults])
      const mockBigQuery = mockObject<BigQuery>({
        createQueryJob: mockFn().resolvesTo([
          {
            getQueryResults: mockGetQueryResults,
          },
        ]),
      })

      const client = new BigQueryClient(mockBigQuery)

      const query: BigQueryClientQuery = {
        query: 'SELECT * FROM test WHERE id = ?',
        params: ['test-id'],
        types: ['STRING'],
        limitInGb: 2,
      }

      const result = await client.query(query)
      // @ts-expect-error BigQuery has a overloaded createQueryJob method
      expect(mockBigQuery.createQueryJob).toHaveBeenCalledWith({
        ...query,
        maximumBytesBilled: (query.limitInGb * 1024 * 1024 * 1024).toString(),
        location: 'US',
      })
      expect(mockGetQueryResults).toHaveBeenCalled()
      expect(result).toEqual(queryResults)
    })
  })
})
