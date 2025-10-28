import type {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharedBridgeConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import { readFileSync } from 'fs'
import type { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import {
  agglayerSharedBridgeChainId,
  agglayerSharedBridgeVerifyBatchesInput,
  agglayerSharedBridgeVerifyBatchesSelector,
  agglayerSharedBridgeVerifyBatchesSignature,
  elasticChainSharedBridgeChainId,
  elasticChainSharedBridgeCommitBatchesInput,
  elasticChainSharedBridgeCommitBatchesSelector,
  elasticChainSharedBridgeCommitBatchesSignature,
  elasticChainSharedBridgeExecuteBatchesPost29Input,
  elasticChainSharedBridgeExecuteBatchesPost29Selector,
  elasticChainSharedBridgeExecuteBatchesPost29Signature,
  gatewaySharedBridgeChainAddress,
} from '../../test/sharedBridge'
import type { Configuration } from '../../tools/uif/multi/types'
import { TrackedTxsClient } from './TrackedTxsClient'
import {
  BigQueryFunctionCallResult,
  BigQueryTransferResult,
} from './types/model'
import { getFunctionCallQuery, getTransferQuery } from './utils/sql'
import { transformFunctionCallsQueryResult } from './utils/transformFunctionCallsQueryResult'
import { transformTransfersQueryResult } from './utils/transformTransfersQueryResult'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T02:00:00Z'))

describe(TrackedTxsClient.name, () => {
  describe(TrackedTxsClient.prototype.getData.name, () => {
    it('calls big query, parses results', async () => {
      const bigquery = getMockBiqQuery([TRANSFERS_RESPONSE, FUNCTIONS_RESPONSE])
      const trackedTxsClient = new TrackedTxsClient(bigquery)

      const data = await trackedTxsClient.getData(
        CONFIGURATIONS as unknown as Configuration<TrackedTxConfigEntry>[],
        FROM,
        TO,
      )

      // calls both internal methods
      expect(bigquery.query).toHaveBeenCalledTimes(2)
      expect(bigquery.query).toHaveBeenNthCalledWith(1, TRANSFERS_SQL)
      expect(bigquery.query).toHaveBeenNthCalledWith(2, FUNCTIONS_SQL)

      // returns parsed data returned from internal methods
      expect(data).toEqual([...TRANSFERS_RESULT, ...FUNCTIONS_RESULT])
    })
  })

  describe(TrackedTxsClient.prototype.getTransfers.name, () => {
    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])
      const trackedTxsClient = new TrackedTxsClient(bigquery)

      await trackedTxsClient.getTransfers([], FROM, TO)

      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })

  describe(TrackedTxsClient.prototype.getFunctionCalls.name, () => {
    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])
      const trackedTxsClient = new TrackedTxsClient(bigquery)

      await trackedTxsClient.getFunctionCalls([], [], [], FROM, TO)

      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })
})

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
// for the sake of simplicity those will be the same in all responses
const TX_HASH = '0x123456'
const BLOCK = 1

const inputFile = 'src/test/sharpVerifierInput.txt'
const sharpInput = readFileSync(inputFile, 'utf-8')
const paradexProgramHash =
  '3258367057337572248818716706664617507069572185152472699066582725377748079373'

