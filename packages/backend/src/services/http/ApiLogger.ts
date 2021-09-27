import { Context, Next } from 'koa'

import { Logger } from '../Logger'

export function createApiLogger(logger: Logger) {
  return async function (ctx: Context, next: Next) {
    const key = Symbol.for('request-received.startTime')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const start: number = ctx[key as any]?.getTime?.() ?? Date.now()

    logger.info(`> ${ctx.method} ${ctx.originalUrl}`)

    try {
      await next()
    } catch (error) {
      logger.error(error)
      throw error
    }

    const { res } = ctx

    const done = () => {
      res.removeListener('finish', done)
      res.removeListener('close', done)

      const time = getTimeDelta(start)
      logger.info(`< ${ctx.status} ${time} ${ctx.method} ${ctx.originalUrl}`)
    }

    res.once('finish', done)
    res.once('close', done)
  }
}

function getTimeDelta(start: number) {
  const delta = Date.now() - start
  return delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's'
}
