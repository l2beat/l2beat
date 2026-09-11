import { expect } from 'earl'
import { generateCropsSite } from './generateCropsSite'
import {
  buildOpenApiDocument,
  findPublishedRoute,
  PUBLISHED_ROUTES,
} from './openapi'
import { FIXTURE_INPUT } from './test/fixtures'

describe('OpenAPI agreement', () => {
  const files = generateCropsSite(FIXTURE_INPUT)
  const dataFiles = files.filter((x) => x.path !== 'v1/openapi.json')
  const document = buildOpenApiDocument()

  it('parses every generated file with the validator behind its OpenAPI entry', () => {
    for (const file of dataFiles) {
      const route = findPublishedRoute(file.path)
      if (!route) {
        throw new Error(`${file.path} is not published`)
      }
      // Round-tripped through JSON, as a client would see it.
      const result = route.result.safeParse(
        JSON.parse(JSON.stringify(file.body)),
      )
      if (!result.success) {
        throw new Error(`${file.path}: ${result.message}`)
      }
    }
  })

  it('lists every published route under paths, checked route by route', () => {
    expect(Object.keys(document.paths).sort()).toEqual(
      PUBLISHED_ROUTES.map((x) => x.path).sort(),
    )
  })

  it('exercises every route with the fixtures, so no route goes unvalidated', () => {
    const covered = new Set(
      dataFiles.map((x) => findPublishedRoute(x.path)?.path),
    )
    expect([...covered].sort()).toEqual(
      PUBLISHED_ROUTES.map((x) => x.path).sort(),
    )
  })

  it('refers every response to a component schema that exists', () => {
    const schemas = document.components.schemas
    for (const item of Object.values(document.paths)) {
      const ref = item.get.responses[200] as {
        content: { 'application/json': { schema: { $ref: string } } }
      }
      const name = ref.content['application/json'].schema.$ref.replace(
        '#/components/schemas/',
        '',
      )
      expect(schemas[name]).not.toBeNullish()
    }
    expect(JSON.stringify(document)).not.toInclude('#/definitions/')
  })

  it('fills the network section into the prose from openapi.md', () => {
    expect(document.info.description).toInclude('## Attestations are on ')
    expect(document.info.description).not.toInclude('{{')
  })

  it('is OpenAPI 3.1 with production and staging servers', () => {
    expect(document.openapi).toEqual('3.1.0')
    expect(document.servers.map((x) => x.url)).toEqual([
      'https://crops.l2beat.com',
      'https://crops-staging.l2beat.com',
    ])
  })
})
