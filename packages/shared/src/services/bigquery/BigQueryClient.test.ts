import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  BigQueryClient,
  FunctionCallQueryParams,
  TransferQueryParams,
} from './BigQueryClient'
import { BigQueryProvider } from './BigQueryProvider'
import { BigQueryWrapper } from './BigQueryWrapper'

const transfersToQuery: TransferQueryParams[] = [
  {
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
  },
  {
    from: EthereumAddress.random(),
    to: EthereumAddress.random(),
  },
]

const functionCallsToQuery: FunctionCallQueryParams[] = [
  {
    address: EthereumAddress.random(),
    selector: '0xabcdef',
  },
  {
    address: EthereumAddress.random(),
    selector: '0x123456',
  },
]

describe('BigQueryClient', () => {
  it('should return valid data for transfers', async () => {
    const expected = [
      {
        block_number: 12345,
        from_address: transfersToQuery[0].from.toLocaleLowerCase(),
        to_address: transfersToQuery[0].to.toLocaleLowerCase(),
        block_timestamp: '2022-01-01T00:00:00Z',
        transaction_hash: '0xabcdef1234567890',
      },
      {
        block_number: 12346,
        from_address: transfersToQuery[1].from.toLocaleLowerCase(),
        to_address: transfersToQuery[1].to.toLocaleLowerCase(),
        block_timestamp: '2022-01-01T00:01:00Z',
        transaction_hash: '0x1234567890abcdef',
      },
    ]
    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => [expected],
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)

    const results = await new BigQueryClient(queryProvider).getTransfers(
      transfersToQuery,
      UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
    )

    expect(results).toEqual(expected)
  })

  it('should return valid data for methods', async () => {
    const expected = [
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
          getQueryResults: async () => [expected],
        },
      ]),
    })
    const queryProvider = new BigQueryProvider(bigQuery)
    const results = await new BigQueryClient(queryProvider).getFunctionCalls(
      functionCallsToQuery,
      UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
    )

    expect(results).toEqual(expected)
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
      new BigQueryClient(queryProvider).getTransfers(
        transfersToQuery,
        UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
        UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
      ),
    ).toBeRejectedWith('Failed to fetch query results.')
  })
})
