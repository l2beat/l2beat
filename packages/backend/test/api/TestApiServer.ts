import { agent } from 'supertest'

import { getConfig } from '../../src/config'
import { createServices } from '../../src/services'

export function createTestServer() {
  const config = getConfig('test')
  const services = createServices(config)

  const callback = services.apiServer['app'].callback()

  return agent(callback)
}
