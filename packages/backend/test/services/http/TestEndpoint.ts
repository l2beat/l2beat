import { agent } from 'supertest'

import { getConfig } from '../../../src/config'
import { createServices } from '../../../src/services'
import { HttpEndpoint } from '../../../src/services/http'

export class TestEndpoint extends HttpEndpoint {
  constructor() {
    const config = getConfig('test')
    const services = createServices(config)
    super(config.port, services.logger, services.helloService)
  }

  callback() {
    return this['app'].callback()
  }
}

export function createTestAgent() {
  const callback = new TestEndpoint().callback()
  return agent(callback)
}
