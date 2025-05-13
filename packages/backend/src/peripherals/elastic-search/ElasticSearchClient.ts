import { Client } from '@elastic/elasticsearch'
import type {
  BulkOperationType,
  BulkResponseItem,
  ErrorCause,
} from '@elastic/elasticsearch/lib/api/types'

export interface ElasticSearchClientOptions {
  node: string
  apiKey: string
}

type DocumentError = {
  status: number
  error: ErrorCause
}

type BulkResponse =
  | {
      isSuccess: true
    }
  | {
      isSuccess: false
      errors: DocumentError[]
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

  public async bulk(
    // biome-ignore lint/suspicious/noExplicitAny: generic type
    documents: any[],
    index: string,
  ): Promise<BulkResponse> {
    const operations = documents.flatMap((doc) => [
      { index: { _index: index } },
      doc,
    ])

    const response = await this.client.bulk({ refresh: true, operations })

    if (response.errors) {
      return { isSuccess: false, errors: this.bundleErrors(response) }
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

  private bundleErrors<
    T extends {
      errors: boolean
      items: Partial<Record<BulkOperationType, BulkResponseItem>>[]
    },
  >(response: T): DocumentError[] {
    const erroredDocuments: DocumentError[] = []
    if (response.errors) {
      response.items.forEach((action) => {
        const operation = Object.keys(action)[0] as BulkOperationType
        if (!operation) return
        const item = action[operation]
        if (item?.error) {
          erroredDocuments.push({
            status: item.status,
            error: item.error,
          })
        }
      })
    }
    return erroredDocuments
  }
}
