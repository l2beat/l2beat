import { WebhookClient } from 'discord.js'

const MAX_MESSAGE_LENGTH = 2000
const USERNAME = 'L2BEAT'

export class DiscordWebhookClient {
  constructor(
    webhookUrl: string,
    private readonly webhookClient = new WebhookClient({ url: webhookUrl }),
  ) {}

  async sendMessage(content: string): Promise<string> {
    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }

    const message = await this.webhookClient.send({
      content,
      username: USERNAME,
    })

    return message.id
  }

  async deleteMessage(messageId: string) {
    await this.webhookClient.deleteMessage(messageId)
  }
}
