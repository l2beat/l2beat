import { setTimeout as sleep } from 'timers/promises'

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

interface BulkResponse {
  errors: boolean
  items: { index?: { status: number; error?: unknown } }[]
}

interface ElasticSearchResponse {
  status: number
  body: string
}

const REQUEST_TIMEOUT_MS = 30_000
const MAX_RETRIES = 3

// Mirrors the request semantics of @elastic/elasticsearch 8 (retries,
// timeout, error messages), so log shipping behaves exactly as before.
export class ElasticSearchClient {
  constructor(private readonly options: ElasticSearchClientOptions) {}

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
    const body = operations
      .map((operation) => `${JSON.stringify(operation)}\n`)
      .join('')

    const response = await this.request('POST', '/_bulk?refresh=true', body)
    const result = JSON.parse(response.body) as BulkResponse

    if (result.errors) {
      return {
        isSuccess: false,
        failedDocuments: getFailedDocuments(result, operations),
      }
    }

    return { isSuccess: true }
  }

  public async indexExist(index: string): Promise<boolean> {
    const response = await this.request('HEAD', `/${encodeURIComponent(index)}`)
    return response.status !== 404
  }

  public async indexCreate(index: string): Promise<void> {
    await this.request('PUT', `/${encodeURIComponent(index)}`)
  }

  private async request(
    method: 'HEAD' | 'PUT' | 'POST',
    path: string,
    body?: string,
  ): Promise<ElasticSearchResponse> {
    for (let attempt = 0; ; attempt++) {
      let response: ElasticSearchResponse & { contentType: string }
      try {
        response = await this.send(method, path, body)
      } catch (error) {
        if (isTimeout(error)) {
          throw new Error('Request timed out')
        }
        if (attempt < MAX_RETRIES) {
          await sleep(retryBackoffMs(attempt + 1))
          continue
        }
        throw new Error(connectionErrorMessage(error))
      }

      const isMissingIndex = method === 'HEAD' && response.status === 404
      const isRetryable =
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504
      if (!isMissingIndex && isRetryable && attempt < MAX_RETRIES) {
        continue
      }
      if (!isMissingIndex && response.status >= 400) {
        throw new Error(responseErrorMessage(method, response))
      }
      return response
    }
  }

  private async send(
    method: 'HEAD' | 'PUT' | 'POST',
    path: string,
    body: string | undefined,
  ): Promise<ElasticSearchResponse & { contentType: string }> {
    const headers: Record<string, string> = {
      authorization: `ApiKey ${this.options.apiKey}`,
      accept: 'application/json',
    }
    if (body !== undefined) {
      headers['content-type'] = 'application/x-ndjson'
    }
    const response = await fetch(
      `${trimTrailingSlash(this.options.node)}${path}`,
      {
        method,
        headers,
        body,
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      },
    )
    return {
      status: response.status,
      body: await response.text(),
      contentType: response.headers.get('content-type') ?? '',
    }
  }
}

function getFailedDocuments(
  response: BulkResponse,
  operations: unknown[],
): Record<string, unknown>[] {
  // items[i] answers the action at operations[i * 2]; its document follows it.
  return response.items
    .map((item, i) => ({
      status: item.index?.status ?? 500,
      error: item.index?.error ?? 'Unknown error',
      document: operations[i * 2 + 1],
    }))
    .filter(({ status }) => status !== 201)
}

function responseErrorMessage(
  method: string,
  response: ElasticSearchResponse & { contentType: string },
): string {
  if (response.status === 410) {
    return 'This API is unavailable in the version of Elasticsearch you are using.'
  }
  const isJson =
    response.contentType.includes('application/json') ||
    response.contentType.includes('application/vnd.elasticsearch+json')
  if (method === 'HEAD' || !isJson || response.body === '') {
    return response.body
  }

  const parsed: unknown = JSON.parse(response.body)
  const error = isObject(parsed) ? parsed.error : undefined
  if (!isObject(error) || error.type == null) {
    return JSON.stringify(parsed)
  }

  let message = String(error.type)
  if (isObject(error.caused_by)) {
    message += `\n\tCaused by:\n\t\t${error.caused_by.type}: ${error.caused_by.reason}`
  }
  if (Array.isArray(error.root_cause) && error.root_cause.length !== 0) {
    const causes = error.root_cause.map(
      (cause: Record<string, unknown>) => `\t\t${cause.type}: ${cause.reason}`,
    )
    message += `\n\tRoot causes:\n${causes.join('\n')}`
  }
  return message
}

function connectionErrorMessage(error: unknown): string {
  const cause = error instanceof Error ? error.cause : undefined
  if (!(cause instanceof Error)) {
    return error instanceof Error ? error.message : String(error)
  }
  const code = (cause as { code?: string }).code
  if (code !== 'UND_ERR_SOCKET') {
    return cause.message
  }
  const socket = (cause as { socket?: Record<string, unknown> }).socket
  const local = `${socket?.localAddress ?? 'unknown'}:${socket?.localPort ?? 'unknown'}`
  const remote = `${socket?.remoteAddress ?? 'unknown'}:${socket?.remotePort ?? 'unknown'}`
  return `${cause.message} - Local: ${local}, Remote: ${remote}`
}

function isTimeout(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'TimeoutError'
}

// Same jittered exponential backoff as @elastic/transport: 1-2s, 2-4s, 2-4s.
function retryBackoffMs(attempt: number): number {
  const ceiling = Math.min(4, 2 ** attempt) / 2
  return (ceiling + Math.random() * ceiling) * 1000
}

function trimTrailingSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
