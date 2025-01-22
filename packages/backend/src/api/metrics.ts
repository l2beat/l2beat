import type { Context, Middleware, Next } from 'koa'
import { Histogram } from 'prom-client'

const labels = ['path', 'method', 'status_code']
const apiHistogram = new Histogram({
  name: 'api_request_duration_seconds',
  help:
    'duration histogram of api http responses labeled with: ' +
    labels.join(', '),
  labelNames: labels,
})

export function createApiMetrics(): Middleware {
  return async function (ctx: Context, next: Next): Promise<void> {
    const key = Symbol.for('request-received.startTime')
    // biome-ignore lint/suspicious/noExplicitAny: generic type
    const start: number = ctx[key as any]?.getTime?.() ?? Date.now()

    await next()

    const { res } = ctx

    const done = () => {
      res.removeListener('finish', done)
      res.removeListener('close', done)

      const timeMs = Date.now() - start

      // ctx._matchedRoute will include parameter range like /user/:id
      const path = (ctx._matchedRoute as string | undefined) ?? ctx.path

      apiHistogram
        .labels({
          path,
          method: ctx.method,
          status_code: ctx.status,
        })
        .observe(timeMs / 1000)
    }

    res.once('finish', done)
    res.once('close', done)
  }
}
