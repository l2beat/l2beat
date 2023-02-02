import Router from '@koa/router'
import { Logger } from '@l2beat/common'
import { agent } from 'supertest'

import { ApiServer } from '../../src/api/ApiServer'
import { Metrics } from '../Metrics'

export function createTestApiServer(routers: Router[], metrics: Metrics) {
  const callback = new ApiServer(
    0,
    Logger.SILENT,
    metrics,
    routers,
  ).getNodeCallback()
  return agent(callback)
}
