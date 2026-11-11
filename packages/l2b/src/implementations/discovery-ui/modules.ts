import {
  ConfigReader,
  readJsonc,
  type TemplateService,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { existsSync, writeFileSync } from 'fs'
import { basename, dirname, join } from 'path'
import { projectParamsSchema } from './main'

const GlobalEntrypoints = z.object({ import: z.array(z.string()) })
const EntrypointsFile = z.object({
  entrypoints: z.record(z.string(), z.unknown()).optional(),
})

const updateEntrypointsSchema = z.object({
  create: z.boolean(),
  remove: z.array(z.string().transform(ChainSpecificAddress)),
})

export function attachModulesRouter(
  app: Express,
  configReader: ConfigReader,
  templateService: TemplateService,
  projectsPath: string,
) {
  const globalPath = join(projectsPath, 'globalEntrypoints.jsonc')
  const readGlobalEntrypoints = () =>
    GlobalEntrypoints.parse(readJsonc(globalPath))

  app.get('/api/modules', (_req, res) => {
    res.json(
      readGlobalEntrypoints().import.map((path) => basename(dirname(path))),
    )
  })

  // A fresh reader: the shared one caches the entrypoints discovery rewrote.
  app.get('/api/modules/stale-consumers', (_req, res) => {
    const reader = new ConfigReader(projectsPath)
    const stale = reader
      .readAllDiscoveredProjects()
      .filter((project) =>
        templateService
          .discoveryNeedsRefresh(
            reader.readDiscovery(project),
            reader.readConfig(project),
          )
          .some((reason) => reason.type === 'ENTRYPOINTS_CHANGED'),
      )
    res.json(stale)
  })

  app.post('/api/modules/:project/entrypoints', (req, res) => {
    const params = projectParamsSchema.safeParse(req.params)
    const body = updateEntrypointsSchema.safeParse(req.body)
    if (!params.success || !body.success) {
      res.status(400).json({ error: 'Invalid request' })
      return
    }
    const module = params.data.project
    const globalEntrypoints = readGlobalEntrypoints()
    const importPath = `../projects/${module}/entrypoints.json`
    const isRegistered = globalEntrypoints.import.includes(importPath)
    const canBecomeModule =
      body.data.create && !configReader.hasDiscovery(module)
    if (!isRegistered && !canBecomeModule) {
      res.status(400).json({ error: 'Project is not a module' })
      return
    }

    const entrypointsPath = join(
      configReader.getProjectPath(module),
      'entrypoints.json',
    )
    const { entrypoints = {} } = existsSync(entrypointsPath)
      ? EntrypointsFile.parse(readJsonc(entrypointsPath))
      : {}
    for (const address of body.data.remove) {
      delete entrypoints[address]
    }
    writeJson(entrypointsPath, { entrypoints })

    if (!isRegistered) {
      globalEntrypoints.import.push(importPath)
      writeJson(globalPath, globalEntrypoints)
    }
    res.json({ success: true })
  })
}

function writeJson(path: string, value: unknown) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`)
}
