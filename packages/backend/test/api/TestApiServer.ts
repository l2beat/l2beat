import Router from '@koa/router'
import { agent } from 'supertest'

import { ApiServer } from '../../src/api'
import { Logger } from '../../src/tools/Logger'

export function createTestApiServer(routers: Router[]) {
  const callback = new ApiServer(0, Logger.SILENT, routers).getNodeCallback()
  return agent(callback)
}
