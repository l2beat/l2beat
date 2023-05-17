import { Logger, UnixTime } from '@l2beat/shared'
import { expect, mockObject } from 'earl'

import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { NotificationManager } from './NotificationManager'

describe(NotificationManager.name, () => {
  describe(NotificationManager.prototype.notify.name, () => {
    it('sends discord messages', async () => {
      const discordClient = mockObject<DiscordClient>({
        sendMessage: async () => {},
      })

      const notificationManager = new NotificationManager(
        discordClient,
        Logger.SILENT,
      )

      const messages = ['a', 'b', 'c']

      await notificationManager.notify(messages, { internalOnly: true })

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(3)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        'a',
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        2,
        'b',
        'INTERNAL',
      )
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        3,
        'c',
        'INTERNAL',
      )
    })
  })

  describe(NotificationManager.prototype.notUpdatedProjects.name, () => {
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

      await notificationManager.notUpdatedProjects(
        notUpdatedProjects,
        timestamp,
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(1)
      expect(discordClient.sendMessage).toHaveBeenNthCalledWith(
        1,
        '```Daily bot report @ 2023-05-17```\n:x: project-a\n\n:x: project-b',
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

      await notificationManager.notUpdatedProjects(
        notUpdatedProjects,
        timestamp,
      )

      expect(discordClient.sendMessage).toHaveBeenCalledTimes(0)
    })
  })
})
