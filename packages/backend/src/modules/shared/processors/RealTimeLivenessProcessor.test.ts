import { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  RealTimeAnomalyRecord,
} from '@l2beat/database'
import type { RealTimeLivenessRecord } from '@l2beat/database/dist/other/real-time-liveness/entity'
import type { TrackedTxConfigEntry } from '@l2beat/shared'
import {
  type Block,
  EthereumAddress,
  type Log,
  ProjectId,
  type Transaction,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Config } from '../../../config'
import type { TrackedTxsConfig } from '../../../config/Config'
import { mockDatabase } from '../../../test/database'
import type { AnomalyNotifier } from '../notifiers/AnomalyNotifier'
import { RealTimeLivenessProcessor } from './RealTimeLivenessProcessor'

describe(RealTimeLivenessProcessor.prototype.constructor.name, () => {
  describe(RealTimeLivenessProcessor.prototype.init.name, () => {
    it('should init processor', async () => {
      const config = createMockConfig(ProjectId('project-id'), [])
      const processor = new RealTimeLivenessProcessor(
        config,
        Logger.SILENT,
        mockDatabase(),
        mockObject<AnomalyNotifier>(),
      )

      const mockDeleteForArchivedProjects = mockFn().resolvesTo(undefined)
      processor.deleteForArchivedProjects = mockDeleteForArchivedProjects

      await processor.init()

      expect(mockDeleteForArchivedProjects).toHaveBeenCalled()
    })
  })

  describe(RealTimeLivenessProcessor.prototype.processBlock.name, () => {
    it('should match liveness txs and detect anomalies', async () => {
      const block = mockObject<Block>({
        number: 123,
        timestamp: UnixTime.now(),
        transactions: [],
      })

      const config = createMockConfig(ProjectId('project-id'), [])
      const processor = new RealTimeLivenessProcessor(
        config,
        Logger.SILENT,
        mockDatabase(),
        mockObject<AnomalyNotifier>(),
      )

      const mockMatchLivenessTransactions = mockFn().resolvesTo(undefined)
      processor.matchLivenessTransactions = mockMatchLivenessTransactions

      const mockCheckForAnomalies = mockFn().resolvesTo(undefined)
      processor.checkForAnomalies = mockCheckForAnomalies

      await processor.processBlock(block, [])

      expect(mockMatchLivenessTransactions).toHaveBeenCalledWith(block, [])
      expect(mockCheckForAnomalies).toHaveBeenCalledWith(block)
    })
  })

  describe(
    RealTimeLivenessProcessor.prototype.matchLivenessTransactions.name,
    () => {
      it('should match txs and create liveness records', async () => {
        const realTimeLivenessRepository = mockObject<
          Database['realTimeLiveness']
        >({
          upsertMany: mockFn().resolvesTo(undefined),
        })

        const projectId = ProjectId('project-id')
        const from = EthereumAddress.random()
        const to = EthereumAddress.random()
        const selector = '0x12345678'
        const topic = '0xabcdef12'

        const configurations: TrackedTxConfigEntry[] = [
          {
            type: 'liveness' as const,
            id: 'tracked-tx-1',
            projectId,
            subtype: 'stateUpdates' as const,
            sinceTimestamp: UnixTime.now(),
            params: {
              formula: 'transfer' as const,
              from,
              to,
            },
          },
          {
            type: 'liveness' as const,
            id: 'tracked-tx-2',
            projectId,
            subtype: 'stateUpdates' as const,
            sinceTimestamp: UnixTime.now(),
            params: {
              formula: 'functionCall' as const,
              address: to,
              selector,
              signature: 'function transfer(address,uint256)',
              topics: [topic],
            },
          },
        ]

        const txHash1 = '0x123'
        const txHash2 = '0x124'

        const transactions: Transaction[] = [
          {
            hash: txHash1,
            from,
            to,
            data: `${selector}000123`,
          },
        ]

        const block = mockObject<Block>({
          number: 123,
          timestamp: UnixTime.now(),
          transactions,
        })

        const logs: Log[] = [
          {
            address: to,
            topics: [topic],
            data: '0xdata',
            transactionHash: txHash1,
            blockNumber: block.number,
          },
          {
            address: to,
            topics: [topic],
            data: '0xdata',
            transactionHash: txHash2,
            blockNumber: block.number,
          },
        ]

        const config = createMockConfig(projectId, configurations)
        const processor = new RealTimeLivenessProcessor(
          config,
          Logger.SILENT,
          mockDatabase({ realTimeLiveness: realTimeLivenessRepository }),
          mockObject<AnomalyNotifier>(),
        )

        await processor.matchLivenessTransactions(block, logs)

        expect(realTimeLivenessRepository.upsertMany).toHaveBeenCalledWith([
          {
            configurationId: configurations[0].id,
            txHash: txHash1,
            blockNumber: block.number,
            timestamp: block.timestamp,
          },
          {
            configurationId: configurations[1].id,
            txHash: txHash1,
            blockNumber: block.number,
            timestamp: block.timestamp,
          },
          {
            configurationId: configurations[1].id,
            txHash: txHash2,
            blockNumber: block.number,
            timestamp: block.timestamp,
          },
        ])
      })
    },
  )

  describe(RealTimeLivenessProcessor.prototype.checkForAnomalies.name, () => {
    it('should detect new anomaly', async () => {
      const projectId = ProjectId('project-id')
      const configurationId1 = 'tracked-tx-1'
      const configurationId2 = 'tracked-tx-2'
      const subtype = 'stateUpdates'
      const lastTxTimestamp = UnixTime.now() - 5 * UnixTime.HOUR

      const anomalyStatsRepository = mockObject<Database['anomalyStats']>({
        getLatestStats: mockFn().resolvesTo([
          {
            timestamp: UnixTime.now(),
            projectId,
            subtype,
            mean: 10,
            stdDev: 20,
          },
        ] as AnomalyStatsRecord[]),
      })

      const realTimeLivenessRepository = mockObject<
        Database['realTimeLiveness']
      >({
        getLatestRecords: mockFn().resolvesTo([
          {
            configurationId: configurationId1,
            txHash: '0x123',
            blockNumber: 123,
            timestamp: lastTxTimestamp,
          },
          {
            configurationId: configurationId1,
            txHash: '0x123',
            blockNumber: 123,
            timestamp: lastTxTimestamp - 1 * UnixTime.MINUTE,
          },
        ] as RealTimeLivenessRecord[]),
      })

      const realTimeAnomaliesRepository = mockObject<
        Database['realTimeAnomalies']
      >({
        getOngoingAnomalies: mockFn().resolvesTo([]),
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configurations: TrackedTxConfigEntry[] = [
        {
          type: 'liveness' as const,
          id: configurationId1,
          projectId,
          subtype: 'stateUpdates' as const,
          sinceTimestamp: UnixTime.now(),
          params: {
            formula: 'transfer' as const,
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
          },
        },
        {
          type: 'liveness' as const,
          id: configurationId2,
          projectId,
          subtype: 'stateUpdates' as const,
          sinceTimestamp: UnixTime.now(),
          params: {
            formula: 'transfer' as const,
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
          },
        },
      ]

      const config = createMockConfig(projectId, configurations)

      const mockNotifier = mockObject<AnomalyNotifier>({
        anomalyDetected: mockFn().resolvesTo(undefined),
      })

      const processor = new RealTimeLivenessProcessor(
        config,
        Logger.SILENT,
        mockDatabase({
          anomalyStats: anomalyStatsRepository,
          realTimeLiveness: realTimeLivenessRepository,
          realTimeAnomalies: realTimeAnomaliesRepository,
        }),
        mockNotifier,
      )

      const block = mockObject<Block>({
        number: 123,
        timestamp: UnixTime.now(),
        transactions: [],
      })

      await processor.checkForAnomalies(block)

      expect(anomalyStatsRepository.getLatestStats).toHaveBeenCalled()
      expect(realTimeLivenessRepository.getLatestRecords).toHaveBeenCalled()
      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(realTimeAnomaliesRepository.upsertMany).toHaveBeenCalledWith([
        {
          start: lastTxTimestamp,
          projectId: projectId,
          subtype: subtype,
          status: 'ongoing',
          isApproved: false,
        },
      ])

      expect(mockNotifier.anomalyDetected).toHaveBeenCalled()
    })

    it('should detect ongoing anomaly', async () => {
      const projectId = ProjectId('project-id')
      const configurationId = 'tracked-tx-1'
      const subtype = 'stateUpdates'
      const lastTxTimestamp = UnixTime.now() - 5 * UnixTime.HOUR

      const anomalyStatsRepository = mockObject<Database['anomalyStats']>({
        getLatestStats: mockFn().resolvesTo([
          {
            timestamp: UnixTime.now(),
            projectId,
            subtype,
            mean: 10,
            stdDev: 20,
          },
        ] as AnomalyStatsRecord[]),
      })

      const realTimeLivenessRepository = mockObject<
        Database['realTimeLiveness']
      >({
        getLatestRecords: mockFn().resolvesTo([
          {
            configurationId,
            txHash: '0x123',
            blockNumber: 123,
            timestamp: lastTxTimestamp,
          },
        ] as RealTimeLivenessRecord[]),
      })

      const realTimeAnomaliesRepository = mockObject<
        Database['realTimeAnomalies']
      >({
        getOngoingAnomalies: mockFn().resolvesTo([
          {
            start: lastTxTimestamp,
            projectId: projectId,
            subtype: subtype,
            status: 'ongoing',
            isApproved: false,
          },
        ] as RealTimeAnomalyRecord[]),
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configurations: TrackedTxConfigEntry[] = [
        {
          type: 'liveness' as const,
          id: configurationId,
          projectId,
          subtype: 'stateUpdates' as const,
          sinceTimestamp: UnixTime.now(),
          params: {
            formula: 'transfer' as const,
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
          },
        },
      ]

      const config = createMockConfig(projectId, configurations)

      const mockNotifier = mockObject<AnomalyNotifier>({
        anomalyOngoing: mockFn().resolvesTo(undefined),
      })

      const processor = new RealTimeLivenessProcessor(
        config,
        Logger.SILENT,
        mockDatabase({
          anomalyStats: anomalyStatsRepository,
          realTimeLiveness: realTimeLivenessRepository,
          realTimeAnomalies: realTimeAnomaliesRepository,
        }),
        mockNotifier,
      )

      const block = mockObject<Block>({
        number: 123,
        timestamp: UnixTime.now(),
        transactions: [],
      })

      await processor.checkForAnomalies(block)

      expect(anomalyStatsRepository.getLatestStats).toHaveBeenCalled()
      expect(realTimeLivenessRepository.getLatestRecords).toHaveBeenCalled()
      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(realTimeAnomaliesRepository.upsertMany).not.toHaveBeenCalled()
      expect(mockNotifier.anomalyOngoing).toHaveBeenCalled()
    })

    it('should recover from anomaly', async () => {
      const projectId = ProjectId('project-id')
      const configurationId = 'tracked-tx-1'
      const configurationId2 = 'tracked-tx-1'

      const startTimestamp = UnixTime.now() - 5 * UnixTime.HOUR
      const lastTxTimestamp = UnixTime.now() - 5 * UnixTime.MINUTE

      const anomalyStatsRepository = mockObject<Database['anomalyStats']>({
        getLatestStats: mockFn().resolvesTo([
          {
            timestamp: UnixTime.now(),
            projectId,
            subtype: 'stateUpdates',
            mean: 10,
            stdDev: 20,
          },
          {
            timestamp: UnixTime.now(),
            projectId,
            subtype: 'proofSubmissions',
            mean: 10,
            stdDev: 20,
          },
        ] as AnomalyStatsRecord[]),
      })

      const realTimeLivenessRepository = mockObject<
        Database['realTimeLiveness']
      >({
        getLatestRecords: mockFn().resolvesTo([
          {
            configurationId,
            txHash: '0x123',
            blockNumber: 123,
            timestamp: lastTxTimestamp,
          },
          {
            configurationId: configurationId2,
            txHash: '0x123',
            blockNumber: 123,
            timestamp: lastTxTimestamp - 1 * UnixTime.MINUTE,
          },
        ] as RealTimeLivenessRecord[]),
      })

      const realTimeAnomaliesRepository = mockObject<
        Database['realTimeAnomalies']
      >({
        getOngoingAnomalies: mockFn().resolvesTo([
          {
            start: startTimestamp,
            projectId: projectId,
            subtype: 'stateUpdates',
            status: 'ongoing',
            isApproved: false,
          },
          {
            start: startTimestamp - 1 * UnixTime.MINUTE,
            projectId: projectId,
            subtype: 'proofSubmissions',
            status: 'ongoing',
            isApproved: true,
          },
        ] as RealTimeAnomalyRecord[]),
        upsertMany: mockFn().resolvesTo(undefined),
      })

      const configurations: TrackedTxConfigEntry[] = [
        {
          type: 'liveness' as const,
          id: configurationId,
          projectId,
          subtype: 'stateUpdates' as const,
          sinceTimestamp: UnixTime.now(),
          params: {
            formula: 'transfer' as const,
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
          },
        },
        {
          type: 'liveness' as const,
          id: configurationId2,
          projectId,
          subtype: 'proofSubmissions' as const,
          sinceTimestamp: UnixTime.now(),
          params: {
            formula: 'transfer' as const,
            from: EthereumAddress.random(),
            to: EthereumAddress.random(),
          },
        },
      ]

      const config = createMockConfig(projectId, configurations)

      const mockNotifier = mockObject<AnomalyNotifier>({
        anomalyRecovered: mockFn().resolvesTo(undefined),
      })

      const processor = new RealTimeLivenessProcessor(
        config,
        Logger.SILENT,
        mockDatabase({
          anomalyStats: anomalyStatsRepository,
          realTimeLiveness: realTimeLivenessRepository,
          realTimeAnomalies: realTimeAnomaliesRepository,
        }),
        mockNotifier,
      )

      const block = mockObject<Block>({
        number: 123,
        timestamp: UnixTime.now(),
        transactions: [],
      })

      await processor.checkForAnomalies(block)

      expect(anomalyStatsRepository.getLatestStats).toHaveBeenCalled()
      expect(realTimeLivenessRepository.getLatestRecords).toHaveBeenCalled()
      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(realTimeAnomaliesRepository.upsertMany).toHaveBeenCalledWith([
        {
          start: startTimestamp,
          projectId: projectId,
          subtype: 'stateUpdates',
          status: 'recovered',
          isApproved: false,
          end: lastTxTimestamp,
        },
        {
          start: startTimestamp - 1 * UnixTime.MINUTE,
          projectId: projectId,
          subtype: 'proofSubmissions',
          status: 'recovered',
          isApproved: true,
          end: lastTxTimestamp,
        },
      ])

      expect(mockNotifier.anomalyRecovered).toHaveBeenCalled()
    })
  })

  describe(
    RealTimeLivenessProcessor.prototype.deleteForArchivedProjects.name,
    () => {
      it('deletes anomalies for archived projects', async () => {
        const projectId = 'project-id'
        const config = createMockConfig(ProjectId(projectId), [], true)

        const realTimeAnomaliesRepository = mockObject<
          Database['realTimeAnomalies']
        >({
          getProjectIds: mockFn().resolvesTo([projectId]),
          deleteByProjectId: mockFn().resolvesTo(undefined),
        })

        const processor = new RealTimeLivenessProcessor(
          config,
          Logger.SILENT,
          mockDatabase({
            realTimeAnomalies: realTimeAnomaliesRepository,
          }),
          mockObject<AnomalyNotifier>(),
        )

        await processor.deleteForArchivedProjects()

        expect(realTimeAnomaliesRepository.getProjectIds).toHaveBeenCalled()

        expect(
          realTimeAnomaliesRepository.deleteByProjectId,
        ).toHaveBeenCalledWith([projectId])
      })
    },
  )
})

function createMockConfig(
  projectId: ProjectId,
  configurations: TrackedTxConfigEntry[],
  isArchived = false,
): Config {
  return mockObject<Config>({
    trackedTxsConfig: mockObject<TrackedTxsConfig>({
      projects: [
        {
          id: projectId,
          isArchived,
          configurations,
        },
      ],
    }),
  })
}
