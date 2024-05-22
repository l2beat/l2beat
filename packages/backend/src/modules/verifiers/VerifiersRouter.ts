import Router from '@koa/router'
import { ApiConfig } from '../../config/Config'
import { VerifiersController } from './VerifiersController'

export function createVerifiersRouter(
  controller: VerifiersController,
  config: ApiConfig,
) {
  const router = new Router()

  router.get('/api/verifiers', async (ctx) => {
    const result = config.cache.verifiers
      ? await controller.getCachedVerifierStatuses()
      : await controller.getVerifierStatuses()

    ctx.body = result
  })

  return router
}
