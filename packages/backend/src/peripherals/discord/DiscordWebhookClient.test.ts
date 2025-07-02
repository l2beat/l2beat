import type { WebhookClient } from 'discord.js'
import { expect, mockFn, mockObject } from 'earl'
import { DiscordWebhookClient } from './DiscordWebhookClient'

describe(DiscordWebhookClient.name, () => {
  describe(DiscordWebhookClient.prototype.sendMessage.name, () => {
    it('sends message', async () => {
      const mockWebhookClient = mockObject<WebhookClient>({
        send: mockFn().resolvesTo(undefined),
      })

      const message = 'Hello, Discord!'
      const client = new DiscordWebhookClient('url', mockWebhookClient)
      await client.sendMessage(message)

      expect(mockWebhookClient.send).toHaveBeenCalledWith({
        username: 'L2BEAT',
        content: message,
      })
    })

    it('throws when message is too long', async () => {
      const client = new DiscordWebhookClient(
        'url',
        mockObject<WebhookClient>(),
      )
      const message = 'a'.repeat(2001)

      await expect(client.sendMessage(message)).toBeRejectedWith(
        `Discord error: Message size exceeded (2000 characters)`,
      )
    })
  })

  describe(DiscordWebhookClient.prototype.deleteMessage.name, () => {
    it('deletes message', async () => {
      const mockWebhookClient = mockObject<WebhookClient>({
        send: mockFn().resolvesTo(undefined),
        deleteMessage: mockFn().resolvesTo(undefined),
      })

      const messageId = '1234'
      const client = new DiscordWebhookClient('url', mockWebhookClient)
      await client.deleteMessage(messageId)

      expect(mockWebhookClient.deleteMessage).toHaveBeenCalledWith(messageId)
    })
  })
})
