import type { ImpDefinition, Validator } from '@l2beat/validate'
import { toJsonSchema as _toJsonSchema } from '@l2beat/validate'
import type { Application, Request, RequestHandler, Response } from 'express'
import { BadRequestResponse, InternalErrorResponse } from './types'
import { httpResponsesDescriptions } from './utils/errorDescriptions'

// biome-ignore lint/suspicious/noExplicitAny: its fine
interface OpenApiRouteOptions<P = any, O = any, Q = any, E = any> {
  /** Names the operation in generated clients, so it must stay unique and stable */
  operationId: string
  summary?: string
  description?: string
  tags?: Tags[]
  params?: Validator<P> & { definition?: ImpDefinition }
  query?: Validator<Q> & { definition?: ImpDefinition }
  queryDescriptions?: Record<string, string>
  result: Validator<O> & { definition?: ImpDefinition }
  // Add possibility to have different type per error code
  errors?: Record<number, Validator<E> & { definition?: ImpDefinition }>
  /** Overrides the generic text for an error status, e.g. to list the cases behind a 404 */
  errorDescriptions?: Record<number, string>
}

type OpenApiPath = {
  operationId: string
  summary?: string
  description?: string
  tags?: Tags[]
  parameters: OpenApiParameter[]
  responses: Record<number, OpenApiResponse>
}

type OpenApiParameter = {
  name: string
  in: 'query' | 'path'
  description?: string
  required: boolean
  schema: ReturnType<typeof _toJsonSchema>
}

type OpenApiResponse = {
  description: string
  /** Left out when the answer is not ours to shape, like the CDN's 429 */
  content?: {
    'application/json': {
      schema: JsonSchema
    }
  }
}

type Tags = 'projects' | 'tvs' | 'activity' | 'interop'

/** Older integrations still send the key they were given. It is ignored. */
const LEGACY_QUERY_PARAMS = ['apiKey']

/**
 * For a 200. The data changes hourly and the in-process cache holds it for
 * five minutes, so a CDN may hold it as long and a client for a minute.
 */
const CACHE_CONTROL_SUCCESS =
  'public, max-age=60, s-maxage=300, stale-while-revalidate=300'
/** For everything else: an error must not outlive what caused it. */
export const CACHE_CONTROL_ERROR = 'no-store'

export interface InvalidResponse {
  path: string
  status: number
  /** Where in the body the mismatch is, e.g. `[3].tvs.timestamp` */
  bodyPath: string
  message: string
}

type JsonSchema = ReturnType<typeof _toJsonSchema>

interface Route {
  path: string
  method: 'get'
  options: OpenApiRouteOptions
}

export interface BaseOpenApiSchema {
  openapi: '3.1.0'
  info: {
    title: string
    version: string
    description?: string
  }
  servers: { url: string }[]
  tags: { name: Tags; description: string }[]
  externalDocs: {
    description: string
    url: string
  }
}

export class OpenApi {
  private routes: Route[] = []

  /**
   * @param onInvalidResponse Called when a route answers with a body that
   * does not match the schema it documents. Throws by default, which fails
   * the request, so tests catch the drift. Production logs it and still
   * answers.
   */
  constructor(
    private readonly app: Application,
    private readonly baseSchema: BaseOpenApiSchema,
    private readonly onInvalidResponse: (
      invalid: InvalidResponse,
    ) => void = throwInvalidResponse,
  ) {}

