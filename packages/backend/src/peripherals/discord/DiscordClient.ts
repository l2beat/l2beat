import { HttpClient } from '@l2beat/common'
import { RequestInit } from 'node-fetch'

const DISCORD_TOKEN =
  'MTA1NDM5NzcyMTcwMTc5Nzk2OQ.GpKDU-.gnofHu8RO4bYZWquHCuTzV80SfSIj8PCXW47HQ'
const APP_ID = '1054397721701797969'
const PUBLIC_KEY =
  '941c5e89a9b8f4758ab131fbe37fece55fa7c9fbe0dcf9fd46b5043e15ea9a32'
const GUILD_ID = '932763329498337371'

export class DiscordClient {
  constructor(private readonly httpClient: HttpClient) {}

  sendMessage() {}

  async createCommand() {
    const endpoint = `applications/${APP_ID}/guilds/${GUILD_ID}/commands`
    const commandBody = {
      name: 'test',
      description: 'description',
      type: 1,
    }

    try {
      const res = await this.discordRequest(endpoint, {
        method: 'POST',
        // @ts-expect-error
        body: commandBody,
      })
      console.log(await res.json())
    } catch (err) {
      console.log('Error installing commands', err)
    }
  }

  async discordRequest(endpoint: string, options: RequestInit) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body)
    // Use node-fetch to make requests
    const res = await this.httpClient.fetch(url, {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent':
          'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      },
      ...options,
    })
    // throw API errors
    if (!res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await res.json()
      console.log(res.status)
      throw new Error(JSON.stringify(data))
    }
    // return original response
    return res
  }
}
