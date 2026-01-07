import { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  RealTimeAnomalyRecord,
  RealTimeLivenessRecord,
  UpdateDiffRecord,
} from '@l2beat/database'
import { type Block, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { TrackedTxProject, TrackedTxsConfig } from '../../config/Config'
import type { DiscordWebhookClient } from '../../peripherals/discord/DiscordWebhookClient'
import { mockDatabase } from '../../test/database'
import type { Clock } from '../../tools/Clock'
import { AnomalyNotifier } from './AnomalyNotifier'

describe(AnomalyNotifier.name, () => {
  describe(AnomalyNotifier.prototype.anomalyDetected.name, () => {
    it('notifies about new anomaly', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({
        mean: 60,
        stdDev: 15,
      })

      const newAnomaly: RealTimeAnomalyRecord = {
        start: lastRecord.timestamp,
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
      }

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalled()

      expect(notificationsRepository.insertMany).toHaveBeenCalledWith([
        {
          id: messageId,
          channel: 'discord',
          type: 'anomaly-detected',
          relatedEntityId: `${newAnomaly.projectId}-${newAnomaly.subtype}-${lastRecord.timestamp}`,
          timestamp: block.timestamp,
        },
      ])
    })

    it('does not notify if duration less than configured', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = mockObject<Block>()
      const lastRecord = mockObject<RealTimeLivenessRecord>()
      const stats = mockObject<AnomalyStatsRecord>()
      const newAnomaly = mockObject<RealTimeAnomalyRecord>()

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()

      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })

    it('does notify if duration less than configured, but z-score is over 100', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        60,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({
        mean: 60,
        stdDev: 15,
      })

      const newAnomaly: RealTimeAnomalyRecord = {
        start: lastRecord.timestamp,
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
      }

      await notifier.anomalyDetected(
        newAnomaly,
        10,
        101,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalled()
      expect(notificationsRepository.insertMany).toHaveBeenCalledWith([
        {
          id: messageId,
          channel: 'discord',
          type: 'anomaly-detected',
          relatedEntityId: `${newAnomaly.projectId}-${newAnomaly.subtype}-${lastRecord.timestamp}`,
          timestamp: block.timestamp,
        },
      ])
    })

    it('includes warning when there are implementation changes for functionCall config', async () => {
      const address = EthereumAddress.random()
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([
          mockUpdateDiff('project-1', `eth:${address.toString()}`),
        ]),
      })

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([
          mockTrackedTxProject(projectId, [
            {
              type: 'liveness',
              subtype,
              params: {
                formula: 'functionCall',
                address,
                selector: '0x1234',
                signature: 'function submit()',
              },
            },
          ]),
        ]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({
        mean: 60,
        stdDev: 15,
      })

      const newAnomaly: RealTimeAnomalyRecord = {
        start: lastRecord.timestamp,
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
      }

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        expect.includes('⚠️ There are unhandled implementation changes. ⚠️'),
      )
    })

    it('includes warning when there are implementation changes for transfer config (from)', async () => {
      const fromAddress = EthereumAddress.random()
      const toAddress = EthereumAddress.random()
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([
          mockUpdateDiff('project-1', `eth:${fromAddress.toString()}`),
        ]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([
          mockTrackedTxProject('project-1', [
            {
              type: 'liveness',
              subtype: 'batchSubmissions',
              params: {
                formula: 'transfer',
                from: fromAddress,
                to: toAddress,
              },
            },
          ]),
        ]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const newAnomaly: RealTimeAnomalyRecord = {
        start: 5678,
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        status: 'ongoing',
        isApproved: false,
      }

      const block = mockObject<Block>({ number: 123456, timestamp: 1234 })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({ mean: 60, stdDev: 15 })

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        expect.includes('⚠️ There are unhandled implementation changes. ⚠️'),
      )
    })

    it('includes warning when there are implementation changes for transfer config (to)', async () => {
      const toAddress = EthereumAddress.random()
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([
          mockUpdateDiff('project-1', `eth:${toAddress.toString()}`),
        ]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([
          mockTrackedTxProject('project-1', [
            {
              type: 'liveness',
              subtype: 'batchSubmissions',
              params: {
                formula: 'transfer',
                to: toAddress,
              },
            },
          ]),
        ]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const newAnomaly: RealTimeAnomalyRecord = {
        start: 5678,
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        status: 'ongoing',
        isApproved: false,
      }

      const block = mockObject<Block>({ number: 123456, timestamp: 1234 })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({ mean: 60, stdDev: 15 })

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        expect.includes('⚠️ There are unhandled implementation changes. ⚠️'),
      )
    })
  })

  describe(AnomalyNotifier.prototype.anomalyOngoing.name, () => {
    it('notifies about ongoing anomaly', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
        getByRelatedEntityId: mockFn().resolvesTo([]),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({
        mean: 60,
        stdDev: 15,
      })

      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>({
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
        start: lastRecord.timestamp,
      })

      await notifier.anomalyOngoing(
        ongoingAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalled()

      expect(notificationsRepository.insertMany).toHaveBeenCalledWith([
        {
          id: messageId,
          channel: 'discord',
          type: 'anomaly-detected',
          relatedEntityId: `${ongoingAnomaly.projectId}-${ongoingAnomaly.subtype}-${ongoingAnomaly.start}`,
          timestamp: block.timestamp,
        },
      ])
    })

    it('does not notify if duration less than configured', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = mockObject<Block>()
      const lastRecord = mockObject<RealTimeLivenessRecord>()
      const stats = mockObject<AnomalyStatsRecord>()
      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>()

      await notifier.anomalyOngoing(
        ongoingAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()

      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })

    it('does not notify if already notified', async () => {
      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: UnixTime.now(),
      })

      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
        getByRelatedEntityId: mockFn().resolvesTo([
          {
            id: '123',
            channel: 'discord',
            type: 'anomaly-detected',
            relatedEntityId: `${projectId}-${subtype}-${block.timestamp}`,
            timestamp: UnixTime.now(),
          },
        ]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const lastRecord = mockObject<RealTimeLivenessRecord>()
      const stats = mockObject<AnomalyStatsRecord>()
      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>()

      await notifier.anomalyOngoing(
        ongoingAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()

      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })

    it('does notify if duration less than configured, but z-score is over 100', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
        getByRelatedEntityId: mockFn().resolvesTo([]),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        60,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })
      const stats = mockObject<AnomalyStatsRecord>({
        mean: 60,
        stdDev: 15,
      })

      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>({
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
        start: lastRecord.timestamp,
      })

      await notifier.anomalyOngoing(
        ongoingAnomaly,
        10,
        101,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalled()

      expect(notificationsRepository.insertMany).toHaveBeenCalledWith([
        {
          id: messageId,
          channel: 'discord',
          type: 'anomaly-detected',
          relatedEntityId: `${ongoingAnomaly.projectId}-${ongoingAnomaly.subtype}-${ongoingAnomaly.start}`,
          timestamp: block.timestamp,
        },
      ])
    })
  })

  describe(AnomalyNotifier.prototype.anomalyRecovered.name, () => {
    it('notifies about recovered anomaly', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
        getByRelatedEntityId: mockFn().resolvesTo([
          {
            id: '123',
            type: 'anomaly-detected',
          },
        ]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = mockFn().resolvesTo(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = mockObject<Block>({
        number: 123456,
        timestamp: 1234,
      })
      const lastRecord = mockObject<RealTimeLivenessRecord>({
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      })

      const ongoingAnomaly: RealTimeAnomalyRecord = {
        start: lastRecord.timestamp,
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
      }

      await notifier.anomalyRecovered(ongoingAnomaly, 60, block, lastRecord)

      expect(mockSendDiscordNotification).toHaveBeenCalled()

      expect(notificationsRepository.insertMany).toHaveBeenCalledWith([
        {
          id: messageId,
          channel: 'discord',
          type: 'anomaly-recovered',
          relatedEntityId: `${ongoingAnomaly.projectId}-${ongoingAnomaly.subtype}-${ongoingAnomaly.start}`,
          timestamp: block.timestamp,
        },
      ])
    })

    it('does not notify if we did not send a notification about the detected anomaly', async () => {
      const notificationsRepository = mockObject<Database['notifications']>({
        insertMany: mockFn().resolvesTo(undefined),
        getByRelatedEntityId: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = mockObject<Block>()
      const lastRecord = mockObject<RealTimeLivenessRecord>()
      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>({
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        start: 1234,
      })

      await notifier.anomalyRecovered(ongoingAnomaly, 60, block, lastRecord)

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()

      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe(AnomalyNotifier.prototype.dailyReport.name, () => {
    it('sends daily report', async () => {
      const realTimeAnomaliesRepository = mockObject<
        Database['realTimeAnomalies']
      >({
        getOngoingAnomalies: mockFn().resolvesTo([
          {
            projectId: 'project-1',
            subtype: 'batchSubmissions',
            status: 'ongoing',
            isApproved: false,
            start: UnixTime.now(),
          },
        ] as RealTimeAnomalyRecord[]),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          realTimeAnomalies: realTimeAnomaliesRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      await notifier.dailyReport()

      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        `# Daily report @ ${UnixTime.toYYYYMMDD(UnixTime.now())}\n` +
          '### Ongoing anomalies:\n' +
          '```|  Duration | ProjectId |          Subtype |     Approval | Implementation Change |\n' +
          '|-----------|-----------|------------------|--------------|-----------------------|\n' +
          '| 0 seconds | project-1 | batchSubmissions | not approved |                     - |```',
      )
    })

    it('sends daily report with implementation change warning', async () => {
      const address = EthereumAddress.random()
      const realTimeAnomaliesRepository = mockObject<
        Database['realTimeAnomalies']
      >({
        getOngoingAnomalies: mockFn().resolvesTo([
          {
            projectId: 'project-1',
            subtype: 'batchSubmissions',
            status: 'ongoing',
            isApproved: false,
            start: UnixTime.now(),
          },
        ] as RealTimeAnomalyRecord[]),
      })
      const updateDiffRepository = mockObject<Database['updateDiff']>({
        getAll: mockFn().resolvesTo([
          mockUpdateDiff('project-1', `eth:${address.toString()}`),
        ]),
      })

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          realTimeAnomalies: realTimeAnomaliesRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([
          mockTrackedTxProject('project-1', [
            {
              type: 'liveness',
              subtype: 'batchSubmissions',
              params: {
                formula: 'functionCall',
                address,
                selector: '0x1234',
                signature: 'function submit()',
              },
            },
          ]),
        ]),
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      await notifier.dailyReport()

      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        `# Daily report @ ${UnixTime.toYYYYMMDD(UnixTime.now())}\n` +
          '### Ongoing anomalies:\n' +
          '```|  Duration | ProjectId |          Subtype |     Approval | Implementation Change |\n' +
          '|-----------|-----------|------------------|--------------|-----------------------|\n' +
          '| 0 seconds | project-1 | batchSubmissions | not approved |             ⚠️ yes ⚠️ |```',
      )
    })
  })
})

function mockTrackedTxsConfig(projects: TrackedTxProject[]): TrackedTxsConfig {
  return mockObject<TrackedTxsConfig>({
    projects,
  })
}

function mockTrackedTxProject(
  projectId: string,
  configurations: {
    type: 'liveness' | 'l2costs'
    subtype: string
    params: {
      formula: string
      address?: EthereumAddress
      selector?: string
      signature?: `function ${string}`
      from?: EthereumAddress
      to?: EthereumAddress
    }
  }[],
): TrackedTxProject {
  return mockObject<TrackedTxProject>({
    id: projectId as any,
    configurations: configurations.map((config) => ({
      id: `${projectId}-${config.subtype}`,
      projectId: projectId as any,
      sinceTimestamp: 0,
      type: config.type,
      subtype: config.subtype as any,
      params: config.params as any,
    })),
  })
}

function mockUpdateDiff(projectId: string, address: string): UpdateDiffRecord {
  return {
    type: 'implementationChange',
    address,
    projectId,
    timestamp: UnixTime.now(),
    diffBaseTimestamp: 0,
    diffHeadTimestamp: 0,
  }
}
