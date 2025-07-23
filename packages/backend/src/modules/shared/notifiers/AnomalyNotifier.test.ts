import { Logger } from '@l2beat/backend-tools'
import type {
  AnomalyStatsRecord,
  Database,
  RealTimeAnomalyRecord,
  RealTimeLivenessRecord,
} from '@l2beat/database'
import { type Block, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscordWebhookClient } from '../../../peripherals/discord/DiscordWebhookClient'
import { mockDatabase } from '../../../test/database'
import type { Clock } from '../../../tools/Clock'
import { AnomalyNotifier } from './AnomalyNotifier'

describe(AnomalyNotifier.name, () => {
  describe(AnomalyNotifier.prototype.anomalyDetected.name, () => {
    it('notifies about new anomaly', async () => {
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
        0,
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

    it('does not notify if duration lest than configured', async () => {
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
  })

  describe(AnomalyNotifier.prototype.anomalyOngoing.name, () => {
    it('notifies about ongoing anomaly', async () => {
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
        0,
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

    it('does not notify if duration lest than configured', async () => {
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
  })

  describe(AnomalyNotifier.prototype.anomalyRecovered.name, () => {
    it('notifies about recovered anomaly', async () => {
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
        0,
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

    it('does not notify if duration lest than configured', async () => {
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
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      const block = mockObject<Block>()
      const lastRecord = mockObject<RealTimeLivenessRecord>()
      const ongoingAnomaly = mockObject<RealTimeAnomalyRecord>()

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

      const notifier = new AnomalyNotifier(
        Logger.SILENT,
        mockObject<Clock>(),
        mockObject<DiscordWebhookClient>(),
        mockDatabase({
          realTimeAnomalies: realTimeAnomaliesRepository,
        }),
        0,
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      await notifier.dailyReport()

      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        `# Daily report @ ${UnixTime.toYYYYMMDD(UnixTime.now())}\n` +
          '### Ongoing anomalies:\n' +
          '```|  Duration | ProjectId |          Subtype |     Approval |\n' +
          '|-----------|-----------|------------------|--------------|\n' +
          '| 0 seconds | project-1 | batchSubmissions | not approved |```',
      )
    })
  })
})
