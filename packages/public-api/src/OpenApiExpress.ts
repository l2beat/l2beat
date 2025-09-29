import type { Parser } from '@l2beat/validate'
import { toJsonSchema as _toJsonSchema, v } from '@l2beat/validate'
import type { ImpMeta } from '@l2beat/validate/dist/cjs/validate'
import type { Application, Request, RequestHandler } from 'express'

type Tags = 'hello' | 'test'

// biome-ignore lint/suspicious/noExplicitAny: its fine
interface OpenApiRouteOptions<P = any, O = any, Q = any> {
  description?: string
  tags?: Tags[]
  params?: Parser<P>
  query?: Parser<Q>
  result: Parser<O>
  // TODO: descriptions, examples, etc...
}

const BadRequestResponse = v.object({
  path: v.string(),
  error: v.string(),
})

type JsonSchema = ReturnType<typeof _toJsonSchema>

type OpenApiPath = {
  description?: string
  tags?: Tags[]
  parameters: OpenApiParameter[]
  responses: Record<number, OpenApiResponse>
}

type OpenApiParameter = {
  name: string
  in: 'query' | 'path'
  required: boolean
  schema: ReturnType<typeof _toJsonSchema>
}

type OpenApiResponse = {
  content: {
    'application/json': {
      description?: string
      schema: JsonSchema
    }
  }
}

interface Route {
  path: string
  method: 'get'
  options: OpenApiRouteOptions
}

export class OpenApiExpress {
  private routes: Route[] = []

  constructor(private readonly app: Application) {}

  get<TParams, TOutput, TQuery>(
    path: string,
    options: OpenApiRouteOptions<TParams, TOutput, TQuery>,
    handler: RequestHandler<TParams, TOutput, unknown, TQuery>,
  ) {
    this.routes.push({ path, method: 'get', options })

    this.app.get(path, (req, res, next) => {
      if (options.params) {
        const result = options.params.safeParse(req.params)
        if (!result.success) {
          res.status(400).json({
            path: `.params${result.path}`,
            error: result.message,
          })
          return
        }
        Object.defineProperty(req, 'params', { value: result.data })
      }

      if (options.query) {
        // Remove '' from query
        const sanitizedQuery = Object.fromEntries(
          Object.entries(req.query).map(([key, value]) => [
            key,
            value || undefined,
          ]),
        )
        const result = options.query.safeParse(sanitizedQuery)
        if (!result.success) {
          res.status(400).json({
            path: `.query${result.path}`,
            error: result.message,
          })
          return
        }
        Object.defineProperty(req, 'query', { value: result.data })
      }

      return handler(
        req as Request<TParams, TOutput, unknown, TQuery>,
        res,
        next,
      )
    })
  }

  getOpenApiSchema() {
    return {
      openapi: '3.2.0',
      info: {
        title: 'Public API',
        version: '1.0.0',
      },
      tags: [
        {
          name: 'hello',
          description: 'Collection of hello worlds',
        },
        {
          name: 'test',
          description: 'Test endpoints',
        },
      ],
      components: {},
      paths: this.getPaths(),
    }
  }

  private getPaths() {
    return this.routes.reduce(
      (acc, route) => {
        const { result: _, params, query, ...rest } = route.options

        acc[this.parsePath(route.path)] = {
          [route.method]: {
            ...rest,
            parameters: [
              ...(params ? this.schemaToParameters('params', params) : []),
              ...(query ? this.schemaToParameters('query', query) : []),
            ],
            responses: this.getResponses(route),
          },
        }
        return acc
      },
      {} as Record<string, Record<string, OpenApiPath>>,
    )
  }

  private getResponses(route: Route): Record<number, OpenApiResponse> {
    const base: Record<number, OpenApiResponse> = {
      200: {
        content: {
          'application/json': {
            schema: this.toJsonSchema(route.options.result),
          },
        },
      },
    }

    if (!!route.options.params || !!route.options.query) {
      base[400] = {
        content: {
          'application/json': {
            schema: this.toJsonSchema(BadRequestResponse),
          },
        },
      }
    }

    return base
  }

  private schemaToParameters<T>(
    type: 'params' | 'query',
    schema: Parser<T> & { meta?: ImpMeta },
  ): OpenApiParameter[] {
    if (!schema.meta) {
      throw new Error('Params meta is required')
    }
    if (schema.meta.type !== 'object') {
      throw new Error('Params must be an object')
    }

    return Object.entries(schema.meta.schema).map(([key, value]) => ({
      name: key,
      in: type === 'query' ? 'query' : 'path',
      required: value.meta.type !== 'optional',
      schema: this.toJsonSchema(value),
    }))
  }

  private parsePath(path: string) {
    return path.replace(/:([^/]+)/g, '{$1}')
  }

  private toJsonSchema<T>(parser: Parser<T>) {
    // @ts-expect-error - it's there
    const { $schema: _, ...rest } = _toJsonSchema(parser)
    return rest
  }
}
