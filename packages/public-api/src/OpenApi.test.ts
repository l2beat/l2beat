import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import type { Application, Request, Response } from 'express'
import { type BaseOpenApiSchema, OpenApi } from './OpenApi'

describe(OpenApi.name, () => {
  describe('route registration', () => {
    it('registers a simple GET route', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const handler = mockFn().returns(undefined)
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

      openapi.get('/route1', { result: v.string() }, mockFn())
      openapi.get('/route2', { result: v.number() }, mockFn())

      expect(app.get).toHaveBeenCalledTimes(2)
    })
  })

  describe('query validation', () => {
    it('passes valid query parameters to handler', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = mockFn().returns(undefined)

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

      routeHandler(req, res, mockFn())

      expect(handler).toHaveBeenCalledWith(req, res, expect.anything())
      expect(req.params).toEqual({})
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
        mockFn().returns(undefined),
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ query: { page: 'invalid' } })
      const res = mockResponse()

      routeHandler(req, res, mockFn().returns(undefined))

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('sanitizes empty string query parameters', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = mockFn().returns(undefined)

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

      routeHandler(req, res, mockFn())

      expect(handler).toHaveBeenCalled()
      expect(req.query).toEqual({})
    })
  })

  describe('params validation', () => {
    it('passes valid path parameters to handler', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = mockFn().returns(undefined)

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

      routeHandler(req, res, mockFn())

      expect(handler).toHaveBeenCalledWith(req, res, expect.anything())
      expect(req.params).toEqual({ id: 'test-id' })
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
        mockFn(),
      )

      const routeHandler = getRouteHandler(app)
      const req = mockRequest({ params: { id: 'not-a-number' } })
      const res = mockResponse()

      routeHandler(req, res, mockFn())

      expect(res.status).toHaveBeenCalledWith(400)
    })

    it('validates both params and query', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)
      const handler = mockFn().returns(undefined)

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

      routeHandler(req, res, mockFn())

      expect(handler).toHaveBeenCalled()
      expect(req.params).toEqual({ id: 'test-id' })
      expect(req.query).toEqual({ page: '1' })
    })
  })

  describe('OpenAPI schema generation', () => {
    it('generates basic schema structure', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      const schema = openapi.getOpenApiSchema()

      expect(schema).toEqual({
        openapi: '3.0.0',
        info: {
          title: 'L2BEAT API',
          version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:3000' }],
        tags: [
          {
            name: 'projects',
            description: expect.a(String),
          },
        ],
        paths: expect.a(Object),
        components: expect.a(Object),
        security: [{ apiKeyAuth: [] }],
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.paths['/test']).toEqual({
        get: {
          summary: 'Test endpoint',
          description: 'A test endpoint',
          tags: ['projects'],
          parameters: [],
          responses: {
            200: expect.a(Object),
            401: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(Object.keys(schema.paths)).toEqual([
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()
      const parameters = schema.paths['/test']?.get?.parameters

      expect(parameters).toEqual([
        {
          name: 'page',
          in: 'query',
          required: true,
          schema: expect.a(Object),
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()
      const parameters = schema.paths['/users/{id}']?.get?.parameters

      expect(parameters).toEqual([
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()
      const responses = schema.paths['/test']?.get?.responses

      expect(responses).toEqual({
        200: expect.a(Object),
        401: expect.a(Object),
        400: {
          description: expect.a(String),
          content: {
            'application/json': {
              schema: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()
      const responses = schema.paths['/test/{id}']?.get?.responses

      expect(Object.keys(responses ?? {})).toEqual(['200', '401', '404'])
      expect(responses?.[404]).toEqual({
        description: expect.a(String),
        content: {
          'application/json': {
            schema: expect.a(Object),
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

      openapi.get('/users', { result: UserSchema }, mockFn())

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/users']?.get?.responses?.[200]

      expect(schema.components.schemas).toEqual({
        User: expect.a(Object),
      })
      expect(response?.content['application/json'].schema).toEqual({
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

      openapi.get('/items', { result: v.array(ItemSchema) }, mockFn())

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/items']?.get?.responses?.[200]

      expect(response?.content['application/json'].schema).toEqual({
        type: 'array',
        items: {
          $ref: '#/components/schemas/Item',
        },
      })
      expect(schema.components.schemas).toEqual({
        Item: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).toEqual({
        BadRequestResponse: expect.a(Object),
      })
    })

    it('does not include BadRequestResponse when no validation', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get('/test', { result: v.string() }, mockFn())

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).not.toEqual({
        BadRequestResponse: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()

      expect(schema.components.schemas).toEqual({
        CustomError: expect.a(Object),
      })
    })
  })

  describe('edge cases', () => {
    it('handles routes without optional fields', () => {
      const app = mockApp()
      const openapi = new OpenApi(app, baseSchema)

      openapi.get('/minimal', { result: v.string() }, mockFn())

      const schema = openapi.getOpenApiSchema()

      expect(schema.paths['/minimal']?.get).toEqual({
        tags: undefined,
        summary: undefined,
        description: undefined,
        parameters: [],
        responses: {
          200: expect.a(Object),
          401: expect.a(Object),
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
        mockFn(),
      )

      const schema = openapi.getOpenApiSchema()
      const response = schema.paths['/test']?.get?.responses?.[200]

      // Should not have $ref, should be inline
      expect(
        !Object.keys(
          response?.content['application/json'].schema ?? {},
        ).includes('$ref'),
      ).toEqual(true)
      expect(
        Object.keys(
          response?.content['application/json'].schema ?? {},
        ).includes('type'),
      ).toEqual(true)
    })
  })
})

// Helper functions
function mockApp() {
  return mockObject<Application>({
    get: mockFn().returns(undefined),
  })
}

function mockRequest(overrides?: {
  params?: Record<string, string>
  query?: Record<string, string>
}) {
  return mockObject<Request>({
    params: overrides?.params ?? {},
    query: overrides?.query ?? {},
  })
}

function mockResponse() {
  const res = mockObject<Response>({
    status: mockFn().returns(
      mockObject<Response>({ json: mockFn((json) => json) }),
    ),
    json: mockFn((json) => json),
  })
  return res
}

function getRouteHandler(app: Application) {
  const calls = (app.get as ReturnType<typeof mockFn>).calls
  return calls[calls.length - 1]?.args[1]
}

const baseSchema: BaseOpenApiSchema = {
  openapi: '3.0.0' as const,
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
