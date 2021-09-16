import { agent } from 'supertest'

import { getConfig } from '../../src/config'
import { HttpEndpoint } from '../../src/http'
import { createServices } from '../../src/services'

export class TestEndpoint extends HttpEndpoint {
  constructor() {
    const config = getConfig('test')
    const services = createServices(config)
    super(config, services)
  }

  callback() {
    return this['app'].callback()
  }
}

export function createTestAgent() {
  const callback = new TestEndpoint().callback()
  return agent(callback)
}
