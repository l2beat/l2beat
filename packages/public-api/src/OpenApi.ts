import { toJsonSchema as _toJsonSchema, v } from '@l2beat/validate'
import type { ImpMeta, Validator } from '@l2beat/validate/dist/cjs/validate'
import type { Application, Request, RequestHandler } from 'express'

// biome-ignore lint/suspicious/noExplicitAny: its fine
interface OpenApiRouteOptions<P = any, O = any, Q = any> {
  description?: string
  tags?: Tags[]
  params?: Validator<P> & { meta?: ImpMeta }
  query?: Validator<Q> & { meta?: ImpMeta }
  result: Validator<O> & { meta?: ImpMeta }
}

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
  description: string
  content: {
    'application/json': {
      schema: JsonSchema
    }
  }
}

type Tags = 'Projects'

const BadRequestResponse = v
  .object({
    path: v.string(),
    error: v.string(),
  })
  .describe('BadRequestResponse')

type JsonSchema = ReturnType<typeof _toJsonSchema>

interface Route {
  path: string
  method: 'get'
  options: OpenApiRouteOptions
}

export class OpenApi {
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
      openapi: '3.1.0',
      info: {
        title: 'L2BEAT API',
        version: '1.0.0',
      },
      tags: [
        {
          name: 'Projects',
          description: 'Project endpoints',
        },
      ] satisfies { name: Tags; description: string }[],
      paths: this.getPaths(),
      components: this.getComponents(),
    }
  }

  private getComponents() {
    const schemas = {} as Record<string, JsonSchema>
    for (const route of this.routes) {
      const { result, params, query } = route.options
      if (
        result.meta?.type === 'array' &&
        result.meta.element.description &&
        !schemas[result.meta.element.description]
      ) {
        schemas[result.meta.element.description] = this.toJsonSchema(
          result.meta.element,
        )
      }
      if (result.description && !schemas[result.description]) {
        schemas[result.description] = this.toJsonSchema(result)
      }
      if (params && params.description && !schemas[params.description]) {
        schemas[params.description] = this.toJsonSchema(params)
      }
      if (query && query.description && !schemas[query.description]) {
        schemas[query.description] = this.toJsonSchema(query)
      }
    }

    if (
      this.routes.some(
        (route) => !!route.options.params || !!route.options.query,
      )
    ) {
      // biome-ignore lint/style/noNonNullAssertion: it's there
      schemas[BadRequestResponse.description!] =
        this.toJsonSchema(BadRequestResponse)
    }

    return {
      schemas,
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
        description: 'Successful response',
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(route.options.result),
          },
        },
      },
    }

    if (!!route.options.params || !!route.options.query) {
      base[400] = {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(BadRequestResponse),
          },
        },
      }
    }

    return base
  }

  private schemaToParameters<T>(
    type: 'params' | 'query',
    schema: Validator<T> & { meta?: ImpMeta },
  ): OpenApiParameter[] {
    if (!schema.meta) {
      throw new Error('Schema meta is required')
    }
    if (schema.meta.type !== 'object') {
      throw new Error('Schema must be an object')
    }

    return Object.entries(schema.meta.schema).map(([key, value]) => ({
      name: key,
      in: type === 'query' ? 'query' : 'path',
      required: value.meta.type !== 'optional',
      schema: this.toJsonSchemaWithRefs(value),
    }))
  }

  private parsePath(path: string) {
    return path.replace(/:([^/]+)/g, '{$1}')
  }

  private toJsonSchemaWithRefs<T>(
    validator: Validator<T> & { meta?: ImpMeta },
  ) {
    if (
      validator.meta?.type === 'array' &&
      validator.meta.element.description
    ) {
      return {
        type: 'array',
        items: {
          $ref: `#/components/schemas/${validator.meta.element.description}`,
        },
      }
    }

    if (validator.description) {
      return {
        $ref: `#/components/schemas/${validator.description}`,
      }
    }

    return this.toJsonSchema(validator)
  }

  private toJsonSchema<T>(validator: Validator<T>) {
    // @ts-expect-error - it's there
    const { $schema: _, ...rest } = _toJsonSchema(validator)
    return rest
  }
}
