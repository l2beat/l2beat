import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { Project } from '../../model'
import { BigQueryClient } from '../../peripherals/bigquery/BigQueryClient'
import { LivenessConfigurationRecord } from '../../peripherals/database/LivenessConfigurationRepository'
import { LivenessClient } from './LivenessClient'
import { LivenessFunctionCall, LivenessTransfer } from './types/LivenessConfig'
import { LivenessConfigurationIdentifier } from './types/LivenessConfigurationIdentifier'
import {
  getFunctionCallQuery,
  getTransferQuery,
  isTimestampInRange,
  mergeConfigs,
} from './utils'

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = FROM.add(2, 'days')

describe(LivenessClient.name, () => {
  describe(LivenessClient.prototype.getLivenessData.name, () => {
    it('calls and returns valid data', async () => {
      const bigquery = mockObject<BigQueryClient>({
        query: mockFn()
          .resolvesToOnce(TRANSFER_RESPONSE)
          .resolvesToOnce(FUNCTIONS_RESPONSE),
      })

      const livenessClient = new LivenessClient(bigquery)

      const transfersConfig = MERGED_CONFIGS.transfers.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          c.latestSyncedTimestamp,
          FROM,
          TO,
        ),
      )
      const functionCallsConfig = MERGED_CONFIGS.functionCalls.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          c.latestSyncedTimestamp,
          FROM,
          TO,
        ),
      )

      const data = await livenessClient.getLivenessData(
        transfersConfig,
        functionCallsConfig,
        FROM,
        TO,
      )

      const { transfers, functionCalls } = getFilteredConfigs(
        PROJECTS,
        LIVENESS_CONFIGURATIONS,
        FROM,
        TO,
      )

      // returns data returned from internal methods
      expect(data).toEqual([...TRANSFERS_EXPECTED, ...FUNCTION_EXPECTED])

      // calls both internal methods
      expect(bigquery.query).toHaveBeenCalledTimes(2)
      expect(bigquery.query).toHaveBeenNthCalledWith(
        1,
        getTransferQuery(transfers, FROM, TO),
      )
      expect(bigquery.query).toHaveBeenNthCalledWith(
        2,
        getFunctionCallQuery(functionCalls, FROM, TO),
      )
    })
  })

  describe(LivenessClient.prototype.getTransfers.name, () => {
    it('generates SQL, calls and return valid data', async () => {
      const bigquery = getMockBiqQuery(TRANSFER_RESPONSE)

      const to = FROM.add(1, 'hours')
      const { transfers } = getFilteredConfigs(
        PROJECTS,
        LIVENESS_CONFIGURATIONS,
        FROM,
        to,
      )

      const livenessClient = new LivenessClient(bigquery)
      const result = await livenessClient.getTransfers(transfers, FROM, to)

      expect(bigquery.query).toHaveBeenCalledTimes(1)
      expect(bigquery.query).toHaveBeenCalledWith(
        getTransferQuery(transfers, FROM, to),
      )

      expect(result).toEqual(TRANSFERS_EXPECTED)
    })

    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])

      const livenessClient = new LivenessClient(bigquery)
      await livenessClient.getTransfers([], FROM, TO)
      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })

  describe(LivenessClient.prototype.getFunctionCalls.name, () => {
    it('generates SQL, calls and return valid data', async () => {
      const bigquery = getMockBiqQuery(FUNCTIONS_RESPONSE)

      const to = FROM.add(1, 'hours')
      const { functionCalls } = getFilteredConfigs(
        PROJECTS,
        LIVENESS_CONFIGURATIONS,
        FROM,
        to,
      )

      const livenessClient = new LivenessClient(bigquery)
      const result = await livenessClient.getFunctionCalls(
        functionCalls,
        FROM,
        to,
      )

      expect(result).toEqual(FUNCTION_EXPECTED)
      expect(bigquery.query).toHaveBeenCalledTimes(1)
      expect(bigquery.query).toHaveBeenCalledWith(
        getFunctionCallQuery(functionCalls, FROM, to),
      )
    })

    it('does not call query when empty config', async () => {
      const bigquery = getMockBiqQuery([])

      const livenessClient = new LivenessClient(bigquery)
      await livenessClient.getFunctionCalls([], FROM, TO)
      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })
})

