import {
  BigQueryClient,
  BigQueryProvider,
  BigQueryWrapper,
} from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessConfig, LivenessIndexer } from './LivenessIndexer'

describe(LivenessIndexer.name, () => {
  it('should return valid data for transfers', async () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()
    const ADDRESS_4 = EthereumAddress.random()
    const ADDRESS_5 = EthereumAddress.random()
    const ADDRESS_6 = EthereumAddress.random()

    const queryResults = [
      {
        block_number: 1,
        block_timestamp: { value: '2022-01-01T00:00:00Z' },
        from_address: ADDRESS_1.toLocaleLowerCase(),
        to_address: ADDRESS_2.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567890',
      },
      {
        block_number: 2,
        block_timestamp: { value: '2022-01-01T01:00:00Z' },
        from_address: ADDRESS_3.toLocaleLowerCase(),
        to_address: ADDRESS_4.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567891',
      },
      {
        block_number: 3,
        block_timestamp: { value: '2022-01-01T02:00:00Z' },
        from_address: ADDRESS_5.toLocaleLowerCase(),
        to_address: ADDRESS_6.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567892',
      },
    ]

    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => {
            return [queryResults]
          },
        },
      ]),
    })
    const bigQueryProvider = new BigQueryProvider(bigQuery)
    const bigQueryClient = new BigQueryClient(bigQueryProvider)

    const configs: LivenessConfig[] = [
      {
        projectId: ProjectId('project1'),
        transfers: [
          {
            from: ADDRESS_1,
            to: ADDRESS_2,
            type: 'DA',
          },
          {
            from: ADDRESS_3,
            to: ADDRESS_4,
            type: 'STATE',
          },
        ],
      },
      {
        projectId: ProjectId('project2'),
        transfers: [
          {
            from: ADDRESS_5,
            to: ADDRESS_6,
            type: 'STATE',
          },
        ],
      },
    ]
    const expected: LivenessRecord[] = [
      {
        blockNumber: 1,
        projectId: ProjectId('project1'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
        txHash: '0xabcdef1234567890',
        type: 'DA',
      },
      {
        blockNumber: 2,
        projectId: ProjectId('project1'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
        txHash: '0xabcdef1234567891',
        type: 'STATE',
      },
      {
        blockNumber: 3,
        projectId: ProjectId('project2'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
        txHash: '0xabcdef1234567892',
        type: 'STATE',
      },
    ]

    const livenessIndexer = new LivenessIndexer(bigQueryClient)
    const results = await livenessIndexer.fetchTransfers(
      configs,
      UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
    )

    expect(results).toEqual(expected)
  })

  it('should return valid data for function calls', async () => {
    const ADDRESS_1 = EthereumAddress.random()
    const ADDRESS_2 = EthereumAddress.random()
    const ADDRESS_3 = EthereumAddress.random()

    const queryResults = [
      {
        block_number: 1,
        block_timestamp: { value: '2022-01-01T00:00:00Z' },
        input: '0x9aaab648dwadadsacahwawiouhdaoi',
        to_address: ADDRESS_1.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567890',
      },
      {
        block_number: 2,
        block_timestamp: { value: '2022-01-01T01:00:00Z' },
        input: '0x7739cbe7dioajfa89wu2er3djiuajdn32hhduia',
        to_address: ADDRESS_2.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567891',
      },
      {
        block_number: 3,
        block_timestamp: { value: '2022-01-01T02:00:00Z' },
        input: '0xa04cee60adowij2d283d7924bnd83',
        to_address: ADDRESS_3.toLocaleLowerCase(),
        transaction_hash: '0xabcdef1234567892',
      },
    ]

    const bigQuery = mockObject<BigQueryWrapper>({
      createQueryJob: mockFn().resolvesToOnce([
        {
          getQueryResults: async () => {
            return [queryResults]
          },
        },
      ]),
    })
    const bigQueryProvider = new BigQueryProvider(bigQuery)
    const bigQueryClient = new BigQueryClient(bigQueryProvider)

    const configs: LivenessConfig[] = [
      {
        projectId: ProjectId('project1'),
        functionCalls: [
          {
            address: ADDRESS_1,
            selector: '0x9aaab648',
            type: 'DA',
          },
        ],
      },
      {
        projectId: ProjectId('project2'),
        functionCalls: [
          {
            address: ADDRESS_2,
            selector: '0x7739cbe7',
            type: 'STATE',
          },
          {
            address: ADDRESS_3,
            selector: '0xa04cee60',
            type: 'DA',
          },
        ],
      },
    ]
    const expected: LivenessRecord[] = [
      {
        blockNumber: 1,
        projectId: ProjectId('project1'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
        txHash: '0xabcdef1234567890',
        type: 'DA',
      },
      {
        blockNumber: 2,
        projectId: ProjectId('project2'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T01:00:00Z')),
        txHash: '0xabcdef1234567891',
        type: 'STATE',
      },
      {
        blockNumber: 3,
        projectId: ProjectId('project2'),
        timestamp: UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
        txHash: '0xabcdef1234567892',
        type: 'DA',
      },
    ]

    const livenessIndexer = new LivenessIndexer(bigQueryClient)
    const results = await livenessIndexer.fetchFunctionCalls(
      configs,
      UnixTime.fromDate(new Date('2022-01-01T00:00:00Z')),
      UnixTime.fromDate(new Date('2022-01-01T02:00:00Z')),
    )

    expect(results).toEqual(expected)
  })
})
