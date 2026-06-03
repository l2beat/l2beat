import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { projectParamsSchema } from '../main'
import {
  LayoutStorageError,
  listProjectLayouts,
  readProjectLayout,
  writeProjectLayout,
} from './storage'

const safeLayoutNameSchema = z
  .string()
  .check(
    (v) =>
      v.length > 0 &&
      v === v.trim() &&
      v !== '.' &&
      v !== '..' &&
      !/[\\/]/.test(v),
    'Layout name cannot be empty and cannot contain path separators.',
  )

const layoutNameSchema = z.object({
  project: z
    .string()
    .check(
      (v) => v.length > 0 && /^[a-zA-Z0-9_-]+$/.test(v),
      'Input cannot be empty and must be alphanumeric and can contain underscores or hyphens.',
    ),
  name: safeLayoutNameSchema,
})

const writeProjectLayoutSchema = z.object({
  layout: z.unknown(),
  overwrite: z.boolean().optional(),
})

export function attachLayoutRouter(
  app: Express,
  configReader: ConfigReader,
  readonly: boolean,
) {
  app.get('/api/projects/:project/layouts', (req, res) => {
    const params = projectParamsSchema.safeParse(req.params)
    if (!params.success) {
      res.status(400).json({ errors: params.message })
      return
    }

    if (!configReader.projectConfigExists(params.data.project)) {
      res.status(404).json({ error: 'Project not found.' })
      return
    }

    const layouts = listProjectLayouts(
      configReader.getProjectPath(params.data.project),
    )
    res.json(layouts)
  })

  app.get('/api/projects/:project/layouts/:name', (req, res) => {
    const params = layoutNameSchema.safeParse(req.params)
    if (!params.success) {
      res.status(400).json({ errors: params.message })
      return
    }

    if (!configReader.projectConfigExists(params.data.project)) {
      res.status(404).json({ error: 'Project not found.' })
      return
    }

    try {
      const layout = readProjectLayout(
        configReader.getProjectPath(params.data.project),
        params.data.name,
      )
      res.json({ layout })
    } catch (error) {
      respondWithLayoutStorageError(error, res)
    }
  })

  if (readonly) {
    return
  }

  app.put('/api/projects/:project/layouts/:name', (req, res) => {
    const params = layoutNameSchema.safeParse(req.params)
    if (!params.success) {
      res.status(400).json({ errors: params.message })
      return
    }

    const body = writeProjectLayoutSchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ errors: body.message })
      return
    }

    if (!configReader.projectConfigExists(params.data.project)) {
      res.status(404).json({ error: 'Project not found.' })
      return
    }

    try {
      const layout = writeProjectLayout({
        project: params.data.project,
        projectPath: configReader.getProjectPath(params.data.project),
        name: params.data.name,
        layout: body.data.layout,
        overwrite: body.data.overwrite,
      })
      res.json({ layout })
    } catch (error) {
      respondWithLayoutStorageError(error, res)
    }
  })
}

function respondWithLayoutStorageError(
  error: unknown,
  res: {
    status: (code: number) => {
      json: (body: unknown) => void
    }
  },
) {
  if (!(error instanceof LayoutStorageError)) {
    throw error
  }

  switch (error.code) {
    case 'already-exists':
      res.status(409).json({ error: error.message })
      return
    case 'not-found':
      res.status(404).json({ error: error.message })
      return
    case 'invalid-name':
    case 'invalid-layout':
    case 'project-mismatch':
      res.status(400).json({ error: error.message })
      return
    case 'invalid-json':
      res.status(500).json({ error: error.message })
      return
  }
}
