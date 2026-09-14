import { expect } from 'earl'
import { withServer } from '../../test/withServer'
import { fetchWithTimeout, HttpTimeoutError } from './fetchWithTimeout'

// Why: CI runners are slow enough that a loopback round trip can take tens of
// milliseconds, so every timeout that must NOT fire gets this much headroom.
const SLACK_MS = 250

describe(fetchWithTimeout.name, () => {
  it('aborts when no headers arrive in time', async () => {
    await withServer(
      () => {},
      async (url) => {
        const error = await fetchWithTimeout(url, { timeout: 20 }).catch(
          (e: unknown) => e,
        )
        expect(error).toBeA(HttpTimeoutError)
        expect((error as Error).message).toInclude('for 20ms')
      },
    )
  })

  it('aborts when the body stalls, surfacing the timeout from the body read', async () => {
    await withServer(
      (_, res) => {
        res.writeHead(200)
        res.write('{"a":')
      },
      async (url) => {
        const response = await fetchWithTimeout(url, { timeout: SLACK_MS })
        const error = await response.text().catch((e: unknown) => e)
        expect(error).toBeA(HttpTimeoutError)
      },
    )
  })

  // How: the body drips in chunks whose total duration exceeds the timeout,
  // so a wall-clock timeout would fail while an idle timeout survives.
  // The gap stays far below the timeout so a busy CI runner cannot stall it.
  it('restarts the clock on every chunk instead of measuring wall clock', async () => {
    const chunks = 10
    const gapMs = SLACK_MS / 5
    const timeout = SLACK_MS
    await withServer(
      (_, res) => {
        res.writeHead(200)
        let sent = 0
        const drip = setInterval(() => {
          res.write('x')
          if (++sent === chunks) {
            clearInterval(drip)
            res.end()
          }
        }, gapMs)
      },
      async (url) => {
        const response = await fetchWithTimeout(url, { timeout })
        expect(await response.text()).toEqual('x'.repeat(chunks))
      },
    )
  })

  it('never times out when timeout is 0', async () => {
    await withServer(
      (_, res) => setTimeout(() => res.end('ok'), 30),
      async (url) => {
        const response = await fetchWithTimeout(url, { timeout: 0 })
        expect(await response.text()).toEqual('ok')
      },
    )
  })

  it('keeps status, headers and the caller signal', async () => {
    const controller = new AbortController()
    await withServer(
      (_, res) => {
        res.writeHead(201, { 'x-test': 'yes' })
        res.end('ok')
      },
      async (url) => {
        const response = await fetchWithTimeout(url, {
          signal: controller.signal,
        })
        expect(response.status).toEqual(201)
        expect(response.headers.get('x-test')).toEqual('yes')
        expect(await response.text()).toEqual('ok')
      },
    )
  })

  it('throws the underlying network error instead of "fetch failed"', async () => {
    // withServer closes the server, so the port is refused afterwards
    const closedUrl = await withServer(
      () => {},
      async (url) => url,
    )
    const error = await fetchWithTimeout(closedUrl, {}).catch((e: unknown) => e)
    expect(error).toBeA(Error)
    expect((error as Error).message).toInclude('ECONNREFUSED')
  })

  it('handles responses without a body', async () => {
    await withServer(
      (_, res) => res.writeHead(204).end(),
      async (url) => {
        const response = await fetchWithTimeout(url, {})
        expect(response.status).toEqual(204)
      },
    )
  })

  // Why: callers like DiscordClient.deleteMessage only look at the status.
  // The idle timer then aborts the dangling body, which must stay quiet.
  it('aborts the dangling body without an unhandled rejection', async () => {
    const rejections: unknown[] = []
    const onRejection = (reason: unknown) => rejections.push(reason)
    process.on('unhandledRejection', onRejection)
    try {
      await withServer(
        (_, res) => {
          res.writeHead(200)
          res.write('partial')
        },
        async (url) => {
          const response = await fetchWithTimeout(url, { timeout: SLACK_MS })
          expect(response.ok).toEqual(true)
          await new Promise((resolve) => setTimeout(resolve, SLACK_MS * 2))
        },
      )
      await new Promise((resolve) => setImmediate(resolve))
      expect(rejections).toEqual([])
    } finally {
      process.off('unhandledRejection', onRejection)
    }
  })
})
