import type { TemplateService } from '@l2beat/discovery'
import type { Express } from 'express'
import { z } from 'zod'
import { createShape } from './create-shape'
import { listDirectories } from './list-directories'

const createTemplateSchema = z.object({
  chain: z.string(),
  address: z.string(),
  templateId: z.string(),
  fileName: z.string(),
  blockNumber: z.number(),
})

export function attachTemplateRouter(
  app: Express,
  templateService: TemplateService,
) {
  app.get('/api/templates', (_req, res) => {
    const directories = listDirectories(templateService)
    res.json(directories)
  })

  app.post('/api/templates/create-shape', async (req, res) => {
    const { chain, address, templateId, fileName, blockNumber } =
      createTemplateSchema.parse(req.body)

    const result = await wrapError(async () =>
      createShape(
        templateService,
        address,
        chain,
        blockNumber,
        templateId,
        fileName,
      ),
    )

    res.status(result.success ? 201 : 500).json(result)
  })
}

async function wrapError<T>(fn: () => Promise<T>) {
  try {
    return {
      success: true,
      value: await fn(),
    } as const
  } catch (e) {
    console.error(e)
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error',
    } as const
  }
}
