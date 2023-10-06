import { expect, mockFn, mockObject } from 'earl'

import { BigQueryProvider } from './BigQueryProvider'
import { BigQueryWrapper } from './BigQueryWrapper'

describe(BigQueryProvider.name, () => {
  describe(BigQueryProvider.prototype.query.name, () => {
    it('calls createQueryJob with the passed SQL', async () => {
      const bigQuery = mockObject<BigQueryWrapper>({
        createQueryJob: mockFn().resolvesToOnce([
          {
            getQueryResults: async () => {
              return [] // it is not important
            },
          },
        ]),
      })

      const bigQueryProvider = new BigQueryProvider(bigQuery)
      const sql = 'SELECT * FROM my_table'
      await bigQueryProvider.query(sql)

      expect(bigQuery.createQueryJob).toHaveBeenCalledWith(sql)
    })

    it('handles error on getQueryResults', async () => {
      const bigQuery = mockObject<BigQueryWrapper>({
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

      const bigQueryProvider = new BigQueryProvider(bigQuery)
      const sql = 'SELECT * FROM my_table'

      await expect(bigQueryProvider.query(sql)).toBeRejectedWith(
        '[Google BigQuery] Failed to query:',
      )
    })

    it('handles error on createQueryJob', async () => {
      const bigQuery = mockObject<BigQueryWrapper>({
        createQueryJob: async (): Promise<any> => {
          throw new Error('BigQuery error')
        },
      })

      const bigQueryProvider = new BigQueryProvider(bigQuery)
      const sql = 'SELECT * FROM my_table'

      await expect(bigQueryProvider.query(sql)).toBeRejectedWith(
        '[Google BigQuery] Failed to query:',
      )
    })
  })
})
