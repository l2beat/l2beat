import { mock } from '@l2beat/common'

import { Config } from '../../config'
import { Metrics } from '../../Metrics'
import {
  createMockHistogram,
  createTestApiServer,
} from '../../test/testApiServer'
import { createMetricsRouter } from './MetricsRouter'

describe(createMetricsRouter.name, () => {
  describe('can be configured', () => {
    const metrics = mock<Metrics>({
      getMetrics: async () => 'metrics',
      createHistogram: createMockHistogram,
    })

    it('to require auth', async () => {
      const config = mock<Config>({
        metricsAuth: {
          user: 'user',
          pass: 'pass',
        },
      })
      const router = createMetricsRouter(config, metrics)
      const server = createTestApiServer([router], metrics)

      await server.get('/metrics').expect(401)
      await server.get('/metrics').auth('user', 'pass').expect(200)
    })

    it('not to require auth', async () => {
      const config = mock<Config>({
        metricsAuth: false,
      })
      const router = createMetricsRouter(config, metrics)
      const server = createTestApiServer([router], metrics)

      await server.get('/metrics').expect(200)
    })
  })
})
