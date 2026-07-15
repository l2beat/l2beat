import { Client, type estypes } from '@elastic/elasticsearch'

export class Elastic {
  private readonly client: Client

  constructor(url: string, apiKey: string) {
    this.client = new Client({ node: url, auth: { apiKey } })
  }

  async search(index: string, body: Record<string, unknown>): Promise<unknown> {
    return await this.client.search({
      index,
      ignore_unavailable: true,
      ...body,
    } as estypes.SearchRequest)
  }
}
