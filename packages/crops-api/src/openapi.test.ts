import { expect } from 'earl'
import { CROPS_API_ROUTES } from './api'
import { buildOpenApiDocument, describeApi } from './openapi'
import { ATTESTATIONS } from './test/fixtures'

describe('OpenAPI document', () => {
  const meta = ATTESTATIONS
  const document = buildOpenApiDocument(meta)

  it('lists every published route under paths, checked route by route', () => {
    expect(Object.keys(document.paths).sort()).toEqual(
      CROPS_API_ROUTES.map((x) => x.path).sort(),
    )
  })

  it('refers every response to a component schema that exists, and never to definitions', () => {
    const schemas = document.components.schemas
    for (const item of Object.values(document.paths)) {
      const ref = item.get.responses[200].content['application/json'].schema
      const name = ref.$ref.replace('#/components/schemas/', '')
      expect(schemas[name]).not.toBeNullish()
    }
    expect(JSON.stringify(document)).not.toInclude('#/definitions/')
  })

  it('carries field descriptions into the component schemas, checked on a stamp field', () => {
    const response = document.components.schemas.ProjectResponse as {
      properties: Record<string, { description?: string }>
    }
    expect(response.properties.generatedAt?.description).toEqual(
      'Unix seconds.',
    )
  })

  it('describes a 404 only on the lookup routes, checked against the route table', () => {
    for (const route of CROPS_API_ROUTES) {
      expect(
        document.paths[route.path]?.get.responses[404]?.description,
      ).toEqual(route.notFound)
    }
  })

  it('is OpenAPI 3.1', () => {
    expect(document.openapi).toEqual('3.1.0')
  })

  it('names the attestation network', () => {
    expect(describeApi(meta)).toInclude('lives on ethereum (chain id 1)')
  })
})
