import { RateLimiter } from '@l2beat/backend-tools'
import { retry } from '../../clients2/retries'
import { HttpClient } from '../http/HttpClient'

export const DISCORD_MAX_MESSAGE_LENGTH = 2000

const SEND_RETRY_OPTIONS = { initialTimeoutMs: 2_000, maxAttempts: 3 }

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

    // A timed-out attempt may still have been posted, so a retry can duplicate
    // the message. Notifications are alerts: a duplicate is cheaper than a loss.
    return await retry(() => this.postMessage(message), SEND_RETRY_OPTIONS)
  }

  private async postMessage(message: string) {
    const urlWithWait = `${this.webhookUrl}?wait=true`

    const res = await this.httpClient.fetchRaw(urlWithWait, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })

    if (!res.ok) {
      await res.body?.cancel()
      throw new Error('HTTP error', {
        cause: { status: res.status, statusText: res.statusText },
      })
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
      throw new Error('HTTP error', {
        cause: { status: res.status, statusText: res.statusText },
      })
    }
  }
}
