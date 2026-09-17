import { Logger } from '@l2beat/backend-tools'
import { describe, expect, it } from 'vitest'
import { MockWebSocket } from '../../tools/test/MockWebSocket'
import { WsBlockNumberIndexer } from './WsBlockNumberIndexer'

describe(WsBlockNumberIndexer.prototype.start.name, () => {
  it('should tick with latest block number from event', async () => {
    const mockWebSocket = new MockWebSocket()

    const indexer = new WsBlockNumberIndexer(
      'url',
      'source',
      Logger.SILENT,
      () => {
        return mockWebSocket.mock
      },
    )
    await indexer.start()

    let blockNumber = 123456

    mockWebSocket.simulateOpen()
    expect(mockWebSocket.mock.send).toHaveBeenCalledWith(
      JSON.stringify({
        id: 1,
        method: 'eth_subscribe',
        params: ['newHeads'],
        jsonrpc: '2.0',
      }),
      undefined,
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
