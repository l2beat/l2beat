/*
To send messages you need to create a Discord Bot first and give it appropriate permissions
https://discord.com/developers/docs/getting-started#configuring-a-bot
*/

import { HttpClient } from '@l2beat/shared'
import { RequestInit } from 'node-fetch'

export const MAX_MESSAGE_LENGTH = 2000

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly discordToken: string,
    private readonly channelIds: string[],
  ) {}

  async sendMessage(message: string) {
    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Discord error: Message size exceeded (2000 characters)`)
    }

    return await Promise.all(
      this.channelIds.map((channelId) => {
        const endpoint = `/channels/${channelId}/messages`
        const body = {
          content: message,
        }

        return this.query(endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
        })
      }),
    )
  }

  async query(endpoint: string, options?: RequestInit) {
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

    return res.json() as unknown
  }
}
