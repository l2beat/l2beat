import type { TemplateService } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { createShape } from './create-shape'
import { listDirectories } from './list-directories'

const templateIdRegex = new RegExp(
  '^(?!\\/)(?!.*\\/\\/)(?!.*\\s)(?!.*\\\\)(?:[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/)*[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/?$',
)

const safeTemplateIdSchema = z
  .string()
  .check(
    (v) => templateIdRegex.test(v),
    'Template ID must be alphanumeric and can contain underscores or hyphens.',
  )

export const listTemplateFilesSchema = z.object({
  templateId: safeTemplateIdSchema,
})

const writeTemplateFileSchema = z.object({
  templateId: safeTemplateIdSchema,
  content: z.string(),
})

const createTemplateSchema = z.object({
  chain: z.string(),
  addresses: z.array(
    z.string().check((address) => EthereumAddress.check(address)),
  ),
  templateId: safeTemplateIdSchema,
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
      console.error(data.message)
      res.status(400).json({ errors: data.message })
      return
    }

    const { chain, addresses, templateId, fileName, blockNumber } = data.data

    const result = await wrapError(() =>
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

  app.post('/api/template-files', (req, res) => {
    const data = writeTemplateFileSchema.safeParse(req.body)

    if (!data.success) {
      res.status(400).json({ errors: data.message })
      return
    }

    const { templateId, content } = data.data
    templateService.writeTemplateFile(templateId, content)
    res.status(200).json({ success: true })
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
