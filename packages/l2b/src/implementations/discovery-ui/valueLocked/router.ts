import type { ConfigReader } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { Express } from 'express'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
  mergeValueLockedResults,
  ValueLockedNotConfiguredError,
  type ValueLockedResult,
  type ValueLockedService,
} from './ValueLockedService'

const FILE_NAME = 'valueLocked.json'

const projectSchema = v
  .string()
  .check(
    (value) => value.length > 0 && /^[a-zA-Z0-9_-]+$/.test(value),
    'Project must be non-empty and alphanumeric (underscores/hyphens allowed).',
  )

const fetchBodySchema = v.object({
  addresses: v.array(v.string()),
  // When true, merge into the existing file instead of overwriting it (used by
  // "Fetch tokens" for a single contract). "Fetch all" omits it to replace.
  merge: v.boolean().optional(),
})

const EMPTY_RESULT: ValueLockedResult = { fetchedAt: 0, tokens: [] }

function getFilePath(configReader: ConfigReader, project: string): string {
  return join(configReader.getProjectPath(project), FILE_NAME)
}

function readExisting(filePath: string): ValueLockedResult {
  if (!existsSync(filePath)) {
    return EMPTY_RESULT
  }
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as ValueLockedResult
  } catch {
    return EMPTY_RESULT
  }
}

export function attachValueLockedRouter(
  app: Express,
  configReader: ConfigReader,
  service: ValueLockedService,
) {
  // Last persisted result for the project (empty if never fetched).
  app.get('/api/projects/:project/value-locked', (req, res) => {
    const project = projectSchema.safeParse(req.params.project)
    if (!project.success) {
      res.status(400).json({ errors: project.message })
      return
    }

    const filePath = getFilePath(configReader, project.data)
    if (!existsSync(filePath)) {
      res.json(EMPTY_RESULT)
      return
    }
    res.json(JSON.parse(readFileSync(filePath, 'utf-8')))
  })

  // Fetch balances for the given holders, persist, and return the result.
  app.post('/api/projects/:project/value-locked', async (req, res) => {
    const project = projectSchema.safeParse(req.params.project)
    if (!project.success) {
      res.status(400).json({ errors: project.message })
      return
    }
    const body = fetchBodySchema.safeParse(req.body)
    if (!body.success) {
      res.status(400).json({ errors: body.message })
      return
    }

    if (!service.isConfigured()) {
      res
        .status(503)
        .json({ error: new ValueLockedNotConfiguredError().message })
      return
    }

    let holders: ChainSpecificAddress[]
    try {
      holders = body.data.addresses.map((a) => ChainSpecificAddress(a))
    } catch (error) {
      res.status(400).json({ error: errorMessage(error) })
      return
    }

    try {
      const filePath = getFilePath(configReader, project.data)
      const fresh = await service.fetch(holders)
      const result = body.data.merge
        ? mergeValueLockedResults(readExisting(filePath), fresh)
        : fresh
      writeFileSync(filePath, JSON.stringify(result, null, 2))
      res.json(result)
    } catch (error) {
      if (error instanceof ValueLockedNotConfiguredError) {
        res.status(503).json({ error: error.message })
        return
      }
      console.error('[value-locked] fetch failed:', error)
      res.status(500).json({ error: errorMessage(error) })
    }
  })
}

function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }
  if (error.message) {
    return error.message
  }
  // AggregateError (e.g. failed DB connection) has an empty message; surface the
  // underlying causes / error code instead so the UI shows something useful.
  const nested = (error as { errors?: unknown[] }).errors
  if (Array.isArray(nested) && nested.length > 0) {
    return nested
      .map((e) => (e instanceof Error ? e.message : String(e)))
      .join('; ')
  }
  const code = (error as { code?: string }).code
  return code ? `${error.name}: ${code}` : error.name
}
