import type { HttpClient } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { DiscordClient } from './DiscordClient'

describe(DiscordClient.name, () => {
  const config = {
    token: '<discord-token>',
    publicChannelId: '<channel-id>',
    internalChannelId: '<channel-id-2>',
    callsPerMinute: 3000,
  }
  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('sends to public channel', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${config.publicChannelId}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('', 'PUBLIC')
    })

    it('sends to internal channel', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${config.internalChannelId}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('', 'INTERNAL')
    })

    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${config.publicChannelId}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('', 'PUBLIC')
    })

    it('includes message in the body', async () => {
      const message = 'Example message'
      const httpClient = mockObject<HttpClient>({
        async fetch(_, init) {
          expect(init?.body).toEqual(JSON.stringify({ content: message }))
          return new Response('{}', { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage(message, 'PUBLIC')
    })

    it('adds headers', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(_, init) {
          expect(init?.headers).toEqual({
            Authorization: `Bot ${config.token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          })
          return new Response('{}', { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('', 'PUBLIC')
    })

    it('throws when message is too long', async () => {
      const httpClient = mockObject<HttpClient>({})
      const discord = new DiscordClient(httpClient, config)

      const message = 'a'.repeat(2001)
      await expect(discord.sendMessage(message, 'PUBLIC')).toBeRejectedWith(
        'Discord error: Message size exceeded (2000 characters)',
      )
    })
  })
})
