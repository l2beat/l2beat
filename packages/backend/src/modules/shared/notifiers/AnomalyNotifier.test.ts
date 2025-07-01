import { Logger } from '@l2beat/backend-tools'
import type { Database, RealTimeAnomalyRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { DiscordWebhookClient } from '../../../peripherals/discord/DiscordWebhookClient'
import { mockDatabase } from '../../../test/database'
import type { Clock } from '../../../tools/Clock'
import { AnomalyNotifier } from './AnomalyNotifier'

describe(AnomalyNotifier.name, () => {
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
      )

      const mockSendDiscordNotification = mockFn().resolvesTo(undefined)
      notifier.sendDiscordNotification = mockSendDiscordNotification

      await notifier.dailyReport()

      expect(realTimeAnomaliesRepository.getOngoingAnomalies).toHaveBeenCalled()

      expect(mockSendDiscordNotification).toHaveBeenCalledWith(
        '# Daily report @ 2025-07-01\n' +
          '### Ongoing anomalies:\n' +
          '```|  Duration | ProjectId |          Subtype |  Status |\n' +
          '|-----------|-----------|------------------|---------|\n' +
          '| 0 seconds | project-1 | batchSubmissions | ongoing |```',
      )
    })
  })
})
