import { readFileSync } from 'fs'
import {
  EthereumAddress,
  ProjectId,
  TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxId,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
  createTrackedTxId,
} from '@l2beat/shared'
import {
  sharedBridgeChainId,
  sharedBridgeCommitBatchesInput,
  sharedBridgeCommitBatchesSelector,
  sharedBridgeCommitBatchesSignature,
} from '../../../test/sharedBridge'
import { Configuration } from '../../../tools/uif/multi/types'
import {
  BigQueryFunctionCallResult,
  TrackedTxFunctionCallResult,
} from '../types/model'
import { transformFunctionCallsQueryResult } from './transformFunctionCallsQueryResult'

const ADDRESS_1 = EthereumAddress.random()
const SELECTOR_1 = '0x095e4'
const ADDRESS_2 = EthereumAddress.random()
const SELECTOR_2 = '0x915d9'
const SINCE_TIMESTAMP = UnixTime.now()

const timestamp = UnixTime.fromDate(new Date('2022-01-01T01:00:00Z'))
const block = 1
const txHashes = [
  '0x095e4e9ee709e353ad7849cf30e4dc19',
  '0x915d9ed63e196d8c612aad5d6f5cd1ba',
  '0x90d5e81b40d6a6fa6f34b3dc67d3fce6',
]

const inputFile = `src/test/sharpVerifierInput.txt`
const sharpInput = readFileSync(inputFile, 'utf-8')
const paradexProgramHash =
  '3258367057337572248818716706664617507069572185152472699066582725377748079373'

describe(transformFunctionCallsQueryResult.name, () => {
  it('should transform results', () => {
    const functionCalls = [
      mockFunctionCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        formula: 'functionCall',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'batchSubmissions',
      }),
      mockFunctionCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project1'),
        address: ADDRESS_2,
        selector: SELECTOR_2,
        formula: 'functionCall',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'stateUpdates',
      }),
    ]

    const sharpSubmissions = [
      mockSharpSubmission({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project2'),
        address: EthereumAddress.random(),
        selector: '0x9b3b76cc',
        formula: 'sharpSubmission',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'proofSubmissions',
        programHashes: [paradexProgramHash],
      }),
    ]

    const sharedBridgeCalls = [
      mockSharedBridgeCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project2'),
        address: EthereumAddress.random(),
        selector: sharedBridgeCommitBatchesSelector,
        formula: 'sharedBridge',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'batchSubmissions',
        chainId: sharedBridgeChainId,
        signature: sharedBridgeCommitBatchesSignature,
      }),
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_1,
        to_address: ADDRESS_1,
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
      {
        hash: txHashes[1],
        block_number: block,
        block_timestamp: timestamp,
        input: SELECTOR_2,
        to_address: ADDRESS_2,
        gas_price: 20n,
        receipt_gas_used: 200,
        calldata_gas_used: 200,
        data_length: 200,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
      {
        hash: txHashes[2],
        block_number: block,
        block_timestamp: timestamp,
        input: sharpInput,
        to_address: sharpSubmissions[0].properties.params.address,
        gas_price: 30n,
        receipt_gas_used: 300,
        calldata_gas_used: 300,
        data_length: 300,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
    ]
    const expected: TrackedTxFunctionCallResult[] = [
      {
        formula: 'functionCall',
        projectId: functionCalls[0].properties.projectId,
        id: functionCalls[0].id,
        type: functionCalls[0].properties.type,
        subtype: functionCalls[0].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: ADDRESS_1,
        input: SELECTOR_1,
        gasPrice: 10n,
        receiptGasUsed: 100,
        calldataGasUsed: 100,
        dataLength: 100,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
      {
        formula: 'functionCall',
        projectId: functionCalls[1].properties.projectId,
        id: functionCalls[1].id,
        type: functionCalls[1].properties.type,
        subtype: functionCalls[1].properties.subtype,
        hash: txHashes[1],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: ADDRESS_2,
        input: SELECTOR_2,
        gasPrice: 20n,
        receiptGasUsed: 200,
        calldataGasUsed: 200,
        dataLength: 200,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
      {
        formula: 'functionCall',
        projectId: sharpSubmissions[0].properties.projectId,
        id: sharpSubmissions[0].id,
        subtype: sharpSubmissions[0].properties.subtype,
        type: sharpSubmissions[0].properties.type,
        hash: txHashes[2],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: sharpSubmissions[0].properties.params.address,
        input: sharpInput,
        gasPrice: 30n,
        receiptGasUsed: 300,
        calldataGasUsed: 300,
        dataLength: 300,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
    ]

    const result = transformFunctionCallsQueryResult(
      functionCalls,
      sharpSubmissions,
      sharedBridgeCalls,
      queryResults,
    )

    expect(result).toEqual(expected)
  })

  it('throws when there is no matching configuration', () => {
    const functionCalls = [
      mockFunctionCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project1'),
        address: ADDRESS_1,
        selector: SELECTOR_1,
        formula: 'functionCall',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'batchSubmissions',
      }),
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        to_address: EthereumAddress.random(),
        input: 'random-string',
        block_number: block,
        block_timestamp: timestamp,
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
    ]

    expect(() =>
      transformFunctionCallsQueryResult(functionCalls, [], [], queryResults),
    ).toThrow('There should be at least one matching config')
  })

  it('includes only configurations which program hashes were proven', () => {
    const sharpSubmissions = [
      mockSharpSubmission({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project1'),
        address: EthereumAddress.random(),
        selector: '0x9b3b76cc',
        formula: 'sharpSubmission',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'proofSubmissions',
        programHashes: [paradexProgramHash],
      }),
      mockSharpSubmission({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project2'),
        address: EthereumAddress.random(),
        selector: 'random-selector-2',
        formula: 'sharpSubmission',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'proofSubmissions',
        programHashes: [paradexProgramHash + 'wrong-rest-part-of-hash'],
      }),
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        to_address: sharpSubmissions[0].properties.params.address,
        input: sharpInput,
        block_number: block,
        block_timestamp: timestamp,
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
    ]

    const expected: TrackedTxFunctionCallResult[] = [
      {
        formula: 'functionCall',
        projectId: sharpSubmissions[0].properties.projectId,
        type: sharpSubmissions[0].properties.type,
        id: sharpSubmissions[0].id,
        subtype: sharpSubmissions[0].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: sharpSubmissions[0].properties.params.address,
        input: sharpInput,
        gasPrice: 10n,
        receiptGasUsed: 100,
        calldataGasUsed: 100,
        dataLength: 100,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
    ]

    const result = transformFunctionCallsQueryResult(
      [],
      sharpSubmissions,
      [],
      queryResults,
    )

    expect(result).toEqual(expected)
  })

  it('includes only configurations where chain id matches', () => {
    const sharedBridgeCalls = [
      mockSharedBridgeCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project1'),
        address: EthereumAddress.random(),
        selector: sharedBridgeCommitBatchesSelector,
        formula: 'sharedBridge',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'batchSubmissions',
        chainId: sharedBridgeChainId,
        signature: sharedBridgeCommitBatchesSignature,
      }),
      mockSharedBridgeCall({
        id: createTrackedTxId.random(),
        projectId: ProjectId('project2'),
        address: EthereumAddress.random(),
        selector: sharedBridgeCommitBatchesSelector,
        formula: 'sharedBridge',
        sinceTimestamp: SINCE_TIMESTAMP,
        subtype: 'batchSubmissions',
        chainId: 1,
        signature: sharedBridgeCommitBatchesSignature,
      }),
    ]

    const queryResults: BigQueryFunctionCallResult[] = [
      {
        hash: txHashes[0],
        to_address: sharedBridgeCalls[0].properties.params.address,
        input: sharedBridgeCommitBatchesInput,
        block_number: block,
        block_timestamp: timestamp,
        gas_price: 10n,
        receipt_gas_used: 100,
        calldata_gas_used: 100,
        data_length: 100,
        receipt_blob_gas_price: null,
        receipt_blob_gas_used: null,
      },
    ]

    const expected: TrackedTxFunctionCallResult[] = [
      {
        formula: 'functionCall',
        projectId: sharedBridgeCalls[0].properties.projectId,
        type: sharedBridgeCalls[0].properties.type,
        id: sharedBridgeCalls[0].id,
        subtype: sharedBridgeCalls[0].properties.subtype,
        hash: txHashes[0],
        blockNumber: block,
        blockTimestamp: timestamp,
        toAddress: sharedBridgeCalls[0].properties.params.address,
        input: sharedBridgeCommitBatchesInput,
        gasPrice: 10n,
        receiptGasUsed: 100,
        calldataGasUsed: 100,
        dataLength: 100,
        receiptBlobGasPrice: null,
        receiptBlobGasUsed: null,
      },
    ]

    const result = transformFunctionCallsQueryResult(
      [],
      [],
      sharedBridgeCalls,
      queryResults,
    )

    expect(result).toEqual(expected)
  })
})

