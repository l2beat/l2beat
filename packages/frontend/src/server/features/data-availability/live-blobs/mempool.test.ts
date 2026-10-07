import { Logger } from '@l2beat/backend-tools'
import { install } from '@sinonjs/fake-timers'
import { expect } from 'earl'
import { createMempool, readPendingTx, type Socket } from './mempool'
import type { PendingTx } from './pendingBlobs'

// Methodology: a fake socket stands in for the node and is driven through the
// messages and closes a node would send; what the mempool tells its listener
// and when it opens a new socket is read back.
describe(createMempool.name, () => {
  const blobTxMessage = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_subscription',
    params: {
      subscription: '0x1',
      result: {
        type: '0x3',
        hash: '0xhash',
        from: '0xBASE',
        to: '0xINBOX',
        nonce: '0x7',
        blobVersionedHashes: ['0x01', '0x02'],
      },
    },
  })
  const acknowledgement = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    result: '0x1',
  })

  describe(readPendingTx.name, () => {
    it('reads a blob transaction however the JSON is spaced', () => {
      const spaced = JSON.stringify(JSON.parse(blobTxMessage), null, 2)
      expect(readPendingTx(spaced)?.blobTx).toEqual({
        hash: '0xhash',
        from: '0xbase',
        to: '0xinbox',
        nonce: 7,
        blobs: 2,
      })
    })

    it('tells a transaction of another kind from no transaction at all', () => {
      const plain = blobTxMessage.replace('"type":"0x3"', '"type":"0x2"')
      expect(readPendingTx(plain)).toEqual({ blobTx: undefined })
      expect(readPendingTx(acknowledgement)).toEqual(undefined)
      expect(readPendingTx('not json')).toEqual(undefined)
    })
  })

  it('backs off from a node that takes the subscription and closes', () => {
    const clock = install({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      const node = fakeNode()
      const mempool = createMempool(
        Promise.resolve(() => undefined),
        Logger.SILENT,
        'wss://node',
        node.open,
      )
      mempool.watch(() => {})
      expect(node.sockets.length).toEqual(1)

      // acknowledged and closed, twice: the second retry waits twice as long
      node.sockets[0]?.onopen?.({} as Event)
      node.sockets[0]?.onmessage?.(message(acknowledgement))
      node.sockets[0]?.onclose?.({} as CloseEvent)
      clock.tick(1000)
      expect(node.sockets.length).toEqual(2)
      node.sockets[1]?.onmessage?.(message(acknowledgement))
      node.sockets[1]?.onclose?.({} as CloseEvent)
      clock.tick(1000)
      expect(node.sockets.length).toEqual(2)
      clock.tick(1000)
      expect(node.sockets.length).toEqual(3)

      // a transaction coming through says the line is good again
      node.sockets[2]?.onmessage?.(message(blobTxMessage))
      node.sockets[2]?.onclose?.({} as CloseEvent)
      clock.tick(1000)
      expect(node.sockets.length).toEqual(4)
      mempool.stop()
    } finally {
      clock.uninstall()
    }
  })

  it('tells of a blob transaction, attributed', async () => {
    const node = fakeNode()
    const heard: PendingTx[] = []
    const mempool = createMempool(
      Promise.resolve((to) => (to === '0xinbox' ? 'base' : undefined)),
      Logger.SILENT,
      'wss://node',
      node.open,
    )
    mempool.watch((tx) => heard.push(tx))
    node.sockets[0]?.onmessage?.(message(blobTxMessage))
    await settled()
    expect(heard).toEqual([
      {
        projectId: 'base',
        hash: '0xhash',
        from: '0xbase',
        to: '0xinbox',
        nonce: 7,
        blobs: 2,
      },
    ])
    mempool.stop()
  })

  it('goes on when the senders could not be loaded, rather than crash the server', async () => {
    // Node ends the process on a rejection nobody handles; this test stands
    // in as that nobody and counts them instead
    const unhandled: unknown[] = []
    const count = (reason: unknown) => unhandled.push(reason)
    process.on('unhandledRejection', count)
    try {
      const node = fakeNode()
      const senders = Promise.reject(new Error('no senders'))
      // the block feed is the one to await and report it
      senders.catch(() => {})
      const mempool = createMempool(
        senders,
        Logger.SILENT,
        'wss://node',
        node.open,
      )
      mempool.watch(() => {})
      node.sockets[0]?.onmessage?.(message(blobTxMessage))
      await settled()
      mempool.stop()
      expect(unhandled).toEqual([])
    } finally {
      process.off('unhandledRejection', count)
    }
  })

  function fakeNode() {
    const sockets: Socket[] = []
    return {
      sockets,
      open: () => {
        const socket: Socket = {
          onopen: null,
          onmessage: null,
          onclose: null,
          send: () => {},
          close: () => {},
        }
        sockets.push(socket)
        return socket
      },
    }
  }

  function message(data: string) {
    return { data } as MessageEvent
  }

  /** Lets every promise settled so far run its handlers */
  function settled() {
    return new Promise((resolve) => setImmediate(resolve))
  }
})
