import { RateLimiter } from '@l2beat/backend-tools'
import { HttpClient } from '../http/HttpClient'

export const DISCORD_MAX_MESSAGE_LENGTH = 2000

export class DiscordClient {
  private readonly httpClient = new HttpClient()
  constructor(private readonly webhookUrl: string) {
    const rateLimiter = new RateLimiter({
      callsPerMinute: 3000,
    })
    this.sendMessage = rateLimiter.wrap(this.sendMessage.bind(this))
  }

  async sendMessage(message: string) {
    if (message.length > DISCORD_MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }

    const urlWithWait = `${this.webhookUrl}?wait=true`

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

  async deleteMessage(messageId: string) {
    const deleteUrl = `${this.webhookUrl}/messages/${messageId}`
    const res = await this.httpClient.fetchRaw(deleteUrl, {
      method: 'DELETE',
    })

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status} ${res.statusText}`)
    }
  }
}
