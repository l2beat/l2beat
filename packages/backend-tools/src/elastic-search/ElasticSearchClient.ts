import { Client } from '@elastic/elasticsearch'

export interface ElasticSearchClientOptions {
  node: string
  apiKey: string
}

// hides complexity of ElastiSearch client API
export class ElasticSearchClient {
  private readonly client: Client

  constructor(private readonly options: ElasticSearchClientOptions) {
    this.client = new Client({
      node: options.node,
      auth: {
        apiKey: options.apiKey,
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async bulk(documents: any[], index: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const operations = documents.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ])

    const bulkResponse = await this.client.bulk({ refresh: true, operations })
    return bulkResponse.errors
  }

  public async indexExist(index: string): Promise<boolean> {
    return await this.client.indices.exists({ index })
  }

  public async indexCreate(index: string): Promise<void> {
    await this.client.indices.create({
      index,
    })
  }
}
