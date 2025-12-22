import { WebhookClient } from 'discord.js'

const MAX_MESSAGE_LENGTH = 2000
const USERNAME = 'L2BEAT'

// maciekzygmunt: this client should be rewritten to not use discord.js, also it should be moved to shared module but can't as uops-dashboard imports it from barrel file and it breaks at build time as it depends on node zlib-sync
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
