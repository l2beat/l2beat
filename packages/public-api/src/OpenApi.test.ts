import { v } from '@l2beat/validate'
import type { Application, Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { type BaseOpenApiSchema, OpenApi } from './OpenApi'
import { InteropProtocolsResultSchema } from './routes/interop/types'

describe(OpenApi.name, () => {
  describe('route registration', () => {
    it('registers a simple GET route', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const handler = vi.fn().mockReturnValue(undefined)
      openapi.get(
        '/test',
        {
          summary: 'Test endpoint',
          result: v.string(),
        },
        handler,
      )

      expect(app.get).toHaveBeenCalledWith('/test', expect.anything())
    })

    it('registers multiple routes', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get('/route1', { result: v.string() }, vi.fn())
      openapi.get('/route2', { result: v.number() }, vi.fn())

      expect(app.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('query validation', () => {
    it('passes valid query parameters to handler', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = vi.fn().mockReturnValue(undefined)

      const querySchema = v.object({
        page: v.string(),
      })

      openapi.get(
        '/test',
        {
          result: v.string(),
          query: querySchema,
        },
        handler,
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ query: { page: '1' } })
      const res = mockResponse()

      routeHandler(req, res, vi.fn())

      expect(handler).toHaveBeenCalledWith(req, res, expect.anything())
      expect(req.params).toStrictEqual({})
    })

    it('returns 400 for invalid query parameters', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const querySchema = v.object({
        page: v.number(),
      })

      openapi.get(
        '/test',
        {
          result: v.string(),
          query: querySchema,
        },
        vi.fn().mockReturnValue(undefined),
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ query: { page: 'invalid' } })
      const res = mockResponse()

      routeHandler(req, res, vi.fn().mockReturnValue(undefined))

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('sanitizes empty string query parameters', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = vi.fn().mockReturnValue(undefined)

      const querySchema = v.object({
        filter: v.string().optional(),
      })

      openapi.get(
        '/test',
        {
          result: v.string(),
          query: querySchema,
        },
        handler,
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ query: { filter: '' } })
      const res = mockResponse()

      routeHandler(req, res, vi.fn())

      expect(handler).toHaveBeenCalled()
      expect(req.query).toStrictEqual({})
    })
  })

  describe('params validation', () => {
    it('passes valid path parameters to handler', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = vi.fn().mockReturnValue(undefined)

      const paramsSchema = v.object({
        id: v.string(),
      })

      openapi.get(
        '/test/:id',
        {
          result: v.string(),
          params: paramsSchema,
        },
        handler,
      )

      const routeHandler = getRouteHandler(app)

      const req = mockRequest({ params: { id: 'test-id' } })
      const res = mockResponse()

      routeHandler(req, res, vi.fn())

      expect(handler).toHaveBeenCalledWith(req, res, expect.anything())
      expect(req.params).toStrictEqual({ id: 'test-id' })
    })

    it('returns 400 for invalid path parameters', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const paramsSchema = v.object({
        id: v.number(),
      })

      openapi.get(
        '/test/:id',
        {
          result: v.string(),
          params: paramsSchema,
        },
        vi.fn(),
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ params: { id: 'not-a-number' } })
      const res = mockResponse()

      routeHandler(req, res, vi.fn())

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('validates both params and query', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = vi.fn().mockReturnValue(undefined)

      openapi.get(
        '/test/:id',
        {
          result: v.string(),
          params: v.object({ id: v.string() }),
          query: v.object({ page: v.string() }),
        },
        handler,
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({
        params: { id: 'test-id' },
        query: { page: '1' },
      })
      const res = mockResponse()

      routeHandler(req, res, vi.fn())

      expect(handler).toHaveBeenCalled()
      expect(req.params).toStrictEqual({ id: 'test-id' })
      expect(req.query).toStrictEqual({ page: '1' })
    })
  })

  describe('OpenAPI schema generation', () => {
    it('generates basic schema structure', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const schema = openapi.getOpenApiSchema()

      expect(schema).toStrictEqual({
        openapi: '3.1.0',
        info: {
          title: 'L2BEAT API',
          version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
        tags: [
          {
            name: 'projects',
            description: expect.any(String),
          },
        ],
        paths: expect.any(Object),
        components: expect.any(Object),
        security: [{ apiKeyAuth: [] }],
        externalDocs: {
          description: 'Changelog',
          url: 'external-docs-url',
        },
      })
    })

    it('includes route in paths', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/test',
        {
          summary: 'Test endpoint',
          description: 'A test endpoint',
          tags: ['projects'],
          result: v.string(),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.paths['/test']).toStrictEqual({
        get: {
          summary: 'Test endpoint',
          description: 'A test endpoint',
          tags: ['projects'],
          parameters: [],
          responses: {
            200: expect.any(Object),
            401: expect.any(Object),
          },
        },
      })
    })

    it('converts Express path params to OpenAPI format', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/users/:userId/posts/:postId',
        {
          result: v.string(),
          params: v.object({
            userId: v.string(),
            postId: v.string(),
          }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(Object.keys(schema.paths)).toStrictEqual([
        '/users/{userId}/posts/{postId}',
      ])
    })

    it('includes query parameters in schema', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/test',
        {
          result: v.string(),
          query: v.object({
            page: v.string(),
            limit: v.number().optional(),
          }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const parameters = schema.paths['/test']?.get?.parameters

      expect(parameters).toStrictEqual([
        {
          name: 'page',
          in: 'query',
          required: true,
          schema: expect.any(Object),
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: expect.any(Object),
        },
      ])
    })

    it('includes path parameters in schema', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/users/:id',
        {
          result: v.string(),
          params: v.object({
            id: v.string(),
          }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const parameters = schema.paths['/users/{id}']?.get?.parameters

      expect(parameters).toStrictEqual([
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: expect.any(Object),
        },
      ])
    })

    it('includes 400 response when params or query are present', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/test',
        {
          result: v.string(),
          query: v.object({ page: v.string() }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const responses = schema.paths['/test']?.get?.responses

      expect(responses).toStrictEqual({
        200: expect.any(Object),
        401: expect.any(Object),
        400: {
          description: expect.any(String),
          content: {
            'application/json': {
              schema: expect.any(Object),
            },
          },
        },
      })
    })

    it('includes custom error responses', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const NotFoundError = v
        .object({
          message: v.string(),
        })
        .describe('NotFoundError')

      openapi.get(
        '/test/:id',
        {
          result: v.string(),
          errors: {
            404: NotFoundError,
          },
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const responses = schema.paths['/test/{id}']?.get?.responses

      expect(Object.keys(responses ?? {})).toStrictEqual(['200', '401', '404'])
      expect(responses?.[404]).toStrictEqual({
        description: expect.any(String),
        content: {
          'application/json': {
            schema: expect.any(Object),
          },
        },
      })
    })
  })

  describe('components schemas', () => {
    it('includes described schemas in components and references them', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const UserSchema = v
        .object({
          id: v.string(),
          name: v.string(),
        })
        .describe('User')

      openapi.get('/users', { result: UserSchema }, vi.fn())

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/users']?.get?.responses?.[200]

      expect(schema.components.schemas).toStrictEqual({
        User: expect.any(Object),
      })
      expect(response?.content['application/json'].schema).toStrictEqual({
        $ref: '#/components/schemas/User',
      })
    })

    it('handles array responses with described elements and references them', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const ItemSchema = v
        .object({
          id: v.string(),
        })
        .describe('Item')

      openapi.get('/items', { result: v.array(ItemSchema) }, vi.fn())

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/items']?.get?.responses?.[200]

      expect(response?.content['application/json'].schema).toStrictEqual({
        type: 'array',
        items: {
          $ref: '#/components/schemas/Item',
        },
      })
      expect(schema.components.schemas).toStrictEqual({
        Item: expect.any(Object),
      })
    })

    it('includes BadRequestResponse when validation is present', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/test',
        {
          result: v.string(),
          params: v.object({ id: v.string() }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).toStrictEqual({
        BadRequestResponse: expect.any(Object),
      })
    })

    it('does not include BadRequestResponse when no validation', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get('/test', { result: v.string() }, vi.fn())

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).not.toStrictEqual({
        BadRequestResponse: expect.any(Object),
      })
    })

    it('includes error schemas in components', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const CustomError = v
        .object({
          code: v.string(),
          details: v.string(),
        })
        .describe('CustomError')

      openapi.get(
        '/test',
        {
          result: v.string(),
          errors: {
            500: CustomError,
          },
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).toStrictEqual({
        CustomError: expect.any(Object),
      })
    })

    it('includes documented properties in component schemas', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/interop/protocols',
        { result: InteropProtocolsResultSchema },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const interopProtocolSchema = schema.components.schemas
        .InteropProtocol as { properties?: Record<string, unknown> }

      expect(interopProtocolSchema.properties?.subgroupId).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        description:
          'ID of the aggregate/root interop protocol this protocol belongs to. Null for aggregate/root protocols.',
      })
    })
  })

  describe('edge cases', () => {
    it('handles routes without optional fields', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get('/minimal', { result: v.string() }, vi.fn())

      const schema = openapi.getOpenApiSchema()

      expect(schema.paths['/minimal']?.get).toStrictEqual({
        tags: undefined,
        summary: undefined,
        description: undefined,
        parameters: [],
        responses: {
          200: expect.any(Object),
          401: expect.any(Object),
        },
      })
    })

    it('handles inline schemas without descriptions', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get(
        '/test',
        {
          result: v.object({
            value: v.string(),
          }),
        },
        vi.fn(),
      )

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/test']?.get?.responses?.[200]

      // Should not have $ref, should be inline
      expect(
        !Object.keys(
          response?.content['application/json'].schema ?? {},
        ).includes('$ref'),
      ).toStrictEqual(true)
      expect(
        Object.keys(
          response?.content['application/json'].schema ?? {},
        ).includes('type'),
      ).toStrictEqual(true)
    })
  })
})

// Helper functions
function mockApp() {
  return {
    get: vi.fn().mockReturnValue(undefined),
  } as unknown as Application
}

function mockRequest(overrides?: {
  params?: Record<string, string>
  query?: Record<string, string>
}) {
  return {
    params: overrides?.params ?? {},
    query: overrides?.query ?? {},
  } as unknown as Request
}

function mockResponse() {
  const res = {
    status: vi
      .fn()
      .mockReturnValue({ json: vi.fn((json) => json) } as unknown as Response),
    json: vi.fn((json) => json),
  } as unknown as Response
  return res
}

function getRouteHandler(app: Application) {
  const calls = (app.get as ReturnType<typeof vi.fn>).mock.calls
  return calls[calls.length - 1]?.[1]
}

const baseSchema: BaseOpenApiSchema = {
  openapi: '3.1.0' as const,
  info: {
    title: 'L2BEAT API',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    {
      name: 'projects' as const,
      description:
        'Endpoints for listing projects and retrieving detailed information about individual projects.',
    },
  ],
  externalDocs: {
    description: 'Changelog',
    url: 'external-docs-url',
  },
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'query',
        name: 'apiKey',
      },
    },
  },
  security: [{ apiKeyAuth: [] }],
}
