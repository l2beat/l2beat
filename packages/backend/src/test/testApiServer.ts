import Router from '@koa/router'
import { agent } from 'supertest'

import { ApiServer } from '../api/ApiServer'
import { Metrics } from '../Metrics'
import { Logger } from '../tools/Logger'
import { createMockHistogram } from './metrics'
import { mock } from './mock'

export function createTestApiServer(routers: Router[], metrics?: Metrics) {
  if (!metrics) {
    metrics = mock<Metrics>({
      createHistogram: createMockHistogram,
    })
  }
  const callback = new ApiServer(
    0,
    Logger.SILENT,
    metrics,
    routers,
  ).getNodeCallback()
  return agent(callback)
}
