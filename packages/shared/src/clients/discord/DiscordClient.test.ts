import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from '../http/HttpClient'
import { DiscordClient } from './DiscordClient'

describe(DiscordClient.name, () => {
  const webhookUrl = 'https://discord.com/api/webhooks/123/token'

  describe(DiscordClient.prototype.sendMessage.name, () => {
    it('sends to the configured webhook', async () => {
      const httpClient = {
        fetchRaw: vi.fn(async (url) => {
          expect(url).toStrictEqual(`${webhookUrl}?wait=true`)
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        }),
      } as unknown as HttpClient
      const discord = mockClient(webhookUrl, httpClient)

      await discord.sendMessage('')
    })

    it('includes message in the body', async () => {
      const message = 'Example message'
      const httpClient = {
        fetchRaw: vi.fn(async (_, init) => {
          expect(init?.body).toStrictEqual(JSON.stringify({ content: message }))
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        }),
      } as unknown as HttpClient
      const discord = mockClient(webhookUrl, httpClient)

      await discord.sendMessage(message)
    })

    it('adds headers', async () => {
      const httpClient = {
        fetchRaw: vi.fn(async (_, init) => {
          expect(init?.headers).toStrictEqual({
            'Content-Type': 'application/json; charset=UTF-8',
          })
          return new Response(JSON.stringify({ id: '1' }), { status: 200 })
        }),
      } as unknown as HttpClient
      const discord = mockClient(webhookUrl, httpClient)

      await discord.sendMessage('')
    })

    it('throws when message is too long', async () => {
      const discord = new DiscordClient(webhookUrl)

      const message = 'a'.repeat(2001)
      await expect(discord.sendMessage(message)).rejects.toThrow(
        'Discord error: Message size exceeded (2000 characters)',
      )
    })

    it('throws when discord returns an error', async () => {
      const httpClient = {
        fetchRaw: vi.fn(async () => {
          return new Response('bad request', {
            status: 400,
            statusText: 'Bad Request',
          })
        }),
      } as unknown as HttpClient
      const discord = mockClient('', httpClient)

      await expect(discord.sendMessage('message')).rejects.toThrow(
        'HTTP error: 400 Bad Request',
      )
    })
  })
})

function mockClient(webhookUrl: string, httpClient: HttpClient): DiscordClient {
  const client = new DiscordClient(webhookUrl) as any
  client.httpClient = httpClient
  return client as DiscordClient
}
