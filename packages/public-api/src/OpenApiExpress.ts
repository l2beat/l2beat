import type { Parser } from '@l2beat/validate'
import { toJsonSchema as _toJsonSchema, v } from '@l2beat/validate'
import type { ImpMeta } from '@l2beat/validate/dist/cjs/validate'
import type { Application, Request, RequestHandler } from 'express'

// biome-ignore lint/suspicious/noExplicitAny: its fine
interface OpenApiRouteOptions<P = any, O = any, B = any, Q = any> {
  params?: Parser<P> & { meta?: ImpMeta }
  query?: Parser<Q>
  body?: Parser<B>
  result: Parser<O>
  // TODO: descriptions, examples, etc...
}

type BadRequestResponse = v.infer<typeof BadRequestResponse>
const BadRequestResponse = v.object({
  path: v.string(),
  error: v.string(),
})

export class OpenApiExpress {
  private routes: {
    path: string
    method: 'get'
    options: OpenApiRouteOptions
  }[] = []

  constructor(private readonly app: Application) {}

  get<TParams, TOutput, TBody, TQuery>(
    path: string,
    options: OpenApiRouteOptions<TParams, TOutput, TBody, TQuery>,
    handler: RequestHandler<
      TParams,
      TOutput | BadRequestResponse,
      TBody,
      TQuery
    >,
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

      if (options.body) {
        const result = options.body.safeParse(req.body)
        if (!result.success) {
          res.status(400).json({
            path: `.body${result.path}`,
            error: result.message,
          })
          return
        }
        Object.defineProperty(req, 'body', { value: result.data })
      }

      return handler(
        req as Request<TParams, TOutput | BadRequestResponse, TBody, TQuery>,
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
      components: {},
      paths: this.getPaths(),
    }
  }

  private getPaths() {
    return this.routes.reduce(
      (acc, route) => {
        acc[this.parsePath(route.path)] = {
          [route.method]: {
            parameters: [
              ...(route.options.params
                ? this.schemaToParams('params', route.options.params)
                : []),
              ...(route.options.query
                ? this.schemaToParams('query', route.options.query)
                : []),
            ],
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: this.toJsonSchema(route.options.result),
                  },
                },
              },
              400: {
                content: {
                  'application/json': {
                    schema: this.toJsonSchema(BadRequestResponse),
                  },
                },
              },
            },
          },
        }
        return acc
      },
      {} as Record<
        string,
        Record<
          string,
          {
            // biome-ignore lint/suspicious/noExplicitAny: will add
            parameters: any[]
            // biome-ignore lint/suspicious/noExplicitAny: will add
            responses: Record<number, any>
          }
        >
      >,
    )
  }

  private schemaToParams<T>(
    type: 'params' | 'query',
    schema: Parser<T> & { meta?: ImpMeta },
  ) {
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
