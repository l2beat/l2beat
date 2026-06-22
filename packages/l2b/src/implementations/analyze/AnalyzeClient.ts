import { getEnv } from '@l2beat/backend-tools'
import {
  AnalyzerResultApiResponse,
  AnalyzersApiResponse,
} from '@l2beat/shared-pure'
import { type Validator, v } from '@l2beat/validate'
import { zipSync } from 'fflate'
import FormData from 'form-data'
import fetch, {
  FetchError,
  Headers,
  type RequestInfo,
  type RequestInit,
  type Response,
} from 'node-fetch'

export type FetchFn = (
  url: RequestInfo,
  init?: RequestInit,
) => Promise<Response>

const UpstreamErrorResponse = v.object({
  error: v.object({
    code: v.string(),
    message: v.string(),
  }),
})

export class AnalyzeClientError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export class AnalyzeClient {
  constructor(private readonly fetchImpl: FetchFn = fetch) {}

  async getAnalyzers(): Promise<AnalyzersApiResponse> {
    return await this.requestJson('/v1/analyzers', AnalyzersApiResponse)
  }

  async runAnalyzer(
    analyzerId: string,
    input: { files: Record<string, Uint8Array>; entrypoint: string },
  ): Promise<AnalyzerResultApiResponse> {
    const body = new FormData()
    body.append('archive', createSourcesArchive(input.files), {
      filename: 'sources.zip',
      contentType: 'application/zip',
    })
    body.append('entrypoint', input.entrypoint)

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
    schema: Validator<T>,
    init: RequestInit = {},
  ): Promise<T> {
    const url = new URL(path, this.getBaseUrl())
    let response: Awaited<ReturnType<typeof fetch>>
    let body: string
    try {
      response = await this.fetchImpl(url.toString(), {
        ...init,
        headers: this.getHeaders(),
      })
      body = await response.text()
    } catch (error) {
      if (!(error instanceof FetchError)) {
        throw error
      }

      throw new AnalyzeClientError(
        502,
        `Analyze service request failed: ${error.message}`,
      )
    }

    const data = parseJson(body, response.status, response.statusText)

    if (!response.ok) {
      const error = UpstreamErrorResponse.safeParse(data)
      throw new AnalyzeClientError(
        response.status,
        error.success ? error.data.error.message : response.statusText,
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
    try {
      return getEnv().string('L2ANALYZE_URL')
    } catch {
      throw new AnalyzeClientError(500, 'L2ANALYZE_URL is not set')
    }
  }

  private getHeaders() {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.getApiKey()}`)
    return headers
  }

  private getApiKey() {
    try {
      return getEnv().string('L2ANALYZE_API_KEY')
    } catch {
      throw new AnalyzeClientError(500, 'L2ANALYZE_API_KEY is not set')
    }
  }
}

export function createSourcesArchive(
  files: Record<string, Uint8Array>,
): Buffer {
  return Buffer.from(zipSync(files))
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
