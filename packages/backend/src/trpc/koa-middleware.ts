import type { AnyRouter } from '@trpc/server'
import {
  type NodeHTTPCreateContextFnOptions,
  type NodeHTTPHandlerOptions,
  type NodeHTTPRequest,
  type NodeHTTPResponse,
  nodeHTTPRequestHandler,
} from '@trpc/server/adapters/node-http'
import type { Middleware } from 'koa'

declare module 'koa' {
  interface Request {
    body?: unknown
  }
}
declare module 'http' {
  interface IncomingMessage {
    body?: unknown
  }
}

export type CreateTrpcKoaContextOptions = NodeHTTPCreateContextFnOptions<
  NodeHTTPRequest,
  NodeHTTPResponse
>
export type AdditionalMiddlewareOpts = { prefix?: `/${string}` }
export type CreateKoaMiddlewareOptions<TRouter extends AnyRouter> =
  NodeHTTPHandlerOptions<TRouter, NodeHTTPRequest, NodeHTTPResponse> &
    AdditionalMiddlewareOpts

export const createKoaMiddleware =
  <TRouter extends AnyRouter>(
    opts: CreateKoaMiddlewareOptions<TRouter>,
  ): Middleware =>
  async (ctx, next) => {
    const { prefix } = opts
    const { req, res, request } = ctx

    if (prefix && !request.path.startsWith(prefix)) return next()

    if ('body' in request) {
      req.body = request.body
    }

    res.statusCode = 200
    ctx.respond = false

    await nodeHTTPRequestHandler({
      ...opts,
      req,
      res,
      path: request.path.slice((prefix?.length ?? 0) + 1),
    })
  }
