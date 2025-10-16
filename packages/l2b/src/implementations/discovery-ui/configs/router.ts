import type { ConfigReader, ConfigWriter } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { projectParamsSchema } from '../main'

const updateConfigFileSchema = z.object({
  content: z.string(),
})

const createConfigFileSchema = z.object({
  type: z.enum(['project', 'token']),
  project: z.string().check((v) => v.length > 0),
  initialAddresses: z
    .array(z.string())
    .check((v) => v.length > 0)
    .transform((v) => v.map(ChainSpecificAddress)),
  maxDepth: z.number().optional(),
  maxAddresses: z.number().optional(),
  overwrite: z.boolean().optional(),
})

export function attachConfigRouter(
  app: Express,
  configReader: ConfigReader,
  configWriter: ConfigWriter,
) {
  app.put('/api/config-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    const data = updateConfigFileSchema.safeParse(req.body)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    if (!data.success) {
      res.status(400).json({ errors: data.message })
      return
    }

    configWriter.updateRawConfigFile(query.data.project, data.data.content)

    res.json({ success: true })
  })

  app.post('/api/config-files', (req, res) => {
    const body = createConfigFileSchema.safeParse(req.body)

    if (!body.success) {
      res.status(400).json({ success: false, error: body.message })
      return
    }

    if (
      configReader.projectConfigExists(body.data.project) &&
      !body.data.overwrite
    ) {
      res
        .status(400)
        .json({ success: false, error: 'Config file already exists' })
      return
    }

    const templateValues = {
      name: body.data.project,
      initialAddresses: body.data.initialAddresses,
      maxDepth: body.data.maxDepth,
      maxAddresses: body.data.maxAddresses,
    }

    if (body.data.type === 'project') {
      configWriter.createProjectConfigFile(body.data.project, templateValues)
    } else {
      configWriter.createTokenConfigFile(body.data.project, templateValues)
    }

    res.json({ success: true })
  })
}
