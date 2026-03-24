import { RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '../http/HttpClient'

export const DISCORD_MAX_MESSAGE_LENGTH = 2000

interface DiscordClientConfig {
  readonly callsPerMinute?: number
  readonly webhookUrl?: string
}

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: DiscordClientConfig = {},
  ) {
    if (config.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: config.callsPerMinute,
      })
      this.sendMessage = rateLimiter.wrap(this.sendMessage.bind(this))
    }
  }

  async sendMessage(message: string, webhookUrl?: string) {
    const url = webhookUrl ?? this.config.webhookUrl
    if (!url) {
      throw new Error('Discord error: Webhook URL not provided')
    }

    if (message.length > DISCORD_MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }

    const urlWithWait = `${url}?wait=true`

    const res = await this.httpClient.fetchRaw(urlWithWait, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }

    const body = (await res.json()) as { id: string }
    return body.id
  }

  async deleteMessage(messageId: string, webhookUrl?: string) {
    const url = webhookUrl ?? this.config.webhookUrl
    if (!url) {
      throw new Error('Discord error: Webhook URL not provided')
    }

    const deleteUrl = `${url}/messages/${messageId}`
    const res = await this.httpClient.fetchRaw(deleteUrl, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }
  }
}