  get<TParams, TOutput, TQuery, TErrors>(
    path: string,
    options: OpenApiRouteOptions<TParams, TOutput, TQuery, TErrors>,
    handler: RequestHandler<TParams, TOutput | TErrors, unknown, TQuery>,
  ) {
    this.routes.push({ path, method: 'get', options })
    const knownQueryParams = getQueryParamNames(options.query)

    this.app.get(path, (req, res, next) => {
      this.prepareResponse(res, path, options)

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

      // A misspelled parameter would otherwise be dropped, and the caller
      // would read the default answer as the one they asked for
      for (const key of Object.keys(req.query)) {
        if (
          !knownQueryParams.includes(key) &&
          !LEGACY_QUERY_PARAMS.includes(key)
        ) {
          res.status(400).json({
            path: `.query.${key}`,
            message:
              knownQueryParams.length > 0
                ? `Unknown query parameter. This endpoint takes: ${knownQueryParams.join(', ')}.`
                : 'Unknown query parameter. This endpoint takes none.',
          })
          return
        }
      }

      if (options.query) {
        // Remove '' from query
        const sanitizedQuery = Object.fromEntries(
          Object.entries(req.query)
            .filter(([key]) => knownQueryParams.includes(key))
            .map(([key, value]) => [key, value || undefined]),
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

    // GET also answers HEAD, and the CORS middleware answers OPTIONS
    this.app.all(path, (req, res) => {
      res.setHeader('Allow', 'GET, HEAD, OPTIONS')
      res.setHeader('Cache-Control', CACHE_CONTROL_ERROR)
      res.status(405).json({
        message: `${req.method} is not supported here. The API is read-only: use GET.`,
      })
    })
  }

  /**
   * Says how long each JSON body a route sends may be cached, and checks the
   * body against the schema the route documents.
   */
  private prepareResponse(
    res: Response,
    path: string,
    options: OpenApiRouteOptions,
  ) {
    const json = res.json.bind(res)
    res.json = (body) => {
      res.setHeader(
        'Cache-Control',
        res.statusCode === 200 ? CACHE_CONTROL_SUCCESS : CACHE_CONTROL_ERROR,
      )
      const schema =
        res.statusCode === 200
          ? options.result
          : options.errors?.[res.statusCode]
      const result = schema?.safeParse(body)
      if (result && !result.success) {
        this.onInvalidResponse({
          path,
          status: res.statusCode,
          bodyPath: result.path,
          message: result.message,
        })
      }
      return json(body)
    }
  }

  getOpenApiSchema() {
    return {
      ...this.baseSchema,
      paths: this.getPaths(),
      components: this.getComponents(),
    }
  }

  private getComponents() {
    const schemas = {} as Record<string, JsonSchema>
    for (const route of this.routes) {
      const { result, params, query, errors } = route.options
      if (
        result.definition?.type === 'array' &&
        result.definition.element.description &&
        !schemas[result.definition.element.description]
      ) {
        schemas[result.definition.element.description] = this.toJsonSchema(
          result.definition.element,
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

    schemas.BadRequestResponse = this.toJsonSchema(BadRequestResponse)
    schemas.InternalErrorResponse = this.toJsonSchema(InternalErrorResponse)

    return {
      schemas,
    }
  }

  private getPaths() {
    return this.routes.reduce(
      (acc, route) => {
        acc[this.parsePath(route.path)] = {
          [route.method]: {
            operationId: route.options.operationId,
            tags: route.options.tags,
            summary: route.options.summary,
            description: route.options.description,
            parameters: [
              ...(route.options.params
                ? this.schemaToParameters('params', route.options.params)
                : []),
              ...(route.options.query
                ? this.schemaToParameters(
                    'query',
                    route.options.query,
                    route.options.queryDescriptions,
                  )
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
      // Every route can answer these: 400 for a query parameter it does not
      // take, 429 from the CDN, 500 from the error handler
      400: {
        description: httpResponsesDescriptions[400],
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(BadRequestResponse),
          },
        },
      },
      429: { description: httpResponsesDescriptions[429] },
      500: {
        description: httpResponsesDescriptions[500],
        content: {
          'application/json': {
            schema: this.toJsonSchemaWithRefs(InternalErrorResponse),
          },
        },
      },
    }

    // Add custom error responses if specified
    for (const [statusCode, errorValidator] of Object.entries({
      ...route.options.errors,
    })) {
      const code = Number.parseInt(statusCode, 10)
      base[code] = {
        description:
          route.options.errorDescriptions?.[code] ??
          (httpResponsesDescriptions[
            code as keyof typeof httpResponsesDescriptions
          ] ||
            `Error ${code}`),
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
    schema: Validator<T> & { definition?: ImpDefinition },
    descriptions: Record<string, string> = {},
  ): OpenApiParameter[] {
    if (!schema.definition) {
      throw new Error('Schema definition is required')
    }
    if (schema.definition.type !== 'object') {
      throw new Error('Schema must be an object')
    }

    return Object.entries(schema.definition.schema).map(([key, value]) => ({
      name: key,
      in: type === 'query' ? 'query' : 'path',
      ...(descriptions[key] ? { description: descriptions[key] } : {}),
      required: value.definition.type !== 'optional',
      schema: this.toJsonSchemaWithRefs(value),
    }))
  }

  private parsePath(path: string) {
    return path.replace(/:([^/]+)/g, '{$1}')
  }

  private toJsonSchemaWithRefs<T>(
    validator: Validator<T> & { definition?: ImpDefinition },
  ) {
    if (
      validator.definition?.type === 'array' &&
      validator.definition.element.description
    ) {
      return {
        type: 'array',
        items: {
          $ref: `#/components/schemas/${validator.definition.element.description}`,
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
    return withEnumTypes(rest)
  }
}

function getQueryParamNames(
  query: OpenApiRouteOptions['query'] | undefined,
): string[] {
  if (!query) {
    return []
  }
  if (query.definition?.type !== 'object') {
    throw new Error('Query schema must be an object')
  }
  return Object.keys(query.definition.schema)
}

function throwInvalidResponse(invalid: InvalidResponse): never {
  throw new Error(
    `Response of ${invalid.path} (${invalid.status}) does not match its schema at ${invalid.bodyPath}: ${invalid.message}`,
  )
}

/**
 * Gives every `enum` the `type` its values share. The schema is valid
 * without it, but client generators then type the field as `any`.
 */
function withEnumTypes<T>(schema: T): T {
  if (Array.isArray(schema)) {
    return schema.map(withEnumTypes) as T
  }
  if (typeof schema !== 'object' || schema === null) {
    return schema
  }
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(schema)) {
    result[key] = withEnumTypes(value)
  }
  const values = result.enum
  if (Array.isArray(values) && result.type === undefined) {
    const types = new Set(values.map((value) => typeof value))
    const [type] = types
    if (types.size === 1 && (type === 'string' || type === 'number')) {
      result.type = type
    }
  }
  return result as T
}
