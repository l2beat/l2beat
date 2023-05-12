import { HttpClient } from '@l2beat/shared'
import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'

import { DiscordClient } from './DiscordClient'

const DISCORD_TOKEN = '<discord-token>'
const PUBLIC_CHANNEL = '<channel-id>'
const INTERNAL_CHANNEL = '<channel-id-2>'

describe(DiscordClient.name, () => {
  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('sends to public channel', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${PUBLIC_CHANNEL}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        INTERNAL_CHANNEL,
      )

      await discord.sendMessage('', 'PUBLIC')
    })

    it('sends to internal channel', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${INTERNAL_CHANNEL}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        INTERNAL_CHANNEL,
      )

      await discord.sendMessage('', 'INTERNAL')
    })

    it('constructs a correct url', async () => {
      const httpClient = mockObject<HttpClient>({
        fetch: async (url) => {
          expect(url).toEqual(
            `https://discord.com/api/v10/channels/${PUBLIC_CHANNEL}/messages`,
          )
          return new Response(JSON.stringify({ status: '1', message: 'OK' }))
        },
      })

      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        INTERNAL_CHANNEL,
      )

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
      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        PUBLIC_CHANNEL,
      )

      await discord.sendMessage(message, 'PUBLIC')
    })

    it('adds headers', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetch(_, init) {
          expect(init?.headers).toEqual({
            Authorization: `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
          })
          return new Response('{}', { status: 200 })
        },
      })
      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        PUBLIC_CHANNEL,
      )

      await discord.sendMessage('', 'PUBLIC')
    })

    it('throws when message is too long', async () => {
      const httpClient = mockObject<HttpClient>({})
      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        PUBLIC_CHANNEL,
      )

      const message = 'a'.repeat(2001)
      await expect(discord.sendMessage(message, 'PUBLIC')).toBeRejectedWith(
        `Discord error: Message size exceeded (2000 characters)`,
      )
    })

    it('throws error', async () => {
      const error = JSON.stringify({ message: 'error', code: '0001' })

      const httpClient = mockObject<HttpClient>({
        fetch: async () => new Response(error, { status: 400 }),
      })
      const discord = new DiscordClient(
        httpClient,
        DISCORD_TOKEN,
        PUBLIC_CHANNEL,
        INTERNAL_CHANNEL,
      )

      await expect(discord.sendMessage('', 'PUBLIC')).toBeRejectedWith(
        `Discord error: ${error}`,
      )
    })
  })
})
