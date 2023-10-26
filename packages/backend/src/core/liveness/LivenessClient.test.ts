import { BigQueryClient } from '@l2beat/shared'
import {
  EthereumAddress,
  LivenessType,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Project } from '../../model'
import { LivenessClient, mergeConfigs } from './LivenessClient'
import { LivenessConfig } from './types/LivenessConfig'
import {
  adjustToForBigqueryCall,
  getFunctionCallQuery,
  getTransferQuery,
  isTimestampInRange,
} from './utils'

describe(LivenessClient.name, () => {
  const ADDRESS_1 = EthereumAddress.random()
  const ADDRESS_2 = EthereumAddress.random()
  const ADDRESS_3 = EthereumAddress.random()
  const ADDRESS_4 = EthereumAddress.random()
  const ADDRESS_5 = EthereumAddress.random()
  const ADDRESS_6 = EthereumAddress.random()

  const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
  const TO = UnixTime.fromDate(new Date('2022-01-01T02:00:00Z'))

  const projects: Project[] = [
    {
      projectId: ProjectId('project1'),
      escrows: [],
      type: 'layer2',
      livenessConfig: {
        transfers: [
          {
            projectId: ProjectId('project1'),
            from: ADDRESS_1,
            to: ADDRESS_2,
            type: 'DA',
            sinceTimestamp: FROM,
            untilTimestamp: FROM.add(-1, 'days'),
          },
        ],
        functionCalls: [
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
        ],
        functionCalls: [
          {
            projectId: ProjectId('project2'),
            address: ADDRESS_6,
            selector: '0x7739cbe7',
            type: 'STATE',
            untilTimestamp: FROM.add(-1, 'days'),
            sinceTimestamp: FROM,
          },
        ],
      },
    },
  ]

  describe(LivenessClient.prototype.getLivenessData.name, () => {
    it('merges and filters configs, calls and returns valid data', async () => {
      const bigquery = mockObject<BigQueryClient>({
        query: async () => [],
      })
      const fromUnix = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
      const toUnix = UnixTime.fromDate(new Date('2022-01-03T00:00:00Z'))

      const livenessClient = new LivenessClient(bigquery)

      const { to } = await livenessClient.getLivenessData(
        projects,
        fromUnix,
        toUnix,
      )

      expect(bigquery.query).toHaveBeenCalledTimes(2)
      expect(to).toEqual(UnixTime.fromDate(new Date('2022-01-02T00:00:00Z')))
    })
  })

  describe(LivenessClient.prototype.getTransfers.name, () => {
    it('generates SQL, calls and return valid data', async () => {
      const projects: Project[] = [
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
                sinceTimestamp: FROM.add(-2, 'days'),
                untilTimestamp: FROM.add(-1, 'days'),
              },
              {
                projectId: ProjectId('project1'),
                from: ADDRESS_1,
                to: ADDRESS_2,
                type: 'DA',
                sinceTimestamp: FROM,
                untilTimestamp: FROM.add(1, 'days'),
              },
            ],
            functionCalls: [],
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
                sinceTimestamp: TO.add(1, 'days'),
              },
            ],
            functionCalls: [],
          },
        },
      ]

      const bigQueryResponse = [
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

      const bigquery = mockObject<BigQueryClient>({
        query: async () => bigQueryResponse,
      })

      const config: LivenessConfig = mergeConfigs(projects)
      const adjustedTo = adjustToForBigqueryCall(FROM.toNumber(), TO.toNumber())

      const transfersConfig = config.transfers.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          FROM,
          adjustedTo,
        ),
      )

      const livenessClient = new LivenessClient(bigquery)
      const result = await livenessClient.getTransfers(
        transfersConfig,
        FROM,
        adjustedTo,
      )
      const expected = [
        {
          projectId: ProjectId('project1'),
          timestamp: new UnixTime(1640995200),
          blockNumber: 1,
          txHash: '0x123456',
          type: LivenessType('DA'),
        },
        {
          projectId: ProjectId('project2'),
          timestamp: new UnixTime(1640995200),
          blockNumber: 2,
          txHash: '0x123456',
          type: LivenessType('STATE'),
        },
      ]

      expect(result).toEqual(expected)

      expect(bigquery.query).toHaveBeenCalledTimes(1)
      expect(bigquery.query).toHaveBeenCalledWith(
        getTransferQuery(transfersConfig, FROM, TO),
      )
    })

    it('does not call query when empty config', async () => {
      const bigquery = mockObject<BigQueryClient>({
        query: async () => [],
      })

      const livenessClient = new LivenessClient(bigquery)
      await livenessClient.getTransfers([], FROM, TO)
      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })

  describe(LivenessClient.prototype.getFunctionCalls.name, () => {
    it('generates SQL, calls and return valid data', async () => {
      const projects: Project[] = [
        {
          projectId: ProjectId('project1'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [],
            functionCalls: [
              // this one should not be used
              {
                projectId: ProjectId('project1'),
                address: ADDRESS_2,
                selector: '0x9aaab648',
                type: 'DA',
                sinceTimestamp: FROM.add(-2, 'days'),
                untilTimestamp: FROM.add(-1, 'days'),
              },
              {
                projectId: ProjectId('project1'),
                address: ADDRESS_2,
                selector: '0x9aaab648',
                type: 'DA',
                sinceTimestamp: FROM,
                untilTimestamp: FROM.add(1, 'days'),
              },
            ],
          },
        },
        {
          projectId: ProjectId('project2'),
          escrows: [],
          type: 'layer2',
          livenessConfig: {
            transfers: [],
            functionCalls: [
              {
                projectId: ProjectId('project2'),
                address: ADDRESS_3,
                selector: '0x7739cbe7',
                type: 'STATE',
                sinceTimestamp: FROM,
              },
              // this one should not be used
              {
                projectId: ProjectId('project2'),
                address: ADDRESS_3,
                selector: '0x7739cbe7',
                type: 'STATE',
                sinceTimestamp: TO.add(1, 'days'),
              },
            ],
          },
        },
      ]

      const bigQueryResponse = [
        {
          block_number: 1,
          block_timestamp: {
            value: FROM.toDate().toISOString(),
          },
          to_address: ADDRESS_2,
          input: '0x9aaab648',
          transaction_hash: '0x123456',
        },
        {
          block_number: 2,
          block_timestamp: {
            value: FROM.toDate().toISOString(),
          },
          input: '0x7739cbe7',
          to_address: ADDRESS_3,
          transaction_hash: '0x123456',
        },
      ]

      const bigquery = mockObject<BigQueryClient>({
        query: async () => bigQueryResponse,
      })

      const config: LivenessConfig = mergeConfigs(projects)
      const adjustedTo = adjustToForBigqueryCall(FROM.toNumber(), TO.toNumber())

      const functionCallsConfig = config.functionCalls.filter((c) =>
        isTimestampInRange(
          c.sinceTimestamp,
          c.untilTimestamp,
          FROM,
          adjustedTo,
        ),
      )
      const livenessClient = new LivenessClient(bigquery)
      const result = await livenessClient.getFunctionCalls(
        functionCallsConfig,
        FROM,
        adjustedTo,
      )
      const expected = [
        {
          projectId: ProjectId('project1'),
          timestamp: new UnixTime(1640995200),
          blockNumber: 1,
          txHash: '0x123456',
          type: LivenessType('DA'),
        },
        {
          projectId: ProjectId('project2'),
          timestamp: new UnixTime(1640995200),
          blockNumber: 2,
          txHash: '0x123456',
          type: LivenessType('STATE'),
        },
      ]

      expect(result).toEqual(expected)
      expect(bigquery.query).toHaveBeenCalledTimes(1)
      expect(bigquery.query).toHaveBeenCalledWith(
        getFunctionCallQuery(functionCallsConfig, FROM, TO),
      )
    })

    it('does not call query when empty config', async () => {
      const bigquery = mockObject<BigQueryClient>({
        query: async () => [],
      })

      const livenessClient = new LivenessClient(bigquery)
      await livenessClient.getFunctionCalls([], FROM, TO)
      expect(bigquery.query).not.toHaveBeenCalled()
    })
  })
})
