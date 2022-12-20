import { HttpClient } from '@l2beat/common'

import { DiscordClient } from './DiscordClient'

const DISCORD_TOKEN =
  'MTA1NDM5NzcyMTcwMTc5Nzk2OQ.GpKDU-.gnofHu8RO4bYZWquHCuTzV80SfSIj8PCXW47HQ'

const CHANNEL_ID = '932763329498337374'

describe(DiscordClient.name, () => {
  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('is called', async () => {
      const http = new HttpClient()
      const discord = new DiscordClient(http, DISCORD_TOKEN, CHANNEL_ID)

      await discord.sendMessage("test message")
    })
  })
})
