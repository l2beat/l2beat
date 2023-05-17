/*
To send messages you need to create a Discord Bot first and give it appropriate permissions
https://discord.com/developers/docs/getting-started#configuring-a-bot
*/

import { HttpClient } from '@l2beat/shared'
import { RequestInit } from 'node-fetch'
import { Counter } from 'prom-client'

export const MAX_MESSAGE_LENGTH = 2000

export type Channel = 'PUBLIC' | 'INTERNAL'

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly discordToken: string,
    private readonly publicChannelId: string | undefined,
    private readonly internalChannelId: string,
  ) {}

  async sendMessage(message: string, channel: Channel) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Discord error: Message size exceeded (2000 characters)`)
    }
    if (channel === 'PUBLIC' && this.publicChannelId) {
      return this.send(message, this.publicChannelId)
    }
    if (channel === 'INTERNAL') {
      return this.send(message, this.internalChannelId)
    }
  }

  private async send(message: string, channelId: string) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Discord error: Message size exceeded (2000 characters)`)
    }

    const endpoint = `/channels/${channelId}/messages`
    const body = {
      content: message,
    }

    return this.query(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  private async query(endpoint: string, options?: RequestInit) {
    const url = 'https://discord.com/api/v10' + endpoint

    const res = await this.httpClient.fetch(url, {
      headers: {
        Authorization: `Bot ${this.discordToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      ...options,
    })

    if (!res.ok) {
      // Discord API returns pretty useful errors
      // this functionality aims to preserve them
      const body = (await res.json()) as unknown
      throw new Error(`Discord error: ${JSON.stringify(body)}`)
    }

    callsCount.inc()
    return res.json() as unknown
  }
}

const callsCount = new Counter({
  name: 'discord_client_calls',
  help: 'Value showing amount of calls to DiscordClient',
})
