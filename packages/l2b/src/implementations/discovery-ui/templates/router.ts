import type { TemplateService } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import type { Express } from 'express'
import { z } from 'zod'
import { createShape } from './create-shape'
import { listDirectories } from './list-directories'

const templateIdRegex = new RegExp(
  '^(?!\\/)(?!.*\\/\\/)(?!.*\\s)(?!.*\\\\)(?:[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/)*[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/?$',
)

const safeTemplateIdSchema = z.string().regex(templateIdRegex, {
  message:
    'Template ID must be alphanumeric and can contain underscores or hyphens.',
})

const listTemplateFilesSchema = z.object({
  templateId: safeTemplateIdSchema,
})

const createTemplateSchema = z.object({
  chain: z.string(),
  addresses: z.array(
    z.string().refine((address) => EthereumAddress.check(address)),
  ),
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
    const data = createTemplateSchema.safeParse(req.body)

    if (!data.success) {
      console.error(data.error)
      res.status(400).json({ errors: data.error.flatten() })
      return
    }

    const { chain, addresses, templateId, fileName, blockNumber } = data.data

    const result = await wrapError(async () =>
      createShape(
        templateService,
        addresses.map(EthereumAddress),
        chain,
        blockNumber,
        templateId,
        fileName,
      ),
    )

    res.status(result.success ? 201 : 500).json(result)
  })

  app.get('/api/template-files', (req, res) => {
    const query = listTemplateFilesSchema.safeParse(req.query)

    if (!query.success) {
      res.status(400).json({ errors: query.error.flatten() })
      return
    }

    const template = templateService.readTemplateFile(query.data.templateId)

    if (!template) {
      res.status(404).json({ error: 'Template not found' })
      return
    }

    const shapes = templateService.readShapeFile(query.data.templateId)
    const criteria = templateService.readCriteriaFile(query.data.templateId)

    res.json({
      template,
      shapes,
      criteria,
    })
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
