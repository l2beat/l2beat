import { HttpClient, mock } from '@l2beat/shared'
import { expect } from 'earljs'
import { Response } from 'node-fetch'

import { DiscordClient } from './DiscordClient'

const DISCORD_TOKEN = '<discord-token>'
const CHANNEL_ID = '<channel-id>'

describe(DiscordClient.name, () => {
  describe(DiscordClient.prototype.query.name, () => {
    it('constructs a correct url', async () => {
      const httpClient = mock<HttpClient>({
        async fetch(url) {
          expect(url).toEqual(`https://discord.com/api/v10/foo/bar`)
          return new Response('{}', { status: 200 })
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
          return new Response('{}', { status: 200 })
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
          return new Response('{}', { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.query('', { method: 'POST', body: '' })
    })

    it('throws an error', async () => {
      const error = JSON.stringify({ message: 'error', code: '0001' })

      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(error, { status: 400 })
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await expect(discord.query('')).toBeRejected(`Discord error: ${error}`)
    })

    it('return response JSON', async () => {
      const data = { message: 'OK' }

      const httpClient = mock<HttpClient>({
        async fetch() {
          return new Response(JSON.stringify(data), { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      const result = await discord.query('')

      expect(result).toEqual(data)
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

    it('includes message in the body', async () => {
      const message = 'Example message'
      const httpClient = mock<HttpClient>({
        async fetch(_, init) {
          expect(init?.body).toEqual(JSON.stringify({ content: message }))
          return new Response('{}', { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      await discord.sendMessage(message)
    })

    it('throws when message is too long', async () => {
      const httpClient = mock<HttpClient>({})
      const discord = new DiscordClient(httpClient, DISCORD_TOKEN, CHANNEL_ID)

      const message = 'a'.repeat(2001)
      await expect(discord.sendMessage(message)).toBeRejected(
        `Discord error: Message size exceeded (2000 characters)`,
      )
    })
  })
})
