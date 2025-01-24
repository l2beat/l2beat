import { mockObject } from 'earl'
import type { Histogram } from 'prom-client'

import type { Config } from '../../config'
import { createTestApiServer } from '../../test/testApiServer'
import { createMetricsRouter } from './MetricsRouter'

export function createMockHistogram() {
  return mockObject<Histogram>({
    labels: () => mockObject<Histogram>({ observe: () => {} }),
  })
}

describe(createMetricsRouter.name, () => {
  describe('can be configured', () => {
    it('to require auth', async () => {
      const config = mockObject<Config>({
        metricsAuth: {
          user: 'user',
          pass: 'pass',
        },
      })
      const router = createMetricsRouter(config)
      const server = createTestApiServer([router])

      await server.get('/metrics').expect(401)
      await server.get('/metrics').auth('user', 'pass').expect(200)
    })

    it('not to require auth', async () => {
      const config = mockObject<Config>({
        metricsAuth: false,
      })
      const router = createMetricsRouter(config)
      const server = createTestApiServer([router])

      await server.get('/metrics').expect(200)
    })
  })
})
