import { HttpClient } from '@l2beat/common'

import { DiscordClient } from './DiscordClient'

describe(DiscordClient.name, () => {
  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('is called', async () => {
      const http = new HttpClient()
      const discord = new DiscordClient(http)

      await discord.createCommand()
    })
  })
})
