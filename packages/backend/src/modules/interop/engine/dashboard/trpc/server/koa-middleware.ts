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

    // put parsed body (by koa-bodyparser/@koa/bodyparser for example)
    // where nodeHTTPRequestHandler will look for it.
    if ('body' in request) {
      req.body = request.body
    }

    // koa uses 404 as a default status but some logic in
    // nodeHTTPRequestHandler assumes default status of 200.
    res.statusCode = 200
    // tRPC writes directly to Node's response object.
    // Disable Koa's response handling to avoid overriding status/body.
    ctx.respond = false

    await nodeHTTPRequestHandler({
      ...opts,
      req,
      res,
      path: request.path.slice((prefix?.length ?? 0) + 1),
    })
  }
