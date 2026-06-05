import type { ConfigReader } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { Agent as HttpsAgent } from 'https'
import fetch, { Headers, type RequestInit } from 'node-fetch'
import { getCodeFromDisk } from '../getCode'

const DEFAULT_ANALYZE_URL = 'https://analyze.internal.l2beat.com'

const safeStringSchema = z
  .string()
  .check(
    (v) => v.length > 0 && /^[a-zA-Z0-9_-]+$/.test(v),
    'Input cannot be empty and must be alphanumeric and can contain underscores or hyphens.',
  )

const analyzeParamsSchema = z.object({
  project: safeStringSchema,
  address: z.string().transform(ChainSpecificAddress),
})

const analyzeBodySchema = z.object({
  analyzerId: z.string().check((v) => v.length > 0),
  sourceName: z.string().check((v) => v.length > 0),
})

export function attachAnalyzeRouter(app: Express, configReader: ConfigReader) {
  app.get('/api/analyze/analyzers', async (_req, res) => {
    try {
      const response = await callAnalyze('/v1/analyzers')
      res.status(response.status).type('application/json').send(response.body)
    } catch (error) {
      console.error(error)
      res.status(502).json({ error: 'Failed to fetch analyzers' })
    }
  })

  app.post('/api/projects/:project/analyze/:address', async (req, res) => {
    const paramsValidation = analyzeParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }

    const bodyValidation = analyzeBodySchema.safeParse(req.body)
    if (!bodyValidation.success) {
      res.status(400).json({ errors: bodyValidation.message })
      return
    }

    const { project, address } = paramsValidation.data
    const { analyzerId, sourceName } = bodyValidation.data

    try {
      const code = getCodeFromDisk(configReader, project, address)
      const source = code.sources.find((source) => source.name === sourceName)

      if (!source) {
        res.status(404).json({ error: 'Source file not found' })
        return
      }

      const response = await callAnalyze(
        `/v1/analyze/${encodeURIComponent(analyzerId)}`,
        {
          method: 'POST',
          body: createMultipartBody(source.name, source.code),
        },
      )
      res.status(response.status).type('application/json').send(response.body)
    } catch (error) {
      console.error(error)
      res.status(502).json({ error: 'Failed to run analyzer' })
    }
  })
}

type AnalyzeRequestInit = Omit<RequestInit, 'body' | 'headers'> & {
  body?: RequestInit['body'] | MultipartBody
}

async function callAnalyze(path: string, init: AnalyzeRequestInit = {}) {
  const url = new URL(path, getAnalyzeUrl())
  const headers = new Headers()
  const apiKey = process.env.L2ANALYZE_API_KEY
  if (apiKey) {
    headers.set('Authorization', `Bearer ${apiKey}`)
  }
  if (init.body instanceof MultipartBody) {
    headers.set('Content-Type', init.body.contentType)
    headers.set('Content-Length', init.body.contentLength.toString())
  }

  const response = await fetch(url.toString(), {
    ...init,
    headers,
    body: init.body instanceof MultipartBody ? init.body.buffer : init.body,
    agent: getHttpsAgent(url),
  })

  return {
    status: response.status,
    body: await response.text(),
  }
}

function getAnalyzeUrl() {
  return process.env.L2ANALYZE_URL ?? DEFAULT_ANALYZE_URL
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

class MultipartBody {
  constructor(
    readonly buffer: Buffer,
    readonly contentType: string,
  ) {}

  get contentLength() {
    return this.buffer.length
  }
}

function createMultipartBody(fileName: string, code: string) {
  const boundary = `l2beat-analyze-${Date.now().toString(36)}`
  const escapedFileName = fileName.replace(/"/g, '\\"')
  const parts = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${escapedFileName}"`,
    'Content-Type: text/plain',
    '',
    code,
    `--${boundary}`,
    'Content-Disposition: form-data; name="entrypoint"',
    '',
    fileName,
    `--${boundary}--`,
    '',
  ]

  return new MultipartBody(
    Buffer.from(parts.join('\r\n')),
    `multipart/form-data; boundary=${boundary}`,
  )
}
