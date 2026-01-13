import type { OverspecificationService } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'

const checkConfigQuerySchema = z.object({
  project: z.string(),
  address: z.string().transform(ChainSpecificAddress),
  ignoreInWatchMode: z.array(z.string()).optional(),
  ignoreMethods: z.array(z.string()).optional(),
  ignoreRelatives: z.array(z.string()).optional(),
})

const checkTemplateQuerySchema = z.object({
  templateId: z.string(),
  ignoreInWatchMode: z.array(z.string()).optional(),
  ignoreMethods: z.array(z.string()).optional(),
  ignoreRelatives: z.array(z.string()).optional(),
})

export function attachOverspecificationRouter(
  app: Express,
  service: OverspecificationService,
) {
  app.post('/api/overspecification/check-config', (req, res) => {
    try {
      const validation = checkConfigQuerySchema.safeParse(req.body)
      if (!validation.success) {
        res.status(400).json({ error: validation.message })
        return
      }

      const { project, address, ...methods } = validation.data
      const result = service.checkConfigOverspecification(
        project,
        address,
        methods,
      )

      res.json({ overspecified: result })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })

  app.post('/api/overspecification/check-template', (req, res) => {
    try {
      const validation = checkTemplateQuerySchema.safeParse(req.body)
      if (!validation.success) {
        res.status(400).json({ error: validation.message })
        return
      }

      const { templateId, ...methods } = validation.data
      const result = service.checkTemplateOverspecification(templateId, methods)

      res.json({ overspecified: result })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })
}
