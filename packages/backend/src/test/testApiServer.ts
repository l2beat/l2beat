import Router from '@koa/router'
import { Logger, mock } from '@l2beat/common'
import { Histogram } from 'prom-client'
import { agent } from 'supertest'

import { ApiServer } from '../../src/api/ApiServer'
import { Metrics } from '../Metrics'

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

export function createMockHistogram() {
  return mock<Histogram>({
    labels: () => mock<Histogram>({ observe: () => {} }),
  })
}
