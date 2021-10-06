import { createTestServer } from './TestApiServer'

describe('HelloRouter', () => {
  it('responds to /hello', async () => {
    const server = createTestServer()
    await server.get('/hello').expect(200).expect('Hello from Backend/Test!')
  })
})
