import type { Server } from 'http'
import path, { join } from 'path'
import {
  ConfigReader,
  TemplateService,
  getDiscoveryPaths,
} from '@l2beat/discovery'
import express from 'express'
import { z } from 'zod'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode, getCodePaths } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'
import { searchCode } from './searchCode'
import { attachTemplateRouter } from './templates/router'

const safeStringSchema = z
  .string()
  .min(1, { message: 'Input cannot be empty.' })
  .regex(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Input must be alphanumeric and can contain underscores or hyphens.',
  })

const ethereumAddressSchema = z.string().regex(/^[\w\d]+:0x[a-fA-F0-9]{40}$/, {
  message: 'Invalid address format. Must be chainId:0x...',
})

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
})

const discoverQuerySchema = z.object({
  project: safeStringSchema,
  chain: safeStringSchema,
  devMode: z
    .enum(['true', 'false'], {
      errorMap: () => ({ message: "devMode must be 'true' or 'false'." }),
    })
    .transform((val) => val === 'true'),
})

const matchFlatQuerySchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
  against: z.enum(['templates', 'projects'], {
    errorMap: () => ({ message: "against must be 'templates' or 'projects'." }),
  }),
})

export function runDiscoveryUi({ readonly }: { readonly: boolean }) {
  const app = express()
  const port = process.env.PORT ?? 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const templateService = new TemplateService(paths.discovery)

  app.use(express.json())

  app.get('/api/projects', (_req, res) => {
    const response = getProjects(configReader)
    res.json(response)
  })

  app.get('/api/projects/:project', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.error.flatten() })
      return
    }
    const { project } = paramsValidation.data

    const response = getProject(configReader, templateService, project)
    res.json(response)
  })

  app.get('/api/projects/:project/preview', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.error.flatten() })
      return
    }
    const { project } = paramsValidation.data

    const response = getPreview(configReader, project)
    res.json(response)
  })

  app.get('/', (_req, res) => {
    res.redirect('/ui')
  })

  app.get(['/ui', '/ui/*'], (_req, res) => {
    res.sendFile(join(STATIC_ROOT, 'index.html'))
  })

  app.get('/api/projects/:project/code/:address', (req, res) => {
    const paramsValidation = projectAddressParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.error.flatten() })
      return
    }
    const { project, address } = paramsValidation.data

    const response = getCode(paths, configReader, project, address)
    res.json(response)
  })

  attachTemplateRouter(app, templateService)

  app.use(express.static(STATIC_ROOT))

  if (!readonly) {
    app.get('/api/projects/:project/codeSearch/:searchTerm', (req, res) => {
      const paramsValidation = projectSearchTermParamsSchema.safeParse(
        req.params,
      )
      if (!paramsValidation.success) {
        res.status(400).json({ errors: paramsValidation.error.flatten() })
        return
      }
      const { project, searchTerm } = paramsValidation.data

      const response = searchCode(paths, configReader, project, searchTerm)
      res.json(response)
    })

    app.get('/api/terminal/discover', (req, res) => {
      const queryValidation = discoverQuerySchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.error.flatten() })
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
        res.status(400).json({ errors: queryValidation.error.flatten() })
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
  }

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
