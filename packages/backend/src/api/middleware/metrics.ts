import { Context, Middleware, Next } from 'koa'

import { Metrics } from '../../Metrics'

export function createApiMetrics(metrics: Metrics): Middleware {
  const apiHistogam = metrics.createHistogram({
    name: 'api_request_duration_seconds_sum',
    help: 'help',
    labelNames: ['path', 'method', 'status_code'],
  })

  return async function (ctx: Context, next: Next): Promise<void> {
    const key = Symbol.for('request-received.startTime')
    // eslint-disable-next-line
    const start: number = ctx[key as any]?.getTime?.() ?? Date.now()

    await next()

    const { res } = ctx

    const done = () => {
      res.removeListener('finish', done)
      res.removeListener('close', done)

      const timeMs = Date.now() - start

      apiHistogam
        .labels({
          // TODO: normalizePath
          path: ctx.path,
          method: ctx.method,
          status_code: ctx.status,
        })
        .observe(timeMs / 1000)
    }

    res.once('finish', done)
    res.once('close', done)
  }
}
