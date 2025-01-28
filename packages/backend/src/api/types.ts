import type { Middleware } from '@koa/router'
import type { Context, Request } from 'koa'
import type { z } from 'zod'

interface ParsedRequest extends Request {
  body?: unknown
}

interface ParsedContext extends Context {
  request: ParsedRequest
}

export function withTypedContext<T extends z.AnyZodObject>(
  parser: T,
  handler: (ctx: ParsedContext & z.infer<T>) => Promise<void> | void,
): Middleware {
  return async (ctx) => {
    const parseResult = parser.safeParse({
      params: ctx.params,
      query: ctx.query,
      request: ctx.request,
    })
    if (!parseResult.success) {
      ctx.status = 400
      ctx.body = { issues: parseResult.error.issues }
      return
    }
    ctx.params = parseResult.data.params
    Object.defineProperty(ctx.request, 'body', {
      value: parseResult.data.request?.body,
    })
    Object.defineProperty(ctx, 'query', { value: parseResult.data.query })
    await handler(ctx)
  }
}
