import Router from '@koa/router'

import { renderStatusPagesLinksPage } from './StatusPagesLinksPage'

export function createStatusRouter() {
  const router = new Router()

  router.get('/status', (ctx) => {
    ctx.body = renderStatusPagesLinksPage()
  })

  return router
}
