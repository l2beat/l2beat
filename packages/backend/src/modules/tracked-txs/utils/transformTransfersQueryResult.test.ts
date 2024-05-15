import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { TrackedTxId } from '../types/TrackedTxId'
import { TrackedTxTransferConfig } from '../types/TrackedTxsConfig'
import { BigQueryTransferResult, TrackedTxTransferResult } from '../types/model'
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
        sinceTimestampInclusive: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxId.unsafe('0x1'),
            type: 'liveness',
            subtype: 'batchSubmissions',
          },
          {
            id: TrackedTxId.unsafe('0x2'),
            type: 'liveness',
            subtype: 'stateUpdates',
          },
        ],
      },
      {
        formula: 'transfer',
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        sinceTimestampInclusive: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxId.unsafe('0x3'),
            type: 'liveness',
            subtype: 'stateUpdates',
          },
        ],
      },
      {
        formula: 'transfer',
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        sinceTimestampInclusive: SINCE_TIMESTAMP,
        uses: [
          {
            id: TrackedTxId.unsafe('0x4'),
            type: 'liveness',
            subtype: 'proofSubmissions',
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
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: 1n,
        receipt_blob_gas_used: 123,
      },
      {
        from_address: ADDRESS_3,
        to_address: ADDRESS_4,
        hash: txHashes[1],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 20n,
        receipt_gas_used: 200,
        calldata_gas_used: 200,
        data_length: 200,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
      {
        from_address: ADDRESS_5,
        to_address: ADDRESS_6,
        hash: txHashes[2],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 30n,
        receipt_gas_used: 300,
        calldata_gas_used: 300,
        data_length: 300,
        receipt_blob_gas_price: 1324n,
        receipt_blob_gas_used: 123,
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
        receiptGasUsed: 100,
        gasPrice: 10n,
        calldataGasUsed: 100,
        dataLength: 100,
        receiptBlobGasPrice: 1n,
        receiptBlobGasUsed: 123,
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
        receiptGasUsed: 100,
        gasPrice: 10n,
        calldataGasUsed: 100,
        dataLength: 100,
        receiptBlobGasPrice: 1n,
        receiptBlobGasUsed: 123,
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
        receiptGasUsed: 200,
        gasPrice: 20n,
        calldataGasUsed: 200,
        dataLength: 200,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
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
        receiptGasUsed: 300,
        gasPrice: 30n,
        calldataGasUsed: 300,
        dataLength: 300,
        receiptBlobGasPrice: 1324n,
        receiptBlobGasUsed: 123,
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
        sinceTimestampInclusive: SINCE_TIMESTAMP,
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
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: 1n,
        receipt_blob_gas_used: 123,
      },
    ]

    expect(() => transformTransfersQueryResult(config, queryResults)).toThrow(
      'There should be at least one matching config',
    )
  })
})
