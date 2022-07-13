import { Middleware } from '@koa/router'
import { Context, Request } from 'koa'
import { z } from 'zod'

interface ParsedRequest extends Request {
  body?: unknown
}

interface ParsedContext extends Context {
  request: ParsedRequest
}

export function withTypedContext<T extends z.AnyZodObject>(
  parser: T,
  handler: (ctx: ParsedContext & z.infer<T>) => Promise<void>,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ctx.params = parseResult.data.params
    Object.defineProperty(ctx.request, 'body', {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      value: parseResult.data.request?.body,
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    Object.defineProperty(ctx, 'query', { value: parseResult.data.query })
    await handler(ctx)
  }
}
