import { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  RealTimeAnomalyRecord,
  RealTimeLivenessRecord,
  UpdateDiffRecord,
} from '@l2beat/database'
import type { DiscordClient } from '@l2beat/shared'
import { type Block, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { TrackedTxProject, TrackedTxsConfig } from '../../config/Config'
import { mockDatabase } from '../../test/database'
import type { Clock } from '../../tools/Clock'
import { AnomalyNotifier } from './AnomalyNotifier'

describe(AnomalyNotifier.name, () => {
  describe(AnomalyNotifier.prototype.anomalyDetected.name, () => {
    it('notifies about new anomaly', async () => {
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi.fn().mockResolvedValue([]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = {
        mean: 60,
        stdDev: 15,
      } as unknown as AnomalyStatsRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = {} as unknown as Block
      const lastRecord = {} as unknown as RealTimeLivenessRecord
      const stats = {} as unknown as AnomalyStatsRecord
      const newAnomaly = {} as unknown as RealTimeAnomalyRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi.fn().mockResolvedValue([]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        60,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = {
        mean: 60,
        stdDev: 15,
      } as unknown as AnomalyStatsRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi
          .fn()
          .mockResolvedValue([
            mockUpdateDiff('project-1', `eth:${address.toString()}`),
          ]),
      } as unknown as Database['updateDiff']

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
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
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = {
        mean: 60,
        stdDev: 15,
      } as unknown as AnomalyStatsRecord

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
        expect.stringContaining(
          '⚠️ There are unhandled implementation changes. ⚠️',
        ),
      )
    })

    it('includes warning when there are implementation changes for transfer config (from)', async () => {
      const fromAddress = EthereumAddress.random()
      const toAddress = EthereumAddress.random()
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi
          .fn()
          .mockResolvedValue([
            mockUpdateDiff('project-1', `eth:${fromAddress.toString()}`),
          ]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
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
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const newAnomaly: RealTimeAnomalyRecord = {
        start: 5678,
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        status: 'ongoing',
        isApproved: false,
      }

      const block = { number: 123456, timestamp: 1234 } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = { mean: 60, stdDev: 15 } as unknown as AnomalyStatsRecord

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        expect.stringContaining(
          '⚠️ There are unhandled implementation changes. ⚠️',
        ),
      )
    })

    it('includes warning when there are implementation changes for transfer config (to)', async () => {
      const toAddress = EthereumAddress.random()
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi
          .fn()
          .mockResolvedValue([
            mockUpdateDiff('project-1', `eth:${toAddress.toString()}`),
          ]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
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
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const newAnomaly: RealTimeAnomalyRecord = {
        start: 5678,
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        status: 'ongoing',
        isApproved: false,
      }

      const block = { number: 123456, timestamp: 1234 } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = { mean: 60, stdDev: 15 } as unknown as AnomalyStatsRecord

      await notifier.anomalyDetected(
        newAnomaly,
        60,
        15,
        block,
        lastRecord,
        stats,
      )

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        expect.stringContaining(
          '⚠️ There are unhandled implementation changes. ⚠️',
        ),
      )
    })
  })

  describe(AnomalyNotifier.prototype.anomalyOngoing.name, () => {
    it('notifies about ongoing anomaly', async () => {
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([]),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi.fn().mockResolvedValue([]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = {
        mean: 60,
        stdDev: 15,
      } as unknown as AnomalyStatsRecord

      const ongoingAnomaly = {
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
        start: lastRecord.timestamp,
      } as unknown as RealTimeAnomalyRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = {} as unknown as Block
      const lastRecord = {} as unknown as RealTimeLivenessRecord
      const stats = {} as unknown as AnomalyStatsRecord
      const ongoingAnomaly = {} as unknown as RealTimeAnomalyRecord

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
      const block = {
        number: 123456,
        timestamp: UnixTime.now(),
      } as unknown as Block

      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([
          {
            id: '123',
            channel: 'discord',
            type: 'anomaly-detected',
            relatedEntityId: `${projectId}-${subtype}-${block.timestamp}`,
            timestamp: UnixTime.now(),
          },
        ]),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const lastRecord = {} as unknown as RealTimeLivenessRecord
      const stats = {} as unknown as AnomalyStatsRecord
      const ongoingAnomaly = {} as unknown as RealTimeAnomalyRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([]),
      } as unknown as Database['notifications']
      const updateDiffRepository = {
        getAll: vi.fn().mockResolvedValue([]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
          updateDiff: updateDiffRepository,
        }),
        60,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord
      const stats = {
        mean: 60,
        stdDev: 15,
      } as unknown as AnomalyStatsRecord

      const ongoingAnomaly = {
        projectId,
        subtype,
        status: 'ongoing',
        isApproved: false,
        start: lastRecord.timestamp,
      } as unknown as RealTimeAnomalyRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([
          {
            id: '123',
            type: 'anomaly-detected',
          },
        ]),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const projectId = 'project-1'
      const subtype = 'batchSubmissions'
      const block = {
        number: 123456,
        timestamp: 1234,
      } as unknown as Block
      const lastRecord = {
        txHash: '0x1234567890abcdef',
        timestamp: 5678,
      } as unknown as RealTimeLivenessRecord

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([]),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          notifications: notificationsRepository,
        }),
        100,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = {} as unknown as Block
      const lastRecord = {} as unknown as RealTimeLivenessRecord
      const ongoingAnomaly = {
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        start: 1234,
      } as unknown as RealTimeAnomalyRecord

      await notifier.anomalyRecovered(ongoingAnomaly, 60, block, lastRecord)

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()

      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe(AnomalyNotifier.prototype.anomalyAutoRecovered.name, () => {
    it('notifies about auto-recovered anomaly', async () => {
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi
          .fn()
          .mockResolvedValue([{ id: '123', type: 'anomaly-detected' }]),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({ notifications: notificationsRepository }),
        0,
        mockTrackedTxsConfig([]),
      )

      const messageId = '1234567890'
      const mockSendDiscordNotification = vi.fn().mockResolvedValue(messageId)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const ongoingAnomaly: RealTimeAnomalyRecord = {
        start: 5678,
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        status: 'recovered',
        isApproved: false,
      }
      const block = { number: 123456, timestamp: 1234 } as unknown as Block

      await notifier.anomalyAutoRecovered(ongoingAnomaly, block)

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
      const notificationsRepository = {
        insertMany: vi.fn().mockResolvedValue(undefined),
        getByRelatedEntityId: vi.fn().mockResolvedValue([]),
      } as unknown as Database['notifications']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({ notifications: notificationsRepository }),
        0,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const ongoingAnomaly = {
        projectId: 'project-1',
        subtype: 'batchSubmissions',
        start: 1234,
      } as unknown as RealTimeAnomalyRecord
      const block = { number: 123456, timestamp: 1234 } as unknown as Block

      await notifier.anomalyAutoRecovered(ongoingAnomaly, block)

      expect(mockSendDiscordNotification).not.toHaveBeenCalled()
      expect(notificationsRepository.insertMany).not.toHaveBeenCalled()
    })
  })

  describe(AnomalyNotifier.prototype.dailyReport.name, () => {
    it('sends daily report', async () => {
      const realTimeAnomaliesRepository = {
        getOngoingAnomalies: vi.fn().mockResolvedValue([
          {
            projectId: 'project-1',
            subtype: 'batchSubmissions',
            status: 'ongoing',
            isApproved: false,
            start: UnixTime.now(),
          },
        ] as RealTimeAnomalyRecord[]),
      } as unknown as Database['realTimeAnomalies']
      const updateDiffRepository = {
        getAll: vi.fn().mockResolvedValue([]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
        mockDatabase({
          realTimeAnomalies: realTimeAnomaliesRepository,
          updateDiff: updateDiffRepository,
        }),
        0,
        mockTrackedTxsConfig([]),
      )

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
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
      const realTimeAnomaliesRepository = {
        getOngoingAnomalies: vi.fn().mockResolvedValue([
          {
            projectId: 'project-1',
            subtype: 'batchSubmissions',
            status: 'ongoing',
            isApproved: false,
            start: UnixTime.now(),
          },
        ] as RealTimeAnomalyRecord[]),
      } as unknown as Database['realTimeAnomalies']
      const updateDiffRepository = {
        getAll: vi
          .fn()
          .mockResolvedValue([
            mockUpdateDiff('project-1', `eth:${address.toString()}`),
          ]),
      } as unknown as Database['updateDiff']

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        {} as unknown as Clock,
        {} as unknown as DiscordClient,
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

      const mockSendDiscordNotification = vi.fn().mockResolvedValue(undefined)
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
  return {
    projects,
  } as unknown as TrackedTxsConfig
}

function mockTrackedTxProject(
  projectId: string,
  configurations: {
    type: 'liveness'
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
  return {
    id: projectId as any,
    configurations: configurations.map((config) => ({
      id: `${projectId}-${config.subtype}`,
      projectId: projectId as any,
      sinceTimestamp: 0,
      type: config.type,
      subtype: config.subtype as any,
      params: config.params as any,
    })),
  } as unknown as TrackedTxProject
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
