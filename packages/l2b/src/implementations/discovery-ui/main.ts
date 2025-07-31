import {
  ConfigReader,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import express from 'express'
import type { Server } from 'http'
import path, { join } from 'path'
import { DiffoveryController } from './diffovery/DiffoveryController'
import { attachDiffoveryRouter } from './diffovery/router'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode, getCodePaths } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'
import { searchCode } from './searchCode'
import {
  attachTemplateRouter,
  listTemplateFilesSchema,
} from './templates/router'

const safeStringSchema = z
  .string()
  .check(
    (v) => v.length > 0 && /^[a-zA-Z0-9_-]+$/.test(v),
    'Input cannot be empty and must be alphanumeric and can contain underscores or hyphens.',
  )

const ethereumAddressSchema = z.string().transform(ChainSpecificAddress)

const projectParamsSchema = z.object({
  project: safeStringSchema,
})

const projectAddressParamsSchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
})

const projectSearchTermParamsSchema = z.object({
  project: safeStringSchema,
  searchTerm: z.string(),
  address: ethereumAddressSchema.optional(),
})

const discoverQuerySchema = z.object({
  project: safeStringSchema,
  chain: safeStringSchema,
  devMode: z.enum(['true', 'false']).transform((val) => val === 'true'),
})

const matchFlatQuerySchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
  against: z.enum(['templates', 'projects']),
})

export function runDiscoveryUi({ readonly }: { readonly: boolean }) {
  const app = express()
  const port = process.env.PORT ?? 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const templateService = new TemplateService(paths.discovery)
  const diffoveryController = new DiffoveryController()

  app.use(express.json())

  app.get('/api/projects', (_req, res) => {
    const response = getProjects(configReader, readonly)
    res.json(response)
  })

  app.get('/api/projects/:project', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    const response = getProject(configReader, templateService, project)
    res.json(response)
  })

  app.get('/api/projects/:project/preview', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    const response = getPreview(configReader, project)
    res.json(response)
  })

  app.get('/api/projects/:project/code/:address', (req, res) => {
    const paramsValidation = projectAddressParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project, address } = paramsValidation.data

    const checkFlatCode = readonly === false
    const response = getCode(
      paths,
      configReader,
      project,
      address,
      checkFlatCode,
    )
    res.json(response)
  })

  app.get('/api/template-files', (req, res) => {
    const query = listTemplateFilesSchema.safeParse(req.query)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
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

  app.use(express.static(STATIC_ROOT))

  attachDiffoveryRouter(app, diffoveryController)

  if (!readonly) {
    attachTemplateRouter(app, templateService)

    app.get('/api/projects/:project/codeSearch', (req, res) => {
      const paramsValidation = projectSearchTermParamsSchema.safeParse({
        project: req.params.project,
        searchTerm: req.query.searchTerm,
        address: req.query.address,
      })

      if (!paramsValidation.success) {
        res.status(400).json({ errors: paramsValidation.message })
        return
      }
      const { project, searchTerm, address } = paramsValidation.data

      const response = searchCode(
        paths,
        configReader,
        project,
        searchTerm,
        address,
      )
      res.json(response)
    })

    app.get('/api/terminal/discover', (req, res) => {
      const queryValidation = discoverQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project, chain, devMode } = queryValidation.data

      executeTerminalCommand(
        `l2b discover ${chain} ${project} ${devMode ? '--dev' : ''}`,
        res,
      )
    })

    app.get('/api/terminal/match-flat', (req, res) => {
      const queryValidation = matchFlatQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project, address, against } = queryValidation.data

      const { codePaths } = getCodePaths(paths, configReader, project, address)
      const implementationPath =
        codePaths.length > 1 ? codePaths[1].path : codePaths[0].path
      const againstPath =
        against === 'templates' ? './projects/_templates/' : './projects/'

      executeTerminalCommand(
        `cd ${path.dirname(
          paths.discovery,
        )} && l2b match-flat file "${implementationPath}" "${againstPath}"`,
        res,
      )
    })

    app.get('/api/terminal/download-all-shapes', (_req, res) => {
      executeTerminalCommand(
        `cd ${path.dirname(paths.discovery)}/../ && l2b download-all-shapes`,
        res,
      )
    })
  }

  app.get('*', (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  const server = app.listen(port, () => {
    console.log(`Discovery UI live on http://localhost:${port}/ui`)
  })

  attachGracefulShutdown(server)
}

function shutdown(server: Server) {
  server.close(() => {
    process.exit(0)
  })

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    )
    process.exit(1)
  }, 10000)
}

function attachGracefulShutdown(server: Server) {
  process.on('SIGTERM', () => shutdown(server))
  process.on('SIGINT', () => shutdown(server))
}
