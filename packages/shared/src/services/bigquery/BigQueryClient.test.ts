import { expect, mockFn, mockObject } from 'earl'

import { BigQueryClient } from './BigQueryClient'
import { BigQuerySDKWrapper } from './BigQuerySDKWrapper'

describe(BigQueryClient.name, () => {
  describe(BigQueryClient.prototype.query.name, () => {
    it('calls createQueryJob with the passed SQL', async () => {
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: mockFn().resolvesToOnce([
          {
            getQueryResults: async () => {
              return [] // it is not important
            },
          },
        ]),
      })

      const bigQueryClient = new BigQueryClient(bigQuery)
      const sql = 'SELECT * FROM my_table'
      await bigQueryClient.query(sql)

      expect(bigQuery.createQueryJob).toHaveBeenCalledWith(sql)
    })

    it('calls createQueryJob and returns valid data', async () => {
      const response = {
        key: 'value',
      }
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: mockFn().resolvesToOnce([
          {
            getQueryResults: async () => {
              return [response]
            },
          },
        ]),
      })

      const bigQueryClient = new BigQueryClient(bigQuery)
      const sql = 'SELECT * FROM my_table'
      const results = await bigQueryClient.query(sql)

      expect(results).toEqual(response)
    })

    it('handles error on getQueryResults', async () => {
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: async (): Promise<any> => {
          return [
            {
              getQueryResults: async () => {
                throw new Error('BigQuery error')
              },
            },
          ]
        },
      })

      const bigQueryClient = new BigQueryClient(bigQuery)
      const sql = 'SELECT * FROM my_table'

      await expect(bigQueryClient.query(sql)).toBeRejectedWith(
        'Google BigQuery error: BigQuery error',
      )
    })

    it('handles errors', async () => {
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: async (): Promise<any> => {
          throw new Error('BigQuery error')
        },
      })

      const bigQueryClient = new BigQueryClient(bigQuery)
      const sql = 'SELECT * FROM my_table'

      await expect(bigQueryClient.query(sql)).toBeRejectedWith(
        'Google BigQuery error: BigQuery error',
      )
    })

    it('throws when query size exceeds the limit', async () => {
      const QUERY_LIMIT = 1000
      const response = {
        metadata: {
          statistics: {
            query: { totalBytesProcessed: QUERY_LIMIT + 1 },
          },
        },
      }
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: mockFn().resolvesToOnce([response]),
      })

      const bigQueryClient = new BigQueryClient(bigQuery, QUERY_LIMIT)
      const sql = 'SELECT * FROM my_table'

      await expect(
        async () => await bigQueryClient.query(sql),
      ).toBeRejectedWith(
        'BigQuery estimate too high: ' + (QUERY_LIMIT + 1).toString(),
      )
    })
  })

  describe('Estimate query size', () => {
    it('performs dry run & returns query size estimate', async () => {
      const ESTIMATE = 1000
      const response = {
        metadata: {
          statistics: {
            query: { totalBytesProcessed: ESTIMATE },
          },
        },
      }
      const bigQuery = mockObject<BigQuerySDKWrapper>({
        createQueryJob: mockFn().resolvesToOnce([response]),
      })

      const bigQueryClient = new BigQueryClient(bigQuery)
      const sql = 'SELECT * FROM my_table'
      const estimate = await bigQueryClient.estimateQuerySize(sql)

      expect(bigQuery.createQueryJob).toHaveBeenCalledWith(sql, true)
      expect(estimate).toEqual(ESTIMATE)
    })
  })
})
