import { DiscoveryDiff } from '@l2beat/discovery'
import { EthereumAddress, Logger, UnixTime } from '@l2beat/shared'
import { expect, mockObject } from 'earl'

import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { NotificationManager } from './NotificationManager'

describe(NotificationManager.name, () => {
  describe(NotificationManager.prototype.handleDiff.name, () => {
    it('sends notifications about the changes', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const notificationManager = new NotificationManager(
        discordClient,
        Logger.SILENT,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [{ key: 'A', before: '1', after: '2' }],
        },
      ]

      await notificationManager.handleDiff(project, dependents, changes)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(2)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        '***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nA\n- 1\n+ 2\n\n```',
        'PUBLIC',
      )
    })

    it('sends errors only to internal channel', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const notificationManager = new NotificationManager(
        discordClient,
        Logger.SILENT,
      )

      const project = 'project-a'
      const dependents: string[] = []
      const address = EthereumAddress.random()
      const changes: DiscoveryDiff[] = [
        {
          name: 'Contract',
          address,
          diff: [{ key: 'errors', after: 'Execution reverted' }],
        },
      ]

      await notificationManager.handleDiff(project, dependents, changes)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '***project-a*** | detected changes```diff\nContract | ' +
          address.toString() +
          '\n\nerrors\n+ Execution reverted\n\n```',
        'INTERNAL',
      )
    })
  })

  describe(NotificationManager.prototype.handleUnresolved.name, () => {
    it('sends daily reminder at 9am CET', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const notificationManager = new NotificationManager(
        discordClient,
        Logger.SILENT,
      )

      const notUpdatedProjects = ['project-a', 'project-b']
      const timestamp = UnixTime.now().toStartOf('day').add(6, 'hours')

      await notificationManager.handleUnresolved(notUpdatedProjects, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '```Daily bot report @ ' +
          timestamp.toYYYYMMDD() +
          '```\n:x: project-a\n\n:x: project-b',
        'INTERNAL',
      )
    })

    it('does not send daily reminder at other hour', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const notificationManager = new NotificationManager(
        discordClient,
        Logger.SILENT,
      )

      const notUpdatedProjects = ['project-a', 'project-b']
      const timestamp = UnixTime.now().toStartOf('day').add(1, 'hours')

      await notificationManager.handleUnresolved(notUpdatedProjects, timestamp)

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })
  })
})