const CONFIGURATIONS = [
  {
    id: '1',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '1',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'batchSubmissions',
      sinceTimestamp: FROM,
      untilTimestamp: FROM + 2 * UnixTime.DAY,
      params: {
        formula: 'transfer',
        from: ADDRESS_1,
        to: ADDRESS_2,
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxTransferConfig }
  >,
  {
    id: '2',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '2',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'batchSubmissions',
      sinceTimestamp: FROM,
      params: {
        formula: 'functionCall',
        address: ADDRESS_3,
        selector: '0x9aaab648',
        signature: 'function foo()',
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxFunctionCallConfig }
  >,
  {
    id: '3',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '3',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'batchSubmissions',
      sinceTimestamp: FROM,
      params: {
        formula: 'sharpSubmission',
        address: EthereumAddress.random(),
        selector: '0x9b3b76cc',
        programHashes: [paradexProgramHash] as string[],
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharpSubmissionConfig }
  >,
  {
    id: '4',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '4',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'batchSubmissions',
      sinceTimestamp: FROM,
      params: {
        formula: 'sharedBridge',
        address: EthereumAddress.random(),
        selector: elasticChainSharedBridgeCommitBatchesSelector,
        firstParameter: elasticChainSharedBridgeChainId,
        signature: elasticChainSharedBridgeCommitBatchesSignature,
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
  >,
  {
    id: '5',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '5',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'batchSubmissions',
      sinceTimestamp: FROM,
      params: {
        formula: 'sharedBridge',
        address: EthereumAddress.random(),
        selector: agglayerSharedBridgeVerifyBatchesSelector,
        firstParameter: agglayerSharedBridgeChainId,
        signature: agglayerSharedBridgeVerifyBatchesSignature,
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
  >,
  {
    id: '6',
    hasData: true,
    minHeight: 1,
    maxHeight: 100,
    properties: {
      id: '6',
      projectId: ProjectId('project1'),
      type: 'l2costs',
      subtype: 'stateUpdates',
      sinceTimestamp: FROM,
      params: {
        formula: 'sharedBridge',
        address: EthereumAddress.random(),
        selector: elasticChainSharedBridgeExecuteBatchesPost29Selector,
        firstParameter: EthereumAddress(gatewaySharedBridgeChainAddress),
        signature: elasticChainSharedBridgeExecuteBatchesPost29Signature,
      },
    },
  } as Configuration<
    TrackedTxConfigEntry & { params: TrackedTxSharedBridgeConfig }
  >,
] as const

const TRANSFERS_RESPONSE = [
  {
    hash: TX_HASH,
    from_address: CONFIGURATIONS[0].properties.params.from,
    to_address: CONFIGURATIONS[0].properties.params.to,
    block_timestamp: toBigQueryDate(FROM),
    block_number: BLOCK,
    gas_price: 25,
    receipt_gas_used: 100,
    transaction_type: 2,
    data_length: 100,
    non_zero_bytes: 60,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
]

const parsedTransfers = v
  .array(BigQueryTransferResult)
  .parse(TRANSFERS_RESPONSE)
const TRANSFERS_RESULT = transformTransfersQueryResult(
  [CONFIGURATIONS[0]],
  parsedTransfers,
)

const FUNCTIONS_RESPONSE = [
  {
    hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: CONFIGURATIONS[1].properties.params.address,
    gas_price: 1000,
    receipt_gas_used: 200000,
    input: CONFIGURATIONS[1].properties.params.selector,
    transaction_type: 2,
    data_length: 100,
    non_zero_bytes: 60,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
  {
    hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: CONFIGURATIONS[2].properties.params.address,
    gas_price: 1500,
    receipt_gas_used: 200000,
    input: sharpInput,
    transaction_type: 3,
    data_length: 0,
    non_zero_bytes: 0,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
  {
    hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: CONFIGURATIONS[3].properties.params.address,
    gas_price: 1500,
    receipt_gas_used: 200000,
    input: elasticChainSharedBridgeCommitBatchesInput,
    transaction_type: 3,
    data_length: 0,
    non_zero_bytes: 0,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
  {
    hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: CONFIGURATIONS[4].properties.params.address,
    gas_price: 1500,
    receipt_gas_used: 200000,
    input: agglayerSharedBridgeVerifyBatchesInput,
    transaction_type: 3,
    data_length: 0,
    non_zero_bytes: 0,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
  {
    hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: CONFIGURATIONS[5].properties.params.address,
    gas_price: 1500,
    receipt_gas_used: 200000,
    input: elasticChainSharedBridgeExecuteBatchesPost29Input,
    transaction_type: 3,
    data_length: 0,
    non_zero_bytes: 0,
    receipt_blob_gas_used: 300,
    receipt_blob_gas_price: 3,
  },
]

const parsedFunctionCalls = v
  .array(BigQueryFunctionCallResult)
  .parse(FUNCTIONS_RESPONSE)
const FUNCTIONS_RESULT = transformFunctionCallsQueryResult(
  [CONFIGURATIONS[1]],
  [CONFIGURATIONS[2]],
  [CONFIGURATIONS[3], CONFIGURATIONS[4], CONFIGURATIONS[5]],
  parsedFunctionCalls,
)

const TRANSFERS_SQL = getTransferQuery(
  [CONFIGURATIONS[0].properties.params],
  FROM,
  TO,
)
const FUNCTIONS_SQL = getFunctionCallQuery(
  (
    CONFIGURATIONS.slice(1) as Configuration<
      TrackedTxConfigEntry & {
        params:
          | TrackedTxSharpSubmissionConfig
          | TrackedTxFunctionCallConfig
          | TrackedTxSharedBridgeConfig
      }
    >[]
  ).map((c) => ({
    address: c.properties.params.address,
    selector: c.properties.params.selector,
    getFullInput:
      c.properties.params.formula === 'sharpSubmission' ||
      c.properties.params.formula === 'sharedBridge',
  })),
  FROM,
  TO,
)

function toBigQueryDate(timestamp: UnixTime) {
  return { value: UnixTime.toDate(timestamp).toISOString() }
}

function getMockBiqQuery(responses: unknown[][]) {
  const client = mockObject<BigQueryClient>({
    query: mockFn(),
  })

  for (const response of responses) {
    client.query.resolvesToOnce(response)
  }

  return client
}
