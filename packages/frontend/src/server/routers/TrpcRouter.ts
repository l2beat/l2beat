import { assertUnreachable } from '@l2beat/shared-pure'
import type { TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { appRouter } from '~/server/trpc/root'
import { getRequestId } from '../middlewares/RequestIdMiddleware'
import { getRequestIp } from '../utils/getRequestIp'
import { getLogger } from '../utils/logger'

const logger = getLogger().for('TrpcRouter')
const MAX_LOGGED_INPUT_LENGTH = 1000

const createContext = ({ req }: trpcExpress.CreateExpressContextOptions) => ({
  headers: new Headers(req.headers as Record<string, string>),
})

export function createTrpcRouter() {
  const router = express.Router()

  router.use(
    '/',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: (opts) => {
        const logFn = getLogFn(opts.error)
        logFn(opts.error.message, opts.error, {
          requestId: getRequestId(opts.req),
          ip: getRequestIp(opts.req),
          method: opts.req.method,
          url: opts.req.originalUrl,
          referer: opts.req.headers.referer ?? 'unknown',
          userAgent: opts.req.headers['user-agent'] ?? 'unknown',
          path: opts.path,
          code: opts.error.code,
          type: opts.type,
          input: stringifyInputForLogging(opts.input),
          inputType: getInputType(opts.input),
        })
      },
    }),
  )

  return router
}

function stringifyInputForLogging(input: unknown): string | undefined {
  if (input === undefined) {
    return undefined
  }

  try {
    const stringified =
      typeof input === 'string'
        ? input
        : JSON.stringify(input, (_key, value: unknown) =>
            typeof value === 'bigint' ? value.toString() : value,
          )

    if (stringified === undefined) {
      return undefined
    }

    return stringified.length > MAX_LOGGED_INPUT_LENGTH
      ? `${stringified.slice(0, MAX_LOGGED_INPUT_LENGTH)}...`
      : stringified
  } catch {
    return '[unserializable input]'
  }
}

function getInputType(input: unknown): string | undefined {
  if (input === undefined) {
    return undefined
  }

  if (input === null) {
    return 'null'
  }

  if (Array.isArray(input)) {
    return 'array'
  }

  return typeof input
}

function getLogFn(error: TRPCError) {
  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'BAD_REQUEST':
      return logger.warn
    case 'PARSE_ERROR':
    case 'INTERNAL_SERVER_ERROR':
    case 'NOT_IMPLEMENTED':
    case 'BAD_GATEWAY':
    case 'SERVICE_UNAVAILABLE':
    case 'GATEWAY_TIMEOUT':
    case 'PAYMENT_REQUIRED':
    case 'FORBIDDEN':
    case 'NOT_FOUND':
    case 'METHOD_NOT_SUPPORTED':
    case 'TIMEOUT':
    case 'CONFLICT':
    case 'PRECONDITION_FAILED':
    case 'PAYLOAD_TOO_LARGE':
    case 'UNSUPPORTED_MEDIA_TYPE':
    case 'UNPROCESSABLE_CONTENT':
    case 'PRECONDITION_REQUIRED':
    case 'TOO_MANY_REQUESTS':
    case 'CLIENT_CLOSED_REQUEST':
      return logger.error
    default:
      assertUnreachable(error.code)
  }
}
