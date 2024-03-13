import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { readFileSync } from 'fs'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { TrackedTxsClient } from './TrackedTxsClient'
import {
  BigQueryFunctionCallResult,
  BigQueryTransferResult,
} from './types/model'
import {
  TrackedTxConfigEntry,
  TrackedTxFunctionCallConfig,
  TrackedTxSharpSubmissionConfig,
  TrackedTxTransferConfig,
} from './types/TrackedTxsConfig'
import { getFunctionCallQuery, getTransferQuery } from './utils/sql'
import { transformFunctionCallsQueryResult } from './utils/transformFunctionCallsQueryResult'
import { transformTransfersQueryResult } from './utils/transformTransfersQueryResult'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T02:00:00Z'))

describe(TrackedTxsClient.name, () => {
  describe(TrackedTxsClient.prototype.getData.name, () => {
    it('filters configurations and calls big query, parses results', async () => {
      const bigquery = getMockBiqQuery([TRANSFERS_RESPONSE, FUNCTIONS_RESPONSE])
      const trackedTxsClient = new TrackedTxsClient(bigquery)

      const data = await trackedTxsClient.getData(CONFIGURATIONS, FROM, TO)

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

      await trackedTxsClient.getFunctionCalls([], [], FROM, TO)

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

const inputFile = `src/test/sharpVerifierInput.txt`
const sharpInput = readFileSync(inputFile, 'utf-8')
const paradexProgramHash =
  '3258367057337572248818716706664617507069572185152472699066582725377748079373'

const CONFIGURATIONS: TrackedTxConfigEntry[] = [
  {
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: ADDRESS_1,
    to: ADDRESS_2,
    sinceTimestamp: FROM,
    untilTimestamp: FROM.add(2, 'days'),
    uses: [],
  },
  {
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: ADDRESS_3,
    selector: '0x9aaab648',
    sinceTimestamp: FROM,
    uses: [],
  },
  {
    projectId: ProjectId('project1'),
    formula: 'sharpSubmission',
    programHashes: [paradexProgramHash],
    sinceTimestamp: FROM,
    address: EthereumAddress.random(),
    selector: '0x9b3b76cc',
    uses: [],
  },
]

const TRANSFERS_RESPONSE = [
  {
    transaction_hash: TX_HASH,
    from_address: (CONFIGURATIONS[0] as TrackedTxTransferConfig).from,
    to_address: (CONFIGURATIONS[0] as TrackedTxTransferConfig).to,
    block_timestamp: toBigQueryDate(FROM),
    block_number: BLOCK,
    gas_price: 25,
    receipt_gas_used: 100,
  },
]
const parsedTransfers = BigQueryTransferResult.array().parse(TRANSFERS_RESPONSE)
const TRANSFERS_RESULT = transformTransfersQueryResult(
  [CONFIGURATIONS[0] as TrackedTxTransferConfig],
  parsedTransfers,
)

const FUNCTIONS_RESPONSE = [
  {
    transaction_hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: (CONFIGURATIONS[1] as TrackedTxFunctionCallConfig).address,
    gas_price: 1000,
    receipt_gas_used: 200000,
    input: (CONFIGURATIONS[1] as TrackedTxFunctionCallConfig).selector,
  },
  {
    transaction_hash: TX_HASH,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    to_address: (CONFIGURATIONS[2] as TrackedTxFunctionCallConfig).address,
    gas_price: 1500,
    receipt_gas_used: 200000,
    input: sharpInput,
  },
]

const parsedFunctionCalls =
  BigQueryFunctionCallResult.array().parse(FUNCTIONS_RESPONSE)
const FUNCTIONS_RESULT = transformFunctionCallsQueryResult(
  [CONFIGURATIONS[1] as TrackedTxFunctionCallConfig],
  [CONFIGURATIONS[2] as TrackedTxSharpSubmissionConfig],
  parsedFunctionCalls,
)

const TRANSFERS_SQL = getTransferQuery(
  [CONFIGURATIONS[0] as TrackedTxTransferConfig],
  FROM,
  TO,
)
const FUNCTIONS_SQL = getFunctionCallQuery(
  (
    CONFIGURATIONS.slice(1) as (
      | TrackedTxFunctionCallConfig
      | TrackedTxSharpSubmissionConfig
    )[]
  ).map((c) => ({
    address: c.address,
    selector: c.selector,
    getFullInput: c.formula === 'sharpSubmission',
  })),
  FROM,
  TO,
)

function toBigQueryDate(timestamp: UnixTime) {
  return { value: timestamp.toDate().toISOString() }
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
