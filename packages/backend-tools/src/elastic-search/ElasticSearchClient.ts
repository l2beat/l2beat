import { Client } from '@elastic/elasticsearch'
import type { BulkResponse } from '@elastic/elasticsearch/lib/api/types'

export interface ElasticSearchClientOptions {
  node: string
  apiKey: string
}

type CustomBulkResponse =
  | {
      isSuccess: true
    }
  | {
      isSuccess: false
      failedDocuments: Record<string, unknown>[]
    }

// hides complexity of ElasticSearch client API
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

  public async bulk(
    documents: unknown[],
    index: string,
  ): Promise<CustomBulkResponse> {
    if (documents.length === 0) {
      return { isSuccess: true }
    }

    const operations = documents.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ])

    const response = await this.client.bulk({ refresh: true, operations })

    if (response.errors) {
      return {
        isSuccess: false,
        failedDocuments: this.getFailedDocuments(response, operations),
      }
    }

    return { isSuccess: true }
  }

  public async indexExist(index: string): Promise<boolean> {
    return await this.client.indices.exists({ index })
  }

  public async indexCreate(index: string): Promise<void> {
    await this.client.indices.create({
      index,
    })
  }

  private getFailedDocuments(
    response: BulkResponse,
    operations: unknown[],
  ): Record<string, unknown>[] {
    /**
     * The ES bulk API returns `items` in the same order as the input operations.
     * Input operations are structured as alternating [action, document] pairs,
     * so `items[i]` corresponds to `operations[i * 2]` (action) and `operations[i * 2 + 1]` (document).
     * We use this positional mapping to extract the original documents that failed ingestion.
     */
    return response.items
      .map((item, i) => ({
        status: item.index?.status ?? 500,
        error: item.index?.error ?? 'Unknown error',
        document: operations[i * 2 + 1],
      }))
      .filter(({ status }) => status !== 201)
  }
}
