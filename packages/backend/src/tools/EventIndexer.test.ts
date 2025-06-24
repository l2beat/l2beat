import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import { EventIndexer } from './EventIndexer'
import { MockWebSocket } from './test/MockWebSocket'

describe(EventIndexer.prototype.start.name, () => {
  it('should tick with latest block number from event', async () => {
    const mockWebSocket = new MockWebSocket()

    const indexer = new EventIndexer('url', 'source', Logger.SILENT, () => {
      return mockWebSocket.mockObject
    })
    await indexer.start()

    let blockNumber = 123456

    mockWebSocket.simulateOpen()
    expect(mockWebSocket.mockObject.send).toHaveBeenCalledWith(
      JSON.stringify({
        id: 1,
        method: 'eth_subscribe',
        params: ['newHeads'],
        jsonrpc: '2.0',
      }),
      expect.anything(),
    )

    mockWebSocket.simulateMessage(createEventMessage(blockNumber))
    let result = await indexer.tick()
    expect(result).toEqual(blockNumber)

    blockNumber++
    mockWebSocket.simulateMessage(createEventMessage(blockNumber))
    result = await indexer.tick()
    expect(result).toEqual(blockNumber)
  })
})

function createEventMessage(blockNumber: number): Buffer {
  return Buffer.from(
    JSON.stringify({
      params: {
        subscription: 'sub',
        result: {
          number: `0x${blockNumber.toString(16)}`,
          timestamp: '0x158AA73',
        },
      },
    }),
  )
}
