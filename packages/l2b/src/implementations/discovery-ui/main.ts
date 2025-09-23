import {
  ConfigReader,
  ConfigWriter,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import express from 'express'
import type { Server } from 'http'
import path, { join } from 'path'
import { attachConfigRouter } from './configs/router'
import { DiffoveryController } from './diffovery/DiffoveryController'
import { attachDiffoveryRouter } from './diffovery/router'
import { executeTerminalCommand } from './executeTerminalCommand'
import { getCode, getCodePaths } from './getCode'
import { getPreview } from './getPreview'
import { getProject } from './getProject'
import { getProjects } from './getProjects'
import { searchCode } from './searchCode'
import {
  getPermissionOverrides,
  updatePermissionOverride,
  resolveOwnersFromDiscovered,
} from './defidisco/permissionOverrides'
import {
  getContractTags,
  updateContractTag,
} from './defidisco/contractTags'
import { generatePermissionsReport } from './defidisco/generatePermissionsReport'
import { filterDefiProjects } from './defidisco/defiProjectFilter'
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

export const projectParamsSchema = z.object({
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
  devMode: z.enum(['true', 'false']).transform((val) => val === 'true'),
})

const matchFlatQuerySchema = z.object({
  project: safeStringSchema,
  address: ethereumAddressSchema,
  against: z.enum(['templates', 'projects']),
})

const findMintersSchema = z.object({
  address: ethereumAddressSchema,
})

export function runDiscoveryUi({ readonly }: { readonly: boolean }) {
  const app = express()
  const port = process.env.PORT ?? 2021

  const STATIC_ROOT = join(__dirname, '../../../../protocolbeat/build')

  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)
  const configWriter = new ConfigWriter(configReader)
  const templateService = new TemplateService(paths.discovery)
  const diffoveryController = new DiffoveryController()

  app.use(express.json())

  app.get('/api/projects', (_req, res) => {
    const allProjects = getProjects(configReader, readonly)
    const defiProjects = filterDefiProjects(allProjects, 'name')
    res.json(defiProjects)
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

  app.get('/api/config-files/:project', (req, res) => {
    const query = projectParamsSchema.safeParse(req.params)

    if (!query.success) {
      res.status(400).json({ errors: query.message })
      return
    }

    const config: string = configReader.readRawConfigAsText(query.data.project)

    res.json({
      config,
    })
  })

  app.get('/api/projects/:project/permission-overrides', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getPermissionOverrides(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading permission overrides:', error)
      res.status(500).json({ error: 'Failed to load permission overrides' })
    }
  })

  app.put('/api/projects/:project/permission-overrides', (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      updatePermissionOverride(paths, project, req.body)
      res.json({ success: true })
    } catch (error) {
      console.error('Error updating permission overrides:', error)
      res.status(500).json({ error: 'Failed to update permission overrides' })
    }
  })

  // Owner resolution endpoints - using already discovered data
  app.post('/api/projects/:project/resolve-owners', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const { ownerDefinitions } = req.body

      if (!ownerDefinitions || !Array.isArray(ownerDefinitions)) {
        res.status(400).json({ error: 'ownerDefinitions array is required' })
        return
      }

      // Resolve owner definitions using discovered data
      const resolved = resolveOwnersFromDiscovered(paths, project, ownerDefinitions)
      res.json({ resolved })
    } catch (error) {
      console.error('Error resolving owners:', error)
      res.status(500).json({
        error: 'Failed to resolve owners',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  })

  // Contract tags endpoints
  app.get('/api/projects/:project/contract-tags', (req, res) => {
    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      const response = getContractTags(paths, project)
      res.json(response)
    } catch (error) {
      console.error('Error loading contract tags:', error)
      res.status(500).json({ error: 'Failed to load contract tags' })
    }
  })

  app.put('/api/projects/:project/contract-tags', (req, res) => {
    if (readonly) {
      res.status(403).json({ error: 'Server is in readonly mode' })
      return
    }

    const paramsValidation = projectParamsSchema.safeParse(req.params)
    if (!paramsValidation.success) {
      res.status(400).json({ errors: paramsValidation.message })
      return
    }
    const { project } = paramsValidation.data

    try {
      updateContractTag(paths, project, req.body)
      res.json({ success: true })
    } catch (error) {
      console.error('Error updating contract tags:', error)
      res.status(500).json({ error: 'Failed to update contract tags' })
    }
  })

  app.use(express.static(STATIC_ROOT))

  attachDiffoveryRouter(app, diffoveryController)

  if (!readonly) {
    attachTemplateRouter(app, templateService)
    attachConfigRouter(app, configWriter)

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
      const { project, devMode } = queryValidation.data

      executeTerminalCommand(
        `l2b discover ${project} ${devMode ? '--dev' : ''}`,
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

    app.get('/api/terminal/find-minters', (req, res) => {
      const queryValidation = findMintersSchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { address } = queryValidation.data

      executeTerminalCommand(
        `cd ${path.dirname(paths.discovery)}/../../backend && l2b minters ${address}`,
        res,
      )
    })

    app.get('/api/terminal/generate-permissions-report', (req, res) => {
      const queryValidation = projectParamsSchema.safeParse(req.query)
      if (!queryValidation.success) {
        res.status(400).json({ errors: queryValidation.message })
        return
      }
      const { project } = queryValidation.data

      // Set up Server-Sent Events headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      })

      try {
        const result = generatePermissionsReport(paths, project)
        res.write(`data: ${result.replace(/\n/g, '\\n')}\n\n`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        res.write(`data: Error generating permissions report: ${errorMessage}\\n\n\n`)
      }

      res.end()
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
