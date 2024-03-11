import Router from '@koa/router'

export function createTvl2StatusRouter() {
  const router = new Router()

  router.get('/status/tokens', (ctx) => {
    ctx.body = 'hello'
  })

  return router
}
