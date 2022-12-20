import { HttpClient } from '@l2beat/common'
import { RequestInit } from 'node-fetch'

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly discordToken: string,
    private readonly channelId: string,
  ) {}

  async sendMessage(message: string) {
    const endpoint = `/channels/${this.channelId}/messages`
    const body = {
      content: message,
    }

    const res = await this.query(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
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
      const error = JSON.stringify(await res.json())
      throw new Error(`Discord error: ${error}`)
    }

    return res.json() as unknown
  }
}
