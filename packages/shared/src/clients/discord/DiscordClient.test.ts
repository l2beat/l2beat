import { expect, mockObject } from 'earl'
import { Response } from 'node-fetch'
import type { HttpClient } from '../http/HttpClient'
import { DiscordClient } from './DiscordClient'

describe(DiscordClient.name, () => {
  const config = {
    callsPerMinute: 3000,
    webhookUrl: 'https://discord.com/api/webhooks/123/token',
  }

  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('sends to the configured webhook', async () => {
      const httpClient = mockObject<HttpClient>({
        fetchRaw: async (url) => {
          expect(url).toEqual(
            `${config.webhookUrl}?wait=true`,
          )
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        },
      })

      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('')
    })

    it('accepts an explicit webhook url override', async () => {
      const webhookUrl = 'https://discord.com/api/webhooks/456/token'
      const httpClient = mockObject<HttpClient>({
        fetchRaw: async (url) => {
          expect(url).toEqual(`${webhookUrl}?wait=true`)
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        },
      })

      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('', webhookUrl)
    })

    it('includes message in the body', async () => {
      const message = 'Example message'
      const httpClient = mockObject<HttpClient>({
        async fetchRaw(_, init) {
          expect(init?.body).toEqual(JSON.stringify({ content: message }))
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage(message)
    })

    it('adds headers', async () => {
      const httpClient = mockObject<HttpClient>({
        async fetchRaw(_, init) {
          expect(init?.headers).toEqual({
            'Content-Type': 'application/json; charset=UTF-8',
          })
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        },
      })
      const discord = new DiscordClient(httpClient, config)

      await discord.sendMessage('')
    })

    it('throws when message is too long', async () => {
      const httpClient = mockObject<HttpClient>({})
      const discord = new DiscordClient(httpClient, config)

      const message = 'a'.repeat(2001)
      await expect(discord.sendMessage(message)).toBeRejectedWith(
        'Discord error: Message size exceeded (2000 characters)',
      )
    })

    it('throws when webhook url is missing', async () => {
      const httpClient = mockObject<HttpClient>({})
      const discord = new DiscordClient(httpClient)

      await expect(discord.sendMessage('message')).toBeRejectedWith(
        'Discord error: Webhook URL not provided',
      )
    })
  })
})
