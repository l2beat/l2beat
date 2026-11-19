import { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { RoutescanClient } from './RoutescanClient'

// Methodology: time is faked, so the retry waits pass without sleeping.
describe(RoutescanClient.name, () => {
  const URL = 'http://example.com'
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  it('does not retry an HTTP 4xx that a retry cannot fix', async () => {
    const error = new Error('HTTP error: 404 Not Found', {
      cause: { url: URL, status: 404 },
    })
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn().rejectsWith(error),
    })
    const client = new RoutescanClient(httpClient, Logger.SILENT, URL, 0)

    const result = client
      .callWithRetries('contract', 'getsourcecode', {})
      .catch((e: unknown) => e)
    await time.runAllAsync()

    expect(await result).toEqual(error)
    expect(httpClient.fetch).toHaveBeenCalledTimes(1)
  })

  it('retries a NOTOK result and an HTTP 5xx', async () => {
    const httpClient = mockObject<HttpClient>({
      fetch: mockFn()
        .resolvesToOnce({ message: 'NOTOK', result: 'Max rate limit reached' })
        .rejectsWithOnce(
          new Error('HTTP error: 502 Bad Gateway', {
            cause: { url: URL, status: 502 },
          }),
        )
        .resolvesToOnce({ message: 'OK', result: 'value' }),
    })
    const client = new RoutescanClient(httpClient, Logger.SILENT, URL, 0)

    const result = client.callWithRetries('contract', 'getsourcecode', {})
    await time.runAllAsync()

    expect(await result).toEqual('value')
    expect(httpClient.fetch).toHaveBeenCalledTimes(3)
  })
})
