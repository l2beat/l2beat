/*
To send messages you need to create a Discord Bot first and give it appropriate permissions
https://discord.com/developers/docs/getting-started#configuring-a-bot
*/

import { RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import type { RequestInit } from 'node-fetch'
import type { DiscordConfig } from '../../config/Config'

export const MAX_MESSAGE_LENGTH = 2000

export type Channel = 'PUBLIC' | 'INTERNAL'

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

  static create(services: { httpClient: HttpClient }, options: DiscordConfig) {
    return new DiscordClient(services.httpClient, options)
  }

  async sendMessage(message: string, channel: Channel) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error('Discord error: Message size exceeded (2000 characters)')
    }
    if (channel === 'PUBLIC' && this.config.publicChannelId) {
      return await this.send(message, this.config.publicChannelId)
    }
    if (channel === 'INTERNAL') {
      return await this.send(message, this.config.internalChannelId)
    }
  }

  private async send(message: string, channelId: string) {
    if (message.length > MAX_MESSAGE_LENGTH) {
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
