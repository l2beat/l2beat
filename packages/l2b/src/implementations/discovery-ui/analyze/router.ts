import type { ConfigReader } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express, Response } from 'express'
import { AnalyzeClient, AnalyzeClientError } from '../../analyze/AnalyzeClient'
import {
  AnalyzeSourceError,
  loadAnalyzerSourceInput,
} from '../../analyze/loadFlatSources'

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
  entrypoint: z.string().check((v) => v.length > 0),
})

export function attachAnalyzeRouter(app: Express, configReader: ConfigReader) {
  const analyzeClient = new AnalyzeClient()

  app.get('/api/analyze/analyzers', async (_req, res) => {
    try {
      const analyzers = await analyzeClient.getAnalyzers()
      res.json(analyzers)
    } catch (error) {
      respondWithAnalyzeError(res, error, 'Failed to fetch analyzers')
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

    const { analyzerId, entrypoint } = bodyValidation.data
    const { project, address } = paramsValidation.data

    try {
      const result = await analyzeClient.runAnalyzer(
        analyzerId,
        await loadAnalyzerSourceInput(configReader, {
          project,
          address,
          entrypoint,
        }),
      )
      res.json(result)
    } catch (error) {
      respondWithAnalyzeError(res, error, 'Failed to run analyzer')
    }
  })
}

function respondWithAnalyzeError(
  res: Response,
  error: unknown,
  fallbackMessage: string,
) {
  console.error(error)

  if (error instanceof AnalyzeSourceError) {
    res.status(error.status).json({ error: error.message })
    return
  }

  if (error instanceof AnalyzeClientError) {
    res.status(error.status).json({ error: error.message })
    return
  }

  res.status(502).json({ error: fallbackMessage })
}
