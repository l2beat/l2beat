import { toJsonSchema as _toJsonSchema, v } from '@l2beat/validate'
import type { ImpMeta, Validator } from '@l2beat/validate/dist/cjs/validate'
import type { Application, Request, RequestHandler } from 'express'
import { GenericErrorResponse } from './types'
import { httpResponsesDescriptions } from './utils/errorDescriptions'

// biome-ignore lint/suspicious/noExplicitAny: its fine
interface OpenApiRouteOptions<P = any, O = any, Q = any, E = any> {
  summary?: string
  description?: string
  tags?: Tags[]
  params?: Validator<P> & { meta?: ImpMeta }
  query?: Validator<Q> & { meta?: ImpMeta }
  result: Validator<O> & { meta?: ImpMeta }
  // Add possibility to have different type per error code
  errors?: Record<number, Validator<E> & { meta?: ImpMeta }>
}

type OpenApiPath = {
  summary?: string
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

type Tags = 'projects' | 'tvs' | 'activity'

const BadRequestResponse = v
  .object({
    path: v.string(),
    message: v.string(),
  })
  .describe('BadRequestResponse')

type JsonSchema = ReturnType<typeof _toJsonSchema>

interface Route {
  path: string
  method: 'get'
  options: OpenApiRouteOptions
}

export interface BaseOpenApiSchema {
  openapi: '3.0.0'
  info: {
    title: string
    version: string
  }
  servers: { url: string }[]
  tags: { name: Tags; description: string }[]
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey'
        in: 'query'
        name: 'apiKey'
      }
    }
  }
  security: { apiKeyAuth: [] }[]
}

export class OpenApi {
  private routes: Route[] = []

  constructor(
    private readonly app: Application,
    private readonly baseSchema: BaseOpenApiSchema,
  ) {}

  get<TParams, TOutput, TQuery, TErrors>(
    path: string,
    options: OpenApiRouteOptions<TParams, TOutput, TQuery, TErrors>,
    handler: RequestHandler<TParams, TOutput | TErrors, unknown, TQuery>,
  ) {
    this.routes.push({ path, method: 'get', options })

    this.app.get(path, (req, res, next) => {
      if (options.params) {
        const result = options.params.safeParse(req.params)
        if (!result.success) {
          res.status(400).json({
            path: `.params${result.path}`,
            message: result.message,
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
            message: result.message,
          })
          return
        }
        Object.defineProperty(req, 'query', { value: result.data })
      }

      return handler(
        req as Request<TParams, TOutput | TErrors, unknown, TQuery>,
        res,
        next,
      )
    })
  }

  getOpenApiSchema() {
    const { components, ...rest } = this.baseSchema
    return {
      ...rest,
      paths: this.getPaths(),
      components: {
        ...components,
        ...this.getComponents(),
      },
    }
  }

  private getComponents() {
    const schemas = {} as Record<string, JsonSchema>
    for (const route of this.routes) {
      const { result, params, query, errors } = route.options
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

      for (const errorValidator of Object.values(errors ?? {})) {
        if (
          errorValidator.description &&
          !schemas[errorValidator.description]
        ) {
          schemas[errorValidator.description] =
            this.toJsonSchema(errorValidator)
        }
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
        acc[this.parsePath(route.path)] = {
          [route.method]: {
            tags: route.options.tags,
            summary: route.options.summary,
            description: route.options.description,
            parameters: [
              ...(route.options.params
                ? this.schemaToParameters('params', route.options.params)
                : []),
              ...(route.options.query
                ? this.schemaToParameters('query', route.options.query)
                : []),
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
        description: httpResponsesDescriptions[200],
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(route.options.result),
          },
        },
      },
    }

    if (!!route.options.params || !!route.options.query) {
      base[400] = {
        description: httpResponsesDescriptions[400],
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(BadRequestResponse),
          },
        },
      }
    }

    // Add custom error responses if specified
    for (const [statusCode, errorValidator] of Object.entries({
      401: GenericErrorResponse,
      ...route.options.errors,
    })) {
      const code = Number.parseInt(statusCode, 10)
      base[code] = {
        description:
          httpResponsesDescriptions[
            code as keyof typeof httpResponsesDescriptions
          ] || `Error ${code}`,
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(errorValidator),
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
