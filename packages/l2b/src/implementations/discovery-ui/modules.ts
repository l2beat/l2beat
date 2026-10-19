import { type ConfigReader, readJsonc } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { projectParamsSchema } from './main'

const GlobalEntrypoints = z.object({ import: z.array(z.string()) })
const EntrypointsFile = z.object({
  entrypoints: z.record(z.string(), z.unknown()).optional(),
})

const updateEntrypointsSchema = z.object({
  remove: z.array(z.string().transform(ChainSpecificAddress)),
})

// A module is a project whose entrypoints.json is imported by
// globalEntrypoints.jsonc. Discovery only regenerates an existing file and
// keeps vanished contracts as legacy entrypoints, so the UI creates the file
// for a new module and drops the contracts a researcher removed on purpose.
export function attachModulesRouter(
  app: Express,
  configReader: ConfigReader,
  projectsPath: string,
) {
  const globalPath = join(projectsPath, 'globalEntrypoints.jsonc')

  app.post('/api/modules/:project/entrypoints', (req, res) => {
    const params = projectParamsSchema.safeParse(req.params)
    const body = updateEntrypointsSchema.safeParse(req.body)
    if (!params.success || !body.success) {
      res.status(400).json({ error: 'Invalid request' })
      return
    }
    const module = params.data.project
    if (!configReader.projectConfigExists(module)) {
      res.status(400).json({ error: 'Unknown project' })
      return
    }

    const globalEntrypoints = GlobalEntrypoints.parse(readJsonc(globalPath))
    const importPath = `../projects/${module}/entrypoints.json`
    const isRegistered = globalEntrypoints.import.includes(importPath)
    if (!isRegistered && configReader.hasDiscovery(module)) {
      res.status(400).json({ error: 'Project is not a module' })
      return
    }

    const entrypointsPath = join(
      configReader.getProjectPath(module),
      'entrypoints.json',
    )
    const entrypoints = existsSync(entrypointsPath)
      ? (EntrypointsFile.parse(readJsonc(entrypointsPath)).entrypoints ?? {})
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
