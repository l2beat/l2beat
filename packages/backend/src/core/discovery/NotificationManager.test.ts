import { Logger } from '@l2beat/shared'
import { expect, mockObject } from 'earl'

import { DiscordClient } from '../../peripherals/discord/DiscordClient'
import { NotificationManager } from './NotificationManager'

describe(NotificationManager.prototype.notify.name, () => {
  it('sends discord messages', async () => {
    const discordClient = mockObject<DiscordClient>({
      sendMessage: async () => {},
    })

    const updateMonitor = new NotificationManager(discordClient, Logger.SILENT)

    const messages = ['a', 'b', 'c']

    await updateMonitor.notify(messages, { internalOnly: true })

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
