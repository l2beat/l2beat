import Router from '@koa/router'

import { renderStatusPagesLinksPage } from './view/StatusPagesLinksPage'

export function createStatusRouter() {
  const router = new Router()

  router.get('/status', (ctx) => {
    ctx.body = renderStatusPagesLinksPage()
  })

  return router
}
