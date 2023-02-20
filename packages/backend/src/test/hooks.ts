import { register } from 'prom-client'

export const mochaHooks = {
  beforeAll() {
    register.clear()
  },
}
