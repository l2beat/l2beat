import { Agent as HttpsAgent } from 'https'
import fetch, { Headers, type RequestInit } from 'node-fetch'
import {
  type ApiAnalyzer,
  type ApiAnalyzerResult,
  ApiAnalyzerResultSchema,
  ApiAnalyzersSchema,
} from './models'
import { createAnalyzeMultipartBody, type MultipartBody } from './multipart'

const DEFAULT_ANALYZE_URL = 'https://analyze.internal.l2beat.com'

interface Schema<T> {
  parse(value: unknown): T
}

interface AnalyzeClientOptions {
  baseUrl?: string
  apiKey?: string
}

type AnalyzeRequestInit = Omit<RequestInit, 'body' | 'headers'> & {
  body?: RequestInit['body'] | MultipartBody
}

export class AnalyzeClientError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export class AnalyzeClient {
  constructor(private readonly options: AnalyzeClientOptions = {}) {}

  async getAnalyzers(): Promise<ApiAnalyzer[]> {
    return await this.requestJson('/v1/analyzers', ApiAnalyzersSchema)
  }

  async runAnalyzer(
    analyzerId: string,
    source: { name: string; code: string },
  ): Promise<ApiAnalyzerResult> {
    return await this.requestJson(
      `/v1/analyze/${encodeURIComponent(analyzerId)}`,
      ApiAnalyzerResultSchema,
      {
        method: 'POST',
        body: createAnalyzeMultipartBody(source.name, source.code),
      },
    )
  }

  private async requestJson<T>(
    path: string,
    schema: Schema<T>,
    init: AnalyzeRequestInit = {},
  ): Promise<T> {
    const url = new URL(path, this.getBaseUrl())
    const response = await fetch(url.toString(), {
      ...init,
      headers: this.getHeaders(init.body),
      body: isMultipartBody(init.body) ? init.body.buffer : init.body,
      agent: getHttpsAgent(url),
    })
    const body = await response.text()
    const data = parseJson(body, response.status, response.statusText)

    if (!response.ok) {
      throw new AnalyzeClientError(
        response.status,
        readUpstreamError(data) ?? response.statusText,
      )
    }

    try {
      return schema.parse(data)
    } catch {
      throw new AnalyzeClientError(
        502,
        'Analyze service returned an invalid response',
      )
    }
  }

  private getBaseUrl() {
    return (
      this.options.baseUrl ?? process.env.L2ANALYZE_URL ?? DEFAULT_ANALYZE_URL
    )
  }

  private getHeaders(body: AnalyzeRequestInit['body']) {
    const headers = new Headers()
    const apiKey = this.options.apiKey ?? process.env.L2ANALYZE_API_KEY
    if (apiKey) {
      headers.set('Authorization', `Bearer ${apiKey}`)
    }
    if (isMultipartBody(body)) {
      headers.set('Content-Type', body.contentType)
      headers.set('Content-Length', body.contentLength.toString())
    }
    return headers
  }
}

function isMultipartBody(
  body: AnalyzeRequestInit['body'],
): body is MultipartBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'buffer' in body &&
    'contentType' in body &&
    'contentLength' in body
  )
}

function parseJson(body: string, status: number, statusText: string): unknown {
  try {
    return JSON.parse(body)
  } catch {
    throw new AnalyzeClientError(
      status >= 400 ? status : 502,
      statusText || 'Analyze service returned invalid JSON',
    )
  }
}

function readUpstreamError(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined
  }
  if ('error' in data && typeof data.error === 'string') {
    return data.error
  }
  if ('message' in data && typeof data.message === 'string') {
    return data.message
  }
  return undefined
}

function getHttpsAgent(url: URL) {
  if (url.protocol !== 'https:') {
    return undefined
  }

  const allowBrokenCert =
    process.env.L2ANALYZE_ALLOW_BROKEN_CERT === 'true' ||
    url.hostname === 'analyze.internal.l2beat.com'

  return allowBrokenCert
    ? new HttpsAgent({ rejectUnauthorized: false })
    : undefined
}
