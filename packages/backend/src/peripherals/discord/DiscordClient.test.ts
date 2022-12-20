import { HttpClient, mock } from '@l2beat/common'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { DiscordClient } from './DiscordClient'

const DISCORD_TOKEN =
  'MTA1NDM5NzcyMTcwMTc5Nzk2OQ.GpKDU-.gnofHu8RO4bYZWquHCuTzV80SfSIj8PCXW47HQ'

const CHANNEL_ID = '932763329498337374'

describe(DiscordClient.name, () => {
  describe(DiscordClient.prototype.query.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            `https://discord.com/api/v10/foo/bar`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.query('/foo/bar', {})
    })
  })


  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.sendMessage('')
    })
  })
})