// MOCKS

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
const ADDRESS_4 = EthereumAddress.random()
const ADDRESS_5 = EthereumAddress.random()
const ADDRESS_6 = EthereumAddress.random()

const PROJECTS: Project[] = [
  {
    projectId: ProjectId('project1'),
    escrows: [],
    type: 'layer2',
    livenessConfig: {
      transfers: [
        // this one should not be used
        {
          projectId: ProjectId('project1'),
          from: EthereumAddress.random(),
          to: EthereumAddress.random(),
          type: 'DA',
          sinceTimestamp: FROM.add(-360, 'days'),
        },
        // this one should not be used
        {
          projectId: ProjectId('project1'),
          from: EthereumAddress.random(),
          to: EthereumAddress.random(),
          type: 'DA',
          sinceTimestamp: FROM.add(-2, 'days'),
          untilTimestamp: FROM.add(-1, 'days'),
        },
        {
          projectId: ProjectId('project1'),
          from: ADDRESS_1,
          to: ADDRESS_2,
          type: 'DA',
          sinceTimestamp: FROM,
        },
      ],
      functionCalls: [
        // this one should not be used
        {
          projectId: ProjectId('project1'),
          address: ADDRESS_3,
          selector: '0x12345678',
          type: 'STATE',
          sinceTimestamp: TO.add(1, 'days'),
        },
        {
          projectId: ProjectId('project1'),
          address: ADDRESS_5,
          selector: '0x9aaab648',
          sinceTimestamp: FROM,
          type: 'DA',
        },
      ],
    },
  },
  {
    projectId: ProjectId('project2'),
    escrows: [],
    type: 'layer2',
    livenessConfig: {
      transfers: [
        {
          projectId: ProjectId('project2'),
          from: ADDRESS_3,
          to: ADDRESS_4,
          type: 'STATE',
          sinceTimestamp: FROM,
        },
        // this one should not be used
        {
          projectId: ProjectId('project2'),
          from: EthereumAddress.random(),
          to: EthereumAddress.random(),
          type: 'STATE',
          sinceTimestamp: TO.add(7, 'days'),
        },
      ],
      functionCalls: [
        // this one should not be used
        {
          projectId: ProjectId('project2'),
          address: ADDRESS_2,
          selector: '0x12345678',
          type: 'DA',
          sinceTimestamp: FROM.add(-2, 'days'),
          untilTimestamp: FROM.add(-1, 'days'),
        },
        {
          projectId: ProjectId('project2'),
          address: ADDRESS_6,
          selector: '0x7739cbe7',
          type: 'STATE',
          sinceTimestamp: FROM,
        },
      ],
    },
  },
]

const LIVENESS_CONFIGURATIONS: LivenessConfigurationRecord[] = [
  {
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.transfers[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.transfers[0],
    ),
    params: '',
    sinceTimestamp: PROJECTS[0].livenessConfig!.transfers[0].sinceTimestamp,
    untilTimestamp: PROJECTS[0].livenessConfig!.transfers[0].untilTimestamp,
    lastSyncedTimestamp: FROM.add(1, 'days'),
  },
  {
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.transfers[1].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.transfers[1],
    ),
    params: '',
    sinceTimestamp: PROJECTS[0].livenessConfig!.transfers[1].sinceTimestamp,
    untilTimestamp: PROJECTS[0].livenessConfig!.transfers[1].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.transfers[2].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.transfers[2],
    ),
    params: '',
    sinceTimestamp: PROJECTS[0].livenessConfig!.transfers[2].sinceTimestamp,
    untilTimestamp: PROJECTS[0].livenessConfig!.transfers[2].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.functionCalls[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.functionCalls[0],
    ),
    params: '',
    sinceTimestamp: PROJECTS[0].livenessConfig!.functionCalls[0].sinceTimestamp,
    untilTimestamp: PROJECTS[0].livenessConfig!.functionCalls[0].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[0].projectId,
    type: PROJECTS[0].livenessConfig!.functionCalls[1].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[0].livenessConfig!.functionCalls[1],
    ),
    params: '',
    sinceTimestamp: PROJECTS[0].livenessConfig!.functionCalls[1].sinceTimestamp,
    untilTimestamp: PROJECTS[0].livenessConfig!.functionCalls[1].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[1].projectId,
    type: PROJECTS[1].livenessConfig!.transfers[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[1].livenessConfig!.transfers[0],
    ),
    params: '',
    sinceTimestamp: PROJECTS[1].livenessConfig!.transfers[0].sinceTimestamp,
    untilTimestamp: PROJECTS[1].livenessConfig!.transfers[0].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[1].projectId,
    type: PROJECTS[1].livenessConfig!.transfers[1].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[1].livenessConfig!.transfers[1],
    ),
    params: '',
    sinceTimestamp: PROJECTS[1].livenessConfig!.transfers[1].sinceTimestamp,
    untilTimestamp: PROJECTS[1].livenessConfig!.transfers[1].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[1].projectId,
    type: PROJECTS[1].livenessConfig!.functionCalls[0].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[1].livenessConfig!.functionCalls[0],
    ),
    params: '',
    sinceTimestamp: PROJECTS[1].livenessConfig!.functionCalls[0].sinceTimestamp,
    untilTimestamp: PROJECTS[1].livenessConfig!.functionCalls[0].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
  {
    projectId: PROJECTS[1].projectId,
    type: PROJECTS[1].livenessConfig!.functionCalls[1].type,
    identifier: LivenessConfigurationIdentifier(
      PROJECTS[1].livenessConfig!.functionCalls[1],
    ),
    params: '',
    sinceTimestamp: PROJECTS[1].livenessConfig!.functionCalls[1].sinceTimestamp,
    untilTimestamp: PROJECTS[1].livenessConfig!.functionCalls[1].untilTimestamp,
    lastSyncedTimestamp: undefined,
  },
].map((c, i) => ({ ...c, id: i }))

