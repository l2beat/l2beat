import {
  attachPermissions,
  type ConfigReader,
  getReachableEntries,
} from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { Express } from 'express'
import { FlatWorkspace } from '../../xref/FlatWorkspace'
import { contractAt, definitionAt, referencesAt } from './navigation'

const PROJECT_CHARACTERS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'

const paramsSchema = z.object({
  project: z
    .string()
    .check(
      (v) =>
        v.length > 0 && [...v].every((c) => PROJECT_CHARACTERS.includes(c)),
      'Project must be alphanumeric',
    ),
})

const nonNegativeInteger = z
  .string()
  .check(
    (v) => v.length > 0 && [...v].every((c) => c >= '0' && c <= '9'),
    'Must be a non-negative integer',
  )
  .transform((v) => Number(v))

const positionSchema = z.object({
  address: z.string().transform(ChainSpecificAddress),
  source: nonNegativeInteger,
  offset: nonNegativeInteger,
})

// The panel lists only entries reachable from the project, like getProject,
// so answers pointing anywhere else could not be opened.
function selectableWorkspace(configReader: ConfigReader, project: string) {
  const discoveries = configReader.readDiscoveryWithReferences(project)
  attachPermissions(discoveries)
  const entries = discoveries
    .flatMap((d) => d.entries)
    .filter((e) => e.type !== 'Reference')
  const entrypoints = (discoveries[0]?.entries ?? []).map((e) => e.address)
  const reachable = new Set(
    getReachableEntries(entries, entrypoints).map((e) => e.address),
  )
  return FlatWorkspace.fromProject(configReader, project).restrictedTo(
    reachable,
  )
}

export function attachXrefRouter(app: Express, configReader: ConfigReader) {
  const lookups = [
    { path: 'definition', lookup: definitionAt },
    { path: 'references', lookup: referencesAt },
    { path: 'contract-at', lookup: contractAt },
  ]
  for (const { path, lookup } of lookups) {
    app.get(`/api/projects/:project/${path}`, (req, res) => {
      const params = paramsSchema.safeParse(req.params)
      const query = positionSchema.safeParse(req.query)
      if (!params.success || !query.success) {
        res.status(400).json({ errors: 'Invalid position' })
        return
      }
      const { address, source, offset } = query.data
      try {
        const workspace = selectableWorkspace(configReader, params.data.project)
        res.json(lookup(workspace, address, source, offset))
      } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to resolve position' })
      }
    })
  }
}
