import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn } from 'earl'
import { lookupSignatures, type SignatureResult } from './api'

// Methodology: fetch is stubbed and the clock is fake, so every wait between
// attempts is skipped by advancing time far past the longest allowed backoff.
describe(lookupSignatures.name, () => {
  const realFetch = globalThis.fetch
  const selector = '0xa9059cbb'
  const signatures: SignatureResult[] = [
    { selector, signature: 'transfer(address,uint256)' },
  ]
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
    globalThis.fetch = realFetch
  })

  async function settle(fetchStub: typeof fetch) {
    globalThis.fetch = fetchStub
    const outcome = lookupSignatures([selector]).then(
      (value) => ({ value, error: undefined }),
      (error: Error) => ({ value: undefined, error }),
    )
    await time.tickAsync(60_000)
    return await Promise.race([outcome, Promise.resolve('pending' as const)])
  }

  it('gives up after four attempts when the API keeps answering 500', async () => {
    const fetchStub = mockFn(async () => new Response('down', { status: 500 }))

    const outcome = await settle(fetchStub)

    expect(fetchStub).toHaveBeenCalledTimes(4)
    expect(outcome).not.toEqual('pending')
    expect(outcome).toEqual({
      value: undefined,
      error: new Error('HTTP error', { cause: { status: 500 } }),
    })
  })

  it('fails at once on a 4xx, which no retry can fix', async () => {
    const fetchStub = mockFn(
      async () => new Response('{"error":"bad"}', { status: 400 }),
    )

    const outcome = await settle(fetchStub)

    expect(fetchStub).toHaveBeenCalledTimes(1)
    expect(outcome).toEqual({
      value: undefined,
      error: new Error('HTTP error', { cause: { status: 400 } }),
    })
  })

  it('retries a rate limit and returns the later success', async () => {
    const fetchStub = mockFn<typeof fetch>()
      .resolvesToOnce(new Response('slow down', { status: 429 }))
      .resolvesTo(Response.json(signatures))

    const outcome = await settle(fetchStub)

    expect(fetchStub).toHaveBeenCalledTimes(2)
    expect(outcome).toEqual({ value: signatures, error: undefined })
  })

  it('retries a 500 and returns the later success', async () => {
    const fetchStub = mockFn<typeof fetch>()
      .resolvesToOnce(new Response('{"error":"down"}', { status: 500 }))
      .resolvesToOnce(new Response(JSON.stringify(signatures)))

    const outcome = await settle(fetchStub)

    expect(fetchStub).toHaveBeenCalledTimes(2)
    expect(outcome).toEqual({ value: signatures, error: undefined })
  })

  it('retries a request that never got a response', async () => {
    const fetchStub = mockFn<typeof fetch>()
      .rejectsWithOnce(new TypeError('fetch failed'))
      .resolvesToOnce(new Response(JSON.stringify(signatures)))

    const outcome = await settle(fetchStub)

    expect(fetchStub).toHaveBeenCalledTimes(2)
    expect(outcome).toEqual({ value: signatures, error: undefined })
  })
})
