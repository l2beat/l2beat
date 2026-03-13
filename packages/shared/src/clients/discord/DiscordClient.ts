/*
To send messages you need to create a Discord Bot first and give it appropriate permissions
https://discord.com/developers/docs/getting-started#configuring-a-bot
*/

import { RateLimiter } from '@l2beat/backend-tools'
import type { RequestInit } from 'node-fetch'
import type { HttpClient } from '../http/HttpClient'

export const DISCORD_MAX_MESSAGE_LENGTH = 2000

export type DiscordChannelType = 'PUBLIC' | 'INTERNAL'

interface DiscordConfig {
  readonly token: string
  readonly publicChannelId?: string
  readonly internalChannelId: string
  readonly callsPerMinute: number
  readonly webhookUrl?: string
}

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: DiscordConfig,
  ) {
    if (config.callsPerMinute) {
      const rateLimiter = new RateLimiter({
        callsPerMinute: config.callsPerMinute,
      })
      this.sendMessage = rateLimiter.wrap(this.sendMessage.bind(this))
    }
  }

  async sendMessage(message: string, channel: DiscordChannelType) {
    if (message.length > DISCORD_MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }
    if (channel === 'PUBLIC' && this.config.publicChannelId) {
      return await this.send(message, this.config.publicChannelId)
    }
    if (channel === 'INTERNAL') {
      return await this.send(message, this.config.internalChannelId)
    }
  }

  async sendMessageToWebhook(message: string, webhookUrl?: string) {
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

  async deleteWebhookMessage(messageId: string, webhookUrl?: string) {
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

  private async send(message: string, channelId: string) {
    if (message.length > DISCORD_MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }

    const endpoint = `/channels/${channelId}/messages`
    const body = {
      content: message,
    }

    return await this.query(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  private async query(endpoint: string, options?: RequestInit) {
    const url = 'https://discord.com/api/v10' + endpoint

    return await this.httpClient.fetch(url, {
      headers: {
        Authorization: `Bot ${this.config.token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      ...options,
    })
  }
}
