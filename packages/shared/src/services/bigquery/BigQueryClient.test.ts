import { expect, mockFn, mockObject } from 'earl'

import { BigQueryClient } from './BigQueryClient'
import { BigQueryProvider } from './BigQueryProvider'
import { BigQueryWrapper } from './BigQueryWrapper'
import { projects } from './config'

describe('BigQueryClient', () => {
  it('should return valid data for transfers', async () => {
    const transfers = [
      {
        block_number: 12345,
        to_address: '0x1234567890abcdef',
        block_timestamp: '2022-01-01T00:00:00Z',
        transaction_hash: '0xabcdef1234567890',
      },
      {
        block_number: 12346,
        to_address: '0xabcdef1234567890',
        block_timestamp: '2022-01-01T00:01:00Z',
        transaction_hash: '0x1234567890abcdef',
      },
    ]
    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => [transfers],
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)
    const results = await new BigQueryClient(queryProvider).makeTransfersQuery(
      projects,
      '2023-10-01 00:00:00 UTC',
      '2023-10-01 01:00:00 UTC',
    )
    expect(results).toEqual(transfers)
  })

  it('should return valid data for methods', async () => {
    const methods = [
      {
        block_number: 12345,
        input: 'some input',
        to_address: '0x1234567890abcdef',
        block_timestamp: '2022-01-01T00:00:00Z',
        transaction_hash: '0xabcdef1234567890',
      },
      {
        block_number: 12346,
        input: 'some other input',
        to_address: '0xabcdef1234567890',
        block_timestamp: '2022-01-01T00:01:00Z',
        transaction_hash: '0x1234567890abcdef',
      },
    ]
    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => [methods],
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)
    const results = await new BigQueryClient(queryProvider).makeMethodsQuery(
      projects,
      '2023-10-01 00:00:00 UTC',
      '2023-10-01 01:00:00 UTC',
    )
    expect(results).toEqual(methods)
  })

  it('should throw an error if the query fails', async () => {
    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => {
            throw new Error('Failed to fetch query results.')
          },
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)
    await expect(
      new BigQueryClient(queryProvider).makeTransfersQuery(
        projects,
        '2023-10-01 00:00:00 UTC',
        '2023-10-01 01:00:00 UTC',
      ),
    ).toBeRejectedWith('Failed to fetch query results.')
  })
})
