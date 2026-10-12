import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { MockWebSocket } from '../../../../tools/test/MockWebSocket'
import { LiveMempoolListener, readPendingTx } from './LiveMempoolListener'
import type { LiveBlobsConfig } from './liveBlobs'

/**
 * Methodology: the node is a mock WebSocket fed the messages a node sends,
 * the database a mock; tests assert what is stored and when the line is
 * opened again. Timers are faked where the backoff is under test
 */
describe(LiveMempoolListener.name, () => {
  const SENDER = EthereumAddress.random()
  const INBOX = EthereumAddress.random()

  it('subscribes to whole pending transactions once connected', () => {
    const { sockets } = setup()

    sockets[0]?.simulateOpen()

    const sent = sockets[0]?.mockObject.send.calls.map((call) => call.args[0])
    expect(sent).toEqual([
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['newPendingTransactions', true],
      }),
    ])
  })

  it('stores the blob transactions, attributed by sender and inbox, and nothing else', async () => {
    const { sockets, db } = setup({ now: 1000.5 })

    sockets[0]?.simulateMessage(message({ id: 1, result: '0xsub' }))
    sockets[0]?.simulateMessage(pending({ type: '0x2' }))
    sockets[0]?.simulateMessage(pending({ type: '0x3', nonce: '0x2a' }))
    await flush()

    expect(db.livePendingBlobTx.upsert).toHaveBeenOnlyCalledWith({
      from: SENDER,
      nonce: 42,
      txHash: '0xtx',
      to: INBOX,
      blobs: 2,
      projectId: ProjectId('rollup'),
      firstSeenAt: 1000.5,
      lastSeenAt: 1000.5,
    })
  })

  describe('when the line drops', () => {
    let time: InstalledClock

    beforeEach(() => {
      time = install()
    })

    afterEach(() => {
      time.uninstall()
    })

    it('opens it again, waiting longer after each try that brings nothing', () => {
      const { sockets } = setup()

      sockets[0]?.simulateClose()
      time.tick(999)
      expect(sockets.length).toEqual(1)
      time.tick(1)
      expect(sockets.length).toEqual(2)

      sockets[1]?.simulateClose()
      time.tick(1999)
      expect(sockets.length).toEqual(2)
      time.tick(1)
      expect(sockets.length).toEqual(3)
    })

    it('waits as little as at first once transactions flow again', () => {
      const { sockets } = setup()

      sockets[0]?.simulateClose()
      time.tick(1000)
      sockets[1]?.simulateMessage(pending({ type: '0x2' }))
      sockets[1]?.simulateClose()
      time.tick(1000)

      expect(sockets.length).toEqual(3)
    })

    it('drops a line that went silent', () => {
      const { sockets } = setup()

      time.tick(30_000)

      expect(sockets[0]?.mockObject.terminate).toHaveBeenCalled()
    })
  })

  function setup(options: { now?: number } = {}) {
    const sockets: MockWebSocket[] = []
    const livePendingBlobTx = mockObject<Database['livePendingBlobTx']>({
      upsert: mockFn().resolvesTo(undefined),
      deleteSeenBefore: mockFn().resolvesTo(0),
    })
    const listener = new LiveMempoolListener(
      {
        url: 'wss://node',
        db: mockObject<Database>({ livePendingBlobTx }),
        configurations: [rollupConfig(SENDER, INBOX)],
        now: () => options.now ?? 0,
        openSocket: () => {
          const socket = new MockWebSocket()
          sockets.push(socket)
          return socket.mockObject
        },
      },
      Logger.SILENT,
    )
    listener.start()
    return { sockets, db: { livePendingBlobTx } }
  }

  function pending(fields: { type: string; nonce?: string }) {
    return message({
      method: 'eth_subscription',
      params: {
        subscription: '0xsub',
        result: {
          hash: '0xtx',
          // lowercase, as nodes send them
          from: SENDER.toLowerCase(),
          to: INBOX.toLowerCase(),
          nonce: fields.nonce ?? '0x1',
          type: fields.type,
          blobVersionedHashes:
            fields.type === '0x3' ? ['0x01', '0x02'] : undefined,
        },
      },
    })
  }
})

describe(readPendingTx.name, () => {
  it('tells nothing of a message that is not a pending transaction', () => {
    expect(readPendingTx('{"jsonrpc":"2.0","id":1,"result":"0xsub"}')).toEqual(
      undefined,
    )
    expect(readPendingTx('not json')).toEqual(undefined)
  })

  it('tells of a pending transaction with no blobs, without it', () => {
    const told = readPendingTx(
      JSON.stringify({
        method: 'eth_subscription',
        params: { result: { type: '0x3', hash: '0x', from: '0x', to: null } },
      }),
    )

    expect(told).toEqual({ blobTx: undefined })
  })
})

function message(body: object) {
  return Buffer.from(JSON.stringify({ jsonrpc: '2.0', ...body }))
}

function rollupConfig(sender: string, inbox: string): LiveBlobsConfig {
  return {
    type: 'ethereum',
    daLayer: ProjectId('ethereum'),
    inbox,
    sequencers: [sender],
    sinceBlock: 0,
    projectId: ProjectId('rollup'),
  }
}

/** Lets the queued writes run */
function flush() {
  return new Promise((resolve) => setImmediate(resolve))
}
