import type {
  ConfigReader,
  ConfigWriter,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { projectParamsSchema } from '../main'
import {
  ensureProjectEntrypointsImport,
  ensureProjectSharedModule,
  validateEntrypointsFileContent,
} from './entrypointsFile'

const updateEntrypointsFileSchema = z.object({
  content: z.string(),
  linkConsumerProject: z.string().optional(),
})

const updateConfigFileSchema = z.object({
  content: z.string(),
})

const createConfigFileSchema = z.object({
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
  templateService: TemplateService,
) {
  app.get('/api/entrypoints-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    const projectPath = configReader.getProjectPath(query.data.project)
    const filePath = join(projectPath, 'entrypoints.json')
    if (!existsSync(filePath)) {
      res.json({ content: '', exists: false })
      return
    }

    res.json({
      content: readFileSync(filePath, 'utf-8'),
      exists: true,
    })
  })

  app.put('/api/entrypoints-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)
    const data = updateEntrypointsFileSchema.safeParse(req.body)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    if (!data.success) {
      res.status(400).json({ errors: data.message })
      return
    }

    const validation = validateEntrypointsFileContent(data.data.content)
    if (!validation.success) {
      res.status(400).json({ errors: validation.message })
      return
    }

    const moduleProject = query.data.project
    const projectPath = configReader.getProjectPath(moduleProject)
    mkdirSync(projectPath, { recursive: true })
    const filePath = join(projectPath, 'entrypoints.json')
    writeFileSync(filePath, data.data.content)

    const importAdded = ensureProjectEntrypointsImport(
      configReader,
      configWriter,
      moduleProject,
    )
    const sharedModuleLinked =
      data.data.linkConsumerProject !== undefined
        ? ensureProjectSharedModule(
            configReader,
            configWriter,
            data.data.linkConsumerProject,
            moduleProject,
          )
        : false
    configReader.clearImportedCache()
    templateService.reload()

    res.json({ success: true, importAdded, sharedModuleLinked })
  })

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
    templateService.reload()

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

    configWriter.createProjectConfigFile(body.data.project, templateValues)

    res.json({ success: true })
  })
}
