import { mockFn, mockObject } from 'earl'

import { BigQueryClient } from './BigQueryClient'
import { BigQueryProvider } from './BigQueryProvider'
import { BigQueryWrapper } from './BigQueryWrapper'
import { projects } from './config'

describe('BigQueryClient', () => {
  it('should work', async () => {
    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => {
            return [] // it is not important
          },
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)
    await new BigQueryClient(queryProvider).getLivenessData(projects)
  })
})
