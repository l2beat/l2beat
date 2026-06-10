import {
  AnalyzerResultApiResponse,
  AnalyzersApiResponse,
} from '@l2beat/shared-pure'
import FormData from 'form-data'
import { Agent as HttpsAgent } from 'https'
import fetch, { Headers, type RequestInit } from 'node-fetch'

const DEFAULT_ANALYZE_URL = 'https://analyze.internal.l2beat.com'

interface Schema<T> {
  parse(value: unknown): T
}

interface AnalyzeClientOptions {
  baseUrl?: string
  apiKey?: string
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

  async getAnalyzers(): Promise<AnalyzersApiResponse> {
    return await this.requestJson('/v1/analyzers', AnalyzersApiResponse)
  }

  async runAnalyzer(
    analyzerId: string,
    source: { name: string; code: string },
  ): Promise<AnalyzerResultApiResponse> {
    const body = new FormData()
    body.append('file', source.code, {
      filename: source.name,
      contentType: 'text/plain',
    })
    body.append('entrypoint', source.name)

    return await this.requestJson(
      `/v1/analyze/${encodeURIComponent(analyzerId)}`,
      AnalyzerResultApiResponse,
      {
        method: 'POST',
        body,
      },
    )
  }

  private async requestJson<T>(
    path: string,
    schema: Schema<T>,
    init: RequestInit = {},
  ): Promise<T> {
    const url = new URL(path, this.getBaseUrl())
    const response = await fetch(url.toString(), {
      ...init,
      headers: this.getHeaders(),
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

  private getHeaders() {
    const headers = new Headers()
    const apiKey = this.options.apiKey ?? process.env.L2ANALYZE_API_KEY
    if (apiKey) {
      headers.set('Authorization', `Bearer ${apiKey}`)
    }
    return headers
  }
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

  const allowBrokenCert = process.env.L2ANALYZE_ALLOW_BROKEN_CERT === 'true'

  return allowBrokenCert
    ? new HttpsAgent({ rejectUnauthorized: false })
    : undefined
}
