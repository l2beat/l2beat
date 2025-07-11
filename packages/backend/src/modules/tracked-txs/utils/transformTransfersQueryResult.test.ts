import type {
  TrackedTxConfigEntry,
  TrackedTxId,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import {
  EthereumAddress,
  ProjectId,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Configuration } from '../../../tools/uif/multi/types'
import type {
  BigQueryTransferResult,
  TrackedTxTransferResult,
} from '../types/model'
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
    const config: Configuration<
      TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
    >[] = [
      mock({
        id: '0x1',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        subtype: 'batchSubmissions',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      mock({
        id: '0x2',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        subtype: 'stateUpdates',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      mock({
        id: '0x3',
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        subtype: 'stateUpdates',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      mock({
        id: '0x4',
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        subtype: 'proofSubmissions',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
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
        data_length: 100,
        non_zero_bytes: 60,
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
        data_length: 200,
        non_zero_bytes: 150,
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
        data_length: 300,
        non_zero_bytes: 200,
        receipt_blob_gas_price: 1324n,
        receipt_blob_gas_used: 123,
      },
    ]
    const expected: TrackedTxTransferResult[] = [
      {
        formula: 'transfer',
        projectId: config[0].properties.projectId,
        id: config[0].id,
        type: config[0].properties.type,
        subtype: config[0].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_1,
        toAddress: ADDRESS_2,
        receiptGasUsed: 100,
        gasPrice: 10n,
        calldataGasUsed: 16 * 60 + 4 * (100 - 60),
        dataLength: 100,
        receiptBlobGasPrice: 1n,
        receiptBlobGasUsed: 123,
      },
      {
        formula: 'transfer',
        projectId: config[1].properties.projectId,
        id: config[1].id,
        type: config[1].properties.type,
        subtype: config[1].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_1,
        toAddress: ADDRESS_2,
        receiptGasUsed: 100,
        gasPrice: 10n,
        calldataGasUsed: 16 * 60 + 4 * (100 - 60),
        dataLength: 100,
        receiptBlobGasPrice: 1n,
        receiptBlobGasUsed: 123,
      },
      {
        formula: 'transfer',
        projectId: config[2].properties.projectId,
        id: config[2].id,
        subtype: config[2].properties.subtype,
        type: config[2].properties.type,
        hash: txHashes[1],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_3,
        toAddress: ADDRESS_4,
        receiptGasUsed: 200,
        gasPrice: 20n,
        calldataGasUsed: 16 * 150 + 4 * (200 - 150),
        dataLength: 200,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
      {
        formula: 'transfer',
        projectId: config[3].properties.projectId,
        id: config[3].id,
        subtype: config[3].properties.subtype,
        type: config[3].properties.type,
        hash: txHashes[2],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_5,
        toAddress: ADDRESS_6,
        receiptGasUsed: 300,
        gasPrice: 30n,
        calldataGasUsed: 16 * 200 + 4 * (300 - 200),
        dataLength: 300,
        receiptBlobGasPrice: 1324n,
        receiptBlobGasUsed: 123,
      },
    ]

    expect(transformTransfersQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })

  it('should calculate calldata gas used correctly', () => {
    const config: Configuration<
      TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
    >[] = [
      mock({
        id: '0x1',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        subtype: 'batchSubmissions',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      mock({
        id: '0x2',
        projectId: ProjectId('project1'),
        from: ADDRESS_3,
        to: ADDRESS_4,
        subtype: 'stateUpdates',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
      mock({
        id: '0x3',
        projectId: ProjectId('project2'),
        from: ADDRESS_5,
        to: ADDRESS_6,
        subtype: 'proofSubmissions',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
    ]

    const block = 1
    const txHashes = [
      '0x095e4e9ee709e353ad7849cf30e4dc19',
      '0x915d9ed63e196d8c612aad5d6f5cd1ba',
      '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
    ]

    const queryResults: BigQueryTransferResult[] = [
      // Before Pectra
      {
        from_address: ADDRESS_1,
        to_address: ADDRESS_2,
        hash: txHashes[0],
        block_number: block,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 10n,
        receipt_gas_used: 100,
        data_length: 100,
        non_zero_bytes: 60,
        receipt_blob_gas_price: 1n,
        receipt_blob_gas_used: 123,
      },
      // After Pectra - high compute
      {
        from_address: ADDRESS_3,
        to_address: ADDRESS_4,
        hash: txHashes[1],
        block_number: 22431085,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 20n,
        receipt_gas_used: 200,
        data_length: 200,
        non_zero_bytes: 150,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
      // After Pectra - low compute
      {
        from_address: ADDRESS_5,
        to_address: ADDRESS_6,
        hash: txHashes[2],
        block_number: 22431085,
        block_timestamp: RESULT_TIMESTAMP,
        gas_price: 30n,
        receipt_gas_used: 300,
        data_length: 10_000,
        non_zero_bytes: 200,
        receipt_blob_gas_price: 1324n,
        receipt_blob_gas_used: 123,
      },
    ]
    const expected: TrackedTxTransferResult[] = [
      {
        formula: 'transfer',
        projectId: config[0].properties.projectId,
        id: config[0].id,
        type: config[0].properties.type,
        subtype: config[0].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_1,
        toAddress: ADDRESS_2,
        receiptGasUsed: 100,
        gasPrice: 10n,
        calldataGasUsed: 16 * 60 + 4 * (100 - 60),
        dataLength: 100,
        receiptBlobGasPrice: 1n,
        receiptBlobGasUsed: 123,
      },
      {
        formula: 'transfer',
        projectId: config[1].properties.projectId,
        id: config[1].id,
        type: config[1].properties.type,
        subtype: config[1].properties.subtype,
        hash: txHashes[1],
        blockNumber: 22431085,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_3,
        toAddress: ADDRESS_4,
        gasPrice: 20n,
        receiptGasUsed: 200,
        calldataGasUsed: 40 * 150 + 10 * (200 - 150),
        dataLength: 200,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
      {
        formula: 'transfer',
        projectId: config[2].properties.projectId,
        id: config[2].id,
        subtype: config[2].properties.subtype,
        type: config[2].properties.type,
        hash: txHashes[2],
        blockNumber: 22431085,
        blockTimestamp: RESULT_TIMESTAMP,
        fromAddress: ADDRESS_5,
        toAddress: ADDRESS_6,
        gasPrice: 30n,
        receiptGasUsed: 300,
        calldataGasUsed: 40 * 200 + 10 * (10_000 - 200),
        dataLength: 10_000,
        receiptBlobGasPrice: 1324n,
        receiptBlobGasUsed: 123,
      },
    ]

    expect(transformTransfersQueryResult(config, queryResults)).toEqual(
      expected,
    )
  })

  it('should throw when there is no matching config', () => {
    const config = [
      mock({
        id: '0x1',
        projectId: ProjectId('project1'),
        from: ADDRESS_1,
        to: ADDRESS_2,
        subtype: 'batchSubmissions',
        sinceTimestamp: SINCE_TIMESTAMP,
      }),
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
        data_length: 100,
        non_zero_bytes: 60,
        receipt_blob_gas_price: 1n,
        receipt_blob_gas_used: 123,
      },
    ]

    expect(() => transformTransfersQueryResult(config, queryResults)).toThrow(
      'There should be at least one matching config',
    )
  })
})

function mock({
  id,
  projectId,
  subtype,
  from,
  to,
  sinceTimestamp,
}: {
  id: TrackedTxId
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
  from: EthereumAddress
  to: EthereumAddress
  sinceTimestamp: number
}): Configuration<TrackedTxConfigEntry & { params: TrackedTxTransferConfig }> {
  return {
    id,
    minHeight: 0,
    maxHeight: 0,
    properties: {
      id,
      projectId,
      type: 'liveness',
      subtype,
      sinceTimestamp,
      params: {
        formula: 'transfer',
        from,
        to,
      },
    },
  }
}
