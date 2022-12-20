import { HttpClient } from '@l2beat/common'
import { RequestInit } from 'node-fetch'

export class DiscordClient {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly discordToken: string,
    private readonly channelId: string,
  ) {}

  async sendMessage(message: string) {
    const endpoint = `channels/${this.channelId}/messages`
    const body = {
      content: message,
    }

    const res = await this.discordRequest(endpoint, {
      method: 'POST',
      //@ts-expect-error
      body,
    })
  }

  async discordRequest(endpoint: string, options: RequestInit) {
    const url = 'https://discord.com/api/v10/' + endpoint
    if (options.body) options.body = JSON.stringify(options.body)
    const res = await this.httpClient.fetch(url, {
      headers: {
        Authorization: `Bot ${this.discordToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      ...options,
    })
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json()
      console.log(res.status)
      throw new Error(JSON.stringify(data))
    }
    return res
  }
}
