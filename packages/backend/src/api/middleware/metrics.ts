import { Context, Middleware, Next } from 'koa'

import { Metrics } from '../../Metrics'

export function createApiMetrics(metrics: Metrics): Middleware {
  const labels = ['path', 'method', 'status_code']
  const apiHistogam = metrics.createHistogram({
    name: 'api_request_duration_seconds',
    help:
      'duration histogram of api http responses labeled with: ' +
      labels.join(', '),
    labelNames: labels,
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

      // ctx._matchedRoute will include parameter range like /user/:id
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const path = (ctx._matchedRoute as string | undefined) ?? ctx.path

      apiHistogam
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
