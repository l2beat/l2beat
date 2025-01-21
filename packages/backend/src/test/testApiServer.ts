import type Router from '@koa/router'
import { Logger } from '@l2beat/backend-tools'
import { agent } from 'supertest'

import { ApiServer } from '../../src/api/ApiServer'

export function createTestApiServer(routers: Router[]) {
  const callback = new ApiServer(0, Logger.SILENT, routers).getNodeCallback()
  return agent(callback)
}
