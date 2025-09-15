import type { ConfigWriter } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { projectParamsSchema } from '../main'

const writeConfigFileSchema = z.object({
  content: z.string(),
})

export function attachConfigRouter(app: Express, configWriter: ConfigWriter) {
  app.post('/api/config-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    const data = writeConfigFileSchema.safeParse(req.body)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    if (!data.success) {
      res.status(400).json({ errors: data.message })
      return
    }

    configWriter.writeConfigFile(query.data.project, data.data.content)

    res.json({ success: true })
  })
}
