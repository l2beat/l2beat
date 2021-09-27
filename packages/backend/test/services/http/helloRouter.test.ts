import { createTestAgent } from './TestEndpoint'

describe('helloRouter', () => {
  it('responds to /hello', async () => {
    const agent = createTestAgent()
    await agent.get('/hello').expect(200).expect('Hello from Backend/Test!')
  })
})
