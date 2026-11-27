import type { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import express from 'express'
import { OpenApi } from './OpenApi'
import { addActivityRoutes } from './routes/activity/routes'
import { addInteropRoutes } from './routes/interop/routes'
import { addProjectsRoutes } from './routes/projects/routes'
import { addTvsRoutes } from './routes/tvs/routes'

// Why: people generate API clients from /openapi. A generator names each
// method after its operationId and types a field by its `type`, so a
// duplicate id drops a method and an enum without a type becomes `any`.
// How: the spec of the real routes, registered on an app that never serves.
describe('the published OpenAPI spec', () => {
  const openapi = new OpenApi(express(), {} as never)
  const ps = mockObject<ProjectService>()
  const db = mockObject<Database>()
  const cache = mockObject<InMemoryCache>()
  addProjectsRoutes(openapi, ps, db, cache)
  addTvsRoutes(openapi, ps, db, cache)
  addActivityRoutes(openapi, ps, db, cache)
  addInteropRoutes(openapi, ps, db, cache)
  const spec = openapi.getOpenApiSchema()

  it('gives every operation its own operationId', () => {
    const ids = Object.values(spec.paths).map((path) => path.get?.operationId)

    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toEqual(ids.length)
  })

  it('gives every enum a type', () => {
    const untyped = findEnums(spec).filter((node) => node.type === undefined)

    expect(findEnums(spec).length).toBeGreaterThan(0)
    expect(untyped).toEqual([])
  })
})

function findEnums(node: unknown): Record<string, unknown>[] {
  if (typeof node !== 'object' || node === null) {
    return []
  }
  const nested = Object.values(node).flatMap(findEnums)
  return 'enum' in node ? [node as Record<string, unknown>, ...nested] : nested
}
