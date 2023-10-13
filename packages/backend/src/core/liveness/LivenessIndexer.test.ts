import {
  BigQueryClient,
  BigQueryFunctionCallsResult,
  BigQueryTransfersResult,
} from '@l2beat/shared'
import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { LivenessRecord } from '../../peripherals/database/LivenessRepository'
import { LivenessIndexer } from './LivenessIndexer'
import {
  LivenessConfig,
  LivenessFunctionCall,
  LivenessTransfer,
} from './types/LivenessConfig'
import {
  transformFunctionCallsQueryResult,
  transformTransfersQueryResult,
} from './utils'

const ADDRESS_1 = EthereumAddress.random()
const ADDRESS_2 = EthereumAddress.random()
const ADDRESS_3 = EthereumAddress.random()
const ADDRESS_4 = EthereumAddress.random()
const ADDRESS_5 = EthereumAddress.random()
const ADDRESS_6 = EthereumAddress.random()

const FROM = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))
const TO = UnixTime.fromDate(new Date('2022-01-01T00:00:00Z'))

describe(LivenessIndexer.name, () => {
  describe(LivenessIndexer.prototype.getTransfers.name, () => {
    it('should fetch and transform data properly', async () => {
      const queryResults: BigQueryTransfersResult = [
        {
          block_number: 1,
          block_timestamp: FROM,
          from_address: ADDRESS_1,
          to_address: ADDRESS_2,
          transaction_hash: '0xabcdef1234567890',
        },
        {
          block_number: 2,
          block_timestamp: FROM,
          from_address: ADDRESS_3,
          to_address: ADDRESS_4,
          transaction_hash: '0xabcdef1234567891',
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: mockFn().resolvesToOnce(queryResults),
      })

      const configs: LivenessTransfer[] = [
        {
          projectId: ProjectId('project1'),
          from: ADDRESS_1,
          to: ADDRESS_2,
          type: 'DA',
        },
        {
          projectId: ProjectId('project2'),
          from: ADDRESS_3,
          to: ADDRESS_4,
          type: 'STATE',
        },
      ]

      const expected: LivenessRecord[] = transformTransfersQueryResult(
        configs,
        queryResults,
      )

      const livenessIndexer = new LivenessIndexer(bigQueryClient)
      const results = await livenessIndexer.getTransfers(configs, FROM, TO)

      expect(results).toEqual(expected)
      expect(bigQueryClient.getTransfers).toHaveBeenNthCalledWith(
        1,
        configs,
        FROM,
        TO,
      )
    })
  })

  describe(LivenessIndexer.prototype.getFunctionCalls.name, () => {
    it('should fetch and transform data properly', async () => {
      const queryResults: BigQueryFunctionCallsResult = [
        {
          block_number: 1,
          block_timestamp: FROM,
          input: '0x9aaab648da640f49b7fbd17ea63a961cba1b09414',
          to_address: ADDRESS_1,
          transaction_hash: '0xabcdef1234567890',
        },
        {
          block_number: 2,
          block_timestamp: FROM,
          input: '0x7739cbe7d5363037dc70ec111bd9b26f95981f3e8',
          to_address: ADDRESS_2,
          transaction_hash: '0xabcdef1234567891',
        },
      ]

      const bigQueryClient = mockObject<BigQueryClient>({
        getFunctionCalls: mockFn().resolvesToOnce(queryResults),
      })

      const configs: LivenessFunctionCall[] = [
        {
          projectId: ProjectId('project1'),
          address: ADDRESS_1,
          selector: '0x9aaab648',
          type: 'DA',
        },
        {
          projectId: ProjectId('project2'),
          address: ADDRESS_2,
          selector: '0x7739cbe7',
          type: 'STATE',
        },
      ]
      const expected: LivenessRecord[] = transformFunctionCallsQueryResult(
        configs,
        queryResults,
      )

      const livenessIndexer = new LivenessIndexer(bigQueryClient)
      const results = await livenessIndexer.getFunctionCalls(configs, FROM, TO)

      expect(results).toEqual(expected)
      expect(bigQueryClient.getFunctionCalls).toHaveBeenNthCalledWith(
        1,
        configs,
        FROM,
        TO,
      )
    })
  })

  describe(LivenessIndexer.prototype.getLivenessData.name, () => {
    it('prepares config properly and calls internal methods', async () => {
      const configs: LivenessConfig = {
        transfers: [
          {
            projectId: ProjectId('project1'),
            from: ADDRESS_1,
            to: ADDRESS_2,
            type: 'DA',
            untilTimestamp: FROM.add(-1, 'days'),
          },
          {
            projectId: ProjectId('project2'),
            from: ADDRESS_3,
            to: ADDRESS_4,
            type: 'STATE',
          },
        ],
        functionCalls: [
          {
            projectId: ProjectId('project1'),
            address: ADDRESS_5,
            selector: '0x9aaab648',
            type: 'DA',
          },
          {
            projectId: ProjectId('project2'),
            address: ADDRESS_6,
            selector: '0x7739cbe7',
            type: 'STATE',
            untilTimestamp: FROM.add(-1, 'days'),
          },
        ],
      }

      const bigQueryClient = mockObject<BigQueryClient>({
        getTransfers: mockFn().resolvesToOnce(
          BigQueryTransfersResult.parse([]),
        ),
        getFunctionCalls: mockFn().resolvesToOnce(
          BigQueryFunctionCallsResult.parse([]),
        ),
      })

      const livenessIndexer = new LivenessIndexer(bigQueryClient)
      await livenessIndexer.getLivenessData(configs, FROM, TO)

      expect(bigQueryClient.getTransfers).toHaveBeenNthCalledWith(
        1,
        [configs.transfers[1]],
        FROM,
        TO,
      )

      expect(bigQueryClient.getFunctionCalls).toHaveBeenNthCalledWith(
        1,
        [configs.functionCalls[0]],
        FROM,
        TO,
      )
    })
  })
})
