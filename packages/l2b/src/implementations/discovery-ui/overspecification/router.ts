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

const projectParamsSchema = z.object({
  project: z.string(),
})

const templateParamsSchema = z.object({
  templateId: z.string(),
})

/**
 * Attach overspecification checking routes to the express app.
 *
 * Endpoints:
 * - POST /api/overspecification/check-config - Check specific config override
 * - GET /api/overspecification/check-config/:project - Check all overrides in a project
 * - POST /api/overspecification/check-template - Check specific template methods
 * - GET /api/overspecification/check-template/:templateId - Check template file
 * - GET /api/overspecification/check-all-templates - Check all templates
 */
export function attachOverspecificationRouter(
  app: Express,
  service: OverspecificationService,
) {
  /**
   * Check if provided methods are overspecified for a specific config override.
   * POST /api/overspecification/check-config
   *
   * Body: {
   *   project: string
   *   address: string
   *   ignoreInWatchMode?: string[]
   *   ignoreMethods?: string[]
   *   ignoreRelatives?: string[]
   * }
   *
   * Returns: {
   *   overspecified: {
   *     ignoreInWatchMode: string[]
   *     ignoreMethods: string[]
   *     ignoreRelatives: string[]
   *   }
   * }
   */
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
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })

  /**
   * Check all config overrides in a project for overspecification.
   * GET /api/overspecification/check-config/:project
   *
   * Returns: {
   *   results: Array<{
   *     address: string
   *     overspecified: {
   *       ignoreInWatchMode: string[]
   *       ignoreMethods: string[]
   *       ignoreRelatives: string[]
   *     }
   *   }>
   * }
   */
  app.get('/api/overspecification/check-config/:project', (req, res) => {
    try {
      const validation = projectParamsSchema.safeParse(req.params)
      if (!validation.success) {
        res.status(400).json({ error: validation.message })
        return
      }

      const { project } = validation.data
      const results = service.checkAllConfigOverrides(project)

      res.json({ results })
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })

  /**
   * Check if provided methods are overspecified for a template.
   * POST /api/overspecification/check-template
   *
   * Body: {
   *   templateId: string
   *   ignoreInWatchMode?: string[]
   *   ignoreMethods?: string[]
   *   ignoreRelatives?: string[]
   * }
   *
   * Returns: {
   *   overspecified: {
   *     ignoreInWatchMode: string[]
   *     ignoreMethods: string[]
   *     ignoreRelatives: string[]
   *   }
   * }
   */
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
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })

  /**
   * Check a template file's current ignore* properties for overspecification.
   * GET /api/overspecification/check-template/:templateId
   *
   * Returns: {
   *   templateId: string
   *   overspecified: {
   *     ignoreInWatchMode: string[]
   *     ignoreMethods: string[]
   *     ignoreRelatives: string[]
   *   }
   * }
   */
  app.get('/api/overspecification/check-template/:templateId', (req, res) => {
    try {
      const validation = templateParamsSchema.safeParse(req.params)
      if (!validation.success) {
        res.status(400).json({ error: validation.message })
        return
      }

      const { templateId } = validation.data
      const result = service.checkTemplateFile(templateId)

      res.json(result)
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })

  /**
   * Check all templates for overspecification.
   * GET /api/overspecification/check-all-templates
   *
   * Returns: {
   *   results: Array<{
   *     templateId: string
   *     overspecified: {
   *       ignoreInWatchMode: string[]
   *       ignoreMethods: string[]
   *       ignoreRelatives: string[]
   *     }
   *   }>
   * }
   */
  app.get('/api/overspecification/check-all-templates', (_req, res) => {
    try {
      const results = service.checkAllTemplates()
      res.json({ results })
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  })
}
