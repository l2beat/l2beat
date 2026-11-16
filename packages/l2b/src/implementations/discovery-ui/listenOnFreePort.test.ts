import { expect } from 'earl'
import { createServer, type Server } from 'http'
import type { AddressInfo } from 'net'
import { listenOnFreePort } from './listenOnFreePort'

// Occupies a port with one real server, then asks a second server to start
// there; it must move to a later port, or fail when it may not move.
describe(listenOnFreePort.name, () => {
  let taken: Server
  let takenPort = 0
  let server: Server

  before(async () => {
    taken = createServer().listen(0)
    await new Promise((resolve) => taken.once('listening', resolve))
    takenPort = (taken.address() as AddressInfo).port
  })

  beforeEach(() => {
    server = createServer()
  })

  afterEach(() => server.close())

  after(() => taken.close())

  it('moves to the next port when the first is taken', async () => {
    const port = await listenOnFreePort(server, takenPort, 10)
    expect(port).toBeGreaterThan(takenPort)
    expect((server.address() as AddressInfo).port).toEqual(port)
  })

  it('fails when every allowed port is taken', async () => {
    await expect(listenOnFreePort(server, takenPort, 1)).toBeRejectedWith(
      'No free port',
    )
    expect(server.listening).toEqual(false)
  })
})
