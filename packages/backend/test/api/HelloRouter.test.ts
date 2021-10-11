import { createHelloRouter } from '../../src/api/HelloRouter'
import { HelloService } from '../../src/core/HelloService'
import { createTestApiServer } from './TestApiServer'

describe('HelloRouter', () => {
  it('responds to /hello', async () => {
    const helloService = new HelloService('Test')
    const helloRouter = createHelloRouter(helloService)
    const server = createTestApiServer([helloRouter])
    await server.get('/hello').expect(200).expect('Hello from Test!')
  })
})
