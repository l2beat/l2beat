import type { ConfigReader, TemplateService } from '@l2beat/discovery'
import type { Express } from 'express'
import { z } from 'zod'
import { createShape } from './create-shape'
import { listDirectories } from './list-directories'

const createTemplateSchema = z.object({
  chain: z.string(),
  address: z.string(),
  project: z.string(),
  templateId: z.string(),
})

export function attachTemplateRouter(
  app: Express,
  templateService: TemplateService,
  configReader: ConfigReader,
) {
  app.get('/api/templates', (_req, res) => {
    const directories = listDirectories(templateService)
    console.dir({ directories }, { depth: null })
    res.json(directories)
  })

  app.post('/api/templates/create-shape', async (req, res) => {
    const { project, chain, address, templateId } = createTemplateSchema.parse(
      req.body,
    )

    await createShape(
      templateService,
      configReader,
      project,
      address,
      templateId,
      chain,
    )

    res.json({ success: true })
  })
}
