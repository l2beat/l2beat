import { expect } from 'earl'
import { CROPS_API_ROUTES, getAttestationsMeta } from './api'
import { buildOpenApiDocument, describeApi } from './openapi'

describe('OpenAPI document', () => {
  const meta = getAttestationsMeta()
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

  it('names the ledger network and warns about a testnet only while on one', () => {
    const testnet = describeApi({
      ...meta,
      network: 'sepolia',
      chainId: 11155111,
      isTestnet: true,
    })
    expect(testnet).toInclude(
      'currently lives on the sepolia testnet (chain id 11155111)',
    )
    const mainnet = describeApi({
      ...meta,
      network: 'ethereum',
      chainId: 1,
      isTestnet: false,
    })
    expect(mainnet).toInclude('lives on ethereum (chain id 1)')
    expect(mainnet).not.toInclude('testnet')
  })
})