const TRANSFER_RESPONSE = [
  {
    block_number: 1,
    block_timestamp: {
      value: FROM.toDate().toISOString(),
    },
    from_address: ADDRESS_1,
    to_address: ADDRESS_2,
    transaction_hash: '0x123456',
  },
  {
    block_number: 2,
    block_timestamp: {
      value: FROM.toDate().toISOString(),
    },
    from_address: ADDRESS_3,
    to_address: ADDRESS_4,
    transaction_hash: '0x123456',
  },
]

const TRANSFERS_EXPECTED = [
  {
    timestamp: new UnixTime(1640995200),
    blockNumber: 1,
    txHash: '0x123456',
    livenessConfigurationId: 2,
  },
  {
    timestamp: new UnixTime(1640995200),
    blockNumber: 2,
    txHash: '0x123456',
    livenessConfigurationId: 5,
  },
]

const FUNCTIONS_RESPONSE = [
  {
    block_number: 1,
    block_timestamp: {
      value: FROM.toDate().toISOString(),
    },
    to_address: ADDRESS_5,
    input: '0x9aaab648',
    transaction_hash: '0x123456',
  },
  {
    block_number: 2,
    block_timestamp: {
      value: FROM.toDate().toISOString(),
    },
    input: '0x7739cbe7',
    to_address: ADDRESS_6,
    transaction_hash: '0x123456',
  },
]

const FUNCTION_EXPECTED = [
  {
    timestamp: new UnixTime(1640995200),
    blockNumber: 1,
    txHash: '0x123456',
    livenessConfigurationId: 4,
  },
  {
    timestamp: new UnixTime(1640995200),
    blockNumber: 2,
    txHash: '0x123456',
    livenessConfigurationId: 8,
  },
]

const MERGED_CONFIGS = mergeConfigs(PROJECTS, LIVENESS_CONFIGURATIONS)

function getMockBiqQuery(response: unknown[]) {
  return mockObject<BigQueryClient>({
    query: async () => response,
  })
}

function getFilteredConfigs(
  projects: Project[],
  configs: LivenessConfigurationRecord[],
  from: UnixTime,
  to: UnixTime,
): {
  transfers: LivenessTransfer[]
  functionCalls: LivenessFunctionCall[]
} {
  const config = mergeConfigs(projects, configs)

  const transfers = config.transfers.filter((c) =>
    isTimestampInRange(
      c.sinceTimestamp,
      c.untilTimestamp,
      c.latestSyncedTimestamp,
      from,
      to,
    ),
  )

  const functionCalls = config.functionCalls.filter((c) =>
    isTimestampInRange(
      c.sinceTimestamp,
      c.untilTimestamp,
      c.latestSyncedTimestamp,
      from,
      to,
    ),
  )

  return {
    transfers,
    functionCalls,
  }
}
