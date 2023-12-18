import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { readFileSync } from 'fs'

import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { LivenessClient } from './LivenessClient'
import {
  LivenessConfigEntry,
  LivenessFunctionCall,
  LivenessSharpSubmission,
  LivenessTransfer,
  makeLivenessFunctionCall,
  makeLivenessSharpSubmissions,
  makeLivenessTransfer,
} from './types/LivenessConfig'
import {
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from './types/model'
import {
  getFunctionCallQuery,
  getTransferQuery,
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T02:00:00Z'))

describe(LivenessClient.name, () => {
  describe(LivenessClient.prototype.getLivenessData.name, () => {
    it('filters configurations and calls big query, parses results', async () => {
      const bigquery = getMockBiqQuery([TRANSFERS_RESPONSE, FUNCTIONS_RESPONSE])
      const livenessClient = new LivenessClient(bigquery)

      const data = await livenessClient.getLivenessData(
        CONFIGURATIONS,
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

  describe(LivenessClient.prototype.getTransfers.name, () => {
    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])
      const livenessClient = new LivenessClient(bigquery)

      await livenessClient.getTransfers([], FROM, TO)

      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })

  describe(LivenessClient.prototype.getFunctionCalls.name, () => {
    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])
      const livenessClient = new LivenessClient(bigquery)

      await livenessClient.getFunctionCalls([], [], FROM, TO)

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

const CONFIGURATIONS: LivenessConfigEntry[] = [
  makeLivenessTransfer({
    projectId: ProjectId('project1'),
    formula: 'transfer',
    from: ADDRESS_1,
    to: ADDRESS_2,
    type: 'DA',
    sinceTimestamp: FROM,
    untilTimestamp: FROM.add(2, 'days'),
  }),
  makeLivenessFunctionCall({
    projectId: ProjectId('project1'),
    formula: 'functionCall',
    address: ADDRESS_3,
    selector: '0x9aaab648',
    sinceTimestamp: FROM,
    type: 'STATE',
  }),
  makeLivenessSharpSubmissions({
    projectId: ProjectId('project1'),
    formula: 'sharpSubmission',
    programHashes: [paradexProgramHash],
    sinceTimestamp: FROM,
    type: 'STATE',
  }),
]

const TRANSFERS_RESPONSE = [
  {
    from_address: (CONFIGURATIONS[0] as LivenessTransfer).from,
    to_address: (CONFIGURATIONS[0] as LivenessTransfer).to,
    block_timestamp: toBigQueryDate(FROM),
    block_number: BLOCK,
    transaction_hash: TX_HASH,
  },
]
const parsedTransfers = BigQueryTransfersResult.parse(TRANSFERS_RESPONSE)
const TRANSFERS_RESULT = transformTransfersQueryResult(
  [CONFIGURATIONS[0] as LivenessTransfer],
  parsedTransfers,
)

const FUNCTIONS_RESPONSE = [
  {
    to_address: (CONFIGURATIONS[1] as LivenessFunctionCall).address,
    input: (CONFIGURATIONS[1] as LivenessFunctionCall).selector,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    transaction_hash: TX_HASH,
  },
  {
    to_address: (CONFIGURATIONS[2] as LivenessFunctionCall).address,
    input: sharpInput,
    block_number: BLOCK,
    block_timestamp: toBigQueryDate(FROM),
    transaction_hash: TX_HASH,
  },
]

const parsedFunctionCalls =
  BigQueryFunctionCallsResult.parse(FUNCTIONS_RESPONSE)
const FUNCTIONS_RESULT = transformFunctionCallsQueryResult(
  [CONFIGURATIONS[1] as LivenessFunctionCall],
  [CONFIGURATIONS[2] as LivenessSharpSubmission],
  parsedFunctionCalls,
)

const TRANSFERS_SQL = getTransferQuery(
  [CONFIGURATIONS[0] as LivenessTransfer],
  FROM,
  TO,
)
const FUNCTIONS_SQL = getFunctionCallQuery(
  (
    CONFIGURATIONS.slice(1) as (
      | LivenessFunctionCall
      | LivenessSharpSubmission
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
