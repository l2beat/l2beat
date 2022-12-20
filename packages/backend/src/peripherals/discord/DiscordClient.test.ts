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
          expect(url).toEqual(`https://discord.com/api/v10/foo/bar`)
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.query('/foo/bar')
    })

    it('adds headers', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(_, init) {
          expect(init?.headers).toEqual({
            Authorization: `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
          })
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.query('')
    })

    it('adds options', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(_, init) {
          expect(init?.method).toEqual('POST')
          expect(init?.body).toEqual('')
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.query('', { method: 'POST', body: '' })
    })

    it('throws an error', async () => {
      const error = JSON.stringify({ message: 'error', code: '0001' })

      const httpClient = mock<HttpClient>({
        async fetch() {
          throw new Error(error)
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await expect(discord.query('')).toBeRejected(error)
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
