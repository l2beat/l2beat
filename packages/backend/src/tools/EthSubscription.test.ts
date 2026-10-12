import { Logger } from '@l2beat/backend-tools'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'
import { EthSubscription } from './EthSubscription'
import { MockWebSocket } from './test/MockWebSocket'

/**
 * Methodology: the node is a mock WebSocket fed the messages a node sends.
 * Tests assert what is subscribed to, which events reach the listener, and
 * when the line is opened again. Timers are faked, so the backoff and the
 * watchdog run on demand
 */
describe(EthSubscription.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  it('subscribes once connected', () => {
    const { sockets } = setup()

    sockets[0]?.simulateOpen()

    const sent = sockets[0]?.mockObject.send.calls.map((call) => call.args[0])
    expect(sent).toEqual([
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_subscribe',
        params: ['newHeads'],
      }),
    ])
  })

  it("hands on each event's result, and nothing else the node sends", () => {
    const { sockets, onEvent } = setup()

    sockets[0]?.simulateMessage(message({ id: 1, result: '0xsub' }))
    sockets[0]?.simulateMessage(Buffer.from('not json'))
    sockets[0]?.simulateMessage(event({ number: '0x1' }))

    expect(onEvent).toHaveBeenOnlyCalledWith({ number: '0x1' })
  })

  it('opens the line again, waiting longer after each try that brings nothing', () => {
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

  it('waits as little as at first once events flow again', () => {
    const { sockets } = setup()

    sockets[0]?.simulateClose()
    time.tick(1000)
    sockets[1]?.simulateMessage(event({}))
    sockets[1]?.simulateClose()
    time.tick(1000)

    expect(sockets.length).toEqual(3)
  })

  it('drops a line that went silent', () => {
    const { sockets } = setup()

    time.tick(SILENT_FOR * 1000)

    expect(sockets[0]?.mockObject.terminate).toHaveBeenCalled()
  })

  it('flows from the first event until the line drops or goes quiet', () => {
    const { subscription, sockets } = setup()
    expect(subscription.isFlowing()).toEqual(false)

    sockets[0]?.simulateMessage(event({}))
    expect(subscription.isFlowing()).toEqual(true)
    sockets[0]?.simulateClose()
    expect(subscription.isFlowing()).toEqual(false)
  })

  function setup() {
    const sockets: MockWebSocket[] = []
    const onEvent = mockFn((_: unknown) => {})
    const subscription = new EthSubscription(
      {
        url: 'wss://node',
        params: ['newHeads'],
        silentFor: SILENT_FOR,
        name: 'heads',
        openSocket: () => {
          const socket = new MockWebSocket()
          sockets.push(socket)
          return socket.mockObject
        },
      },
      Logger.SILENT,
    )
    subscription.start(onEvent)
    return { subscription, sockets, onEvent }
  }
})

const SILENT_FOR = 30

function event(result: object) {
  return message({
    method: 'eth_subscription',
    params: { subscription: '0xsub', result },
  })
}

function message(body: object) {
  return Buffer.from(JSON.stringify({ jsonrpc: '2.0', ...body }))
}