function mockFunctionCall({
  id,
  projectId,
  subtype,
  address,
  selector,
  sinceTimestamp,
  formula,
}: {
  id: TrackedTxId
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
  address: EthereumAddress
  selector: string
  sinceTimestamp: UnixTime
  formula: TrackedTxFunctionCallConfig['formula']
}): Configuration<
  TrackedTxConfigEntry & {
    params: TrackedTxFunctionCallConfig
  }
> {
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
        formula,
        address,
        selector,
      },
    },
  }
}

function mockSharpSubmission({
  id,
  projectId,
  subtype,
  address,
  selector,
  sinceTimestamp,
  formula,
  programHashes,
}: {
  id: TrackedTxId
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
  address: EthereumAddress
  selector: string
  sinceTimestamp: UnixTime
  formula: TrackedTxSharpSubmissionConfig['formula']
  programHashes: string[]
}): Configuration<
  TrackedTxConfigEntry & {
    params: TrackedTxSharpSubmissionConfig
  }
> {
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
        formula,
        address,
        selector,
        programHashes,
      },
    },
  }
}

function mockSharedBridgeCall({
  id,
  projectId,
  subtype,
  address,
  selector,
  sinceTimestamp,
  formula,
  chainId,
  signature,
}: {
  id: TrackedTxId
  projectId: ProjectId
  subtype: TrackedTxsConfigSubtype
  address: EthereumAddress
  selector: string
  sinceTimestamp: UnixTime
  formula: TrackedTxSharedBridgeConfig['formula']
  chainId: number
  signature: `function ${string}`
}): Configuration<
  TrackedTxConfigEntry & {
    params: TrackedTxSharedBridgeConfig
  }
> {
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
        formula,
        address,
        selector,
        chainId,
        signature,
      },
    },
  }
}
