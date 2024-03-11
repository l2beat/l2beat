import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { BigQueryTransferResult, TrackedTxTransferResult } from '../types/model'
import { TrackedTxTransferConfig } from '../types/TrackedTxsConfig'
import { TrackedTxsId } from '../types/TrackedTxsId'
import { transformTransfersQueryResult } from './transformTransfersQueryResult'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
const ADDRESS_4 = EthereumAddress.random()
const ADDRESS_5 = EthereumAddress.random()
const ADDRESS_6 = EthereumAddress.random()
const SINCE_TIMESTAMP = UnixTime.now()

const RESULT_TIMESTAMP = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))

describe(transformTransfersQueryResult.name, () => {
  it('should transform results', () => {
    const config: TrackedTxTransferConfig[] = [
      {
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxsId.unsafe('0x1'),
            type: 'liveness',
            subType: 'batchSubmissions',
          },
          {
            id: TrackedTxsId.unsafe('0x2'),
            type: 'liveness',
            subType: 'stateUpdates',
          },
        ],
      },
      {
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxsId.unsafe('0x3'),
            type: 'liveness',
            subType: 'stateUpdates',
          },
        ],
      },
      {
        formula: 'transfer',
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxsId.unsafe('0x4'),
            type: 'liveness',
            subType: 'proofSubmissions',
          },
        ],
      },
    ]

    const block = 1
    const txHashes = [
      '0x095e4e9ee709e353ad7849cf30e4dc19',
      '0x915d9ed63e196d8c612aad5d6f5cd1ba',
      '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
    ]

    const queryResults: BigQueryTransferResult[] = [
      {
        from_address: ADDRESS_1,
        to_address: ADDRESS_2,
        hash: txHashes[0],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 25,
        receipt_gas_used: 100,
      },
      {
        from_address: ADDRESS_3,
        to_address: ADDRESS_4,
        hash: txHashes[1],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 50,
        receipt_gas_used: 50,
      },
      {
        from_address: ADDRESS_5,
        to_address: ADDRESS_6,
        hash: txHashes[2],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 10,
        receipt_gas_used: 1000,
      },
    ]
    const expected: TrackedTxTransferResult[] = [
      {
        type: 'transfer',
        projectId: config[0].projectId,
        use: config[0].uses[0],
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_1,
        toAddress: ADDRESS_2,
        gasPrice: 25,
        gasUsed: 100,
      },
      {
        type: 'transfer',
        projectId: config[0].projectId,
        use: config[0].uses[1],
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_1,
        toAddress: ADDRESS_2,
        gasPrice: 25,
        gasUsed: 100,
      },
      {
        type: 'transfer',
        projectId: config[1].projectId,
        use: config[1].uses[0],
        hash: txHashes[1],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_3,
        toAddress: ADDRESS_4,
        gasPrice: 50,
        gasUsed: 50,
      },
      {
        type: 'transfer',
        projectId: config[2].projectId,
        use: config[2].uses[0],
        hash: txHashes[2],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_5,
        toAddress: ADDRESS_6,
        gasPrice: 10,
        gasUsed: 1000,
      },
    ]

    expect(transformTransfersQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })

  it('should throw when there is no matching config', () => {
    const config: TrackedTxTransferConfig[] = [
      {
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        sinceTimestamp: SINCE_TIMESTAMP,
        uses: [],
      },
    ]

    const queryResults: BigQueryTransferResult[] = [
      {
        hash: '',
        block_number: 1,
        block_timestamp: RESULT_TIMESTAMP,
        from_address: EthereumAddress.random(),
        to_address: EthereumAddress.random(),
        gas_price: 25,
        receipt_gas_used: 100,
      },
    ]

    expect(() => transformTransfersQueryResult(config, queryResults)).toThrow(
      'There should be at least one matching config',
    )
  })
})
