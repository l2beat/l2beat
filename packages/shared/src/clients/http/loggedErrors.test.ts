import {
  formatEcsLog,
  formatJson,
  formatPlain,
  formatPretty,
  type LogEntry,
  Logger,
  utcTime,
} from '@l2beat/backend-tools'
import { expect } from 'earl'
import { EthRpcClient } from '../../clients2/EthRpcClient'
import { MockHttp } from '../../clients2/Http'
import { HttpTimeoutError } from './fetchWithTimeout'

// Fake credentials, shaped like the real ones that leaked into Elasticsearch
const ALCHEMY_KEY = 'FakeAlchemyKey0123456789abcdefXY'
const PROXY_KEY = 'fakeProxyKey42'
const QUERY_KEY = 'fakeQueryKey42'

describe('logged errors', () => {
  it('redact a key in the path of a node-fetch FetchError', () => {
    const host = 'degen-mainnet.g.alchemy.com'
    const error = new FetchError(
      `request to https://${host}/v2/${ALCHEMY_KEY} failed, reason: getaddrinfo ENOTFOUND ${host}`,
    )

    expectRedacted(logError(error), ALCHEMY_KEY, host)
  })

  it('redact the proxy key of an HttpTimeoutError', () => {
    const url = `https://rpc.l2beat.com/forknet/tvs_prod:${PROXY_KEY}`

    expectRedacted(
      logError(new HttpTimeoutError(url, 10_000)),
      PROXY_KEY,
      'rpc.l2beat.com/forknet/tvs_prod:REDACTED',
    )
  })

  it('redact a key that an RPC echoes in its error', async () => {
    const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
    const http = new MockHttp()
    http.queueResponse(
      200,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32000, message: `rate limited on ${url}` },
      }),
    )
    const error = await new EthRpcClient(http, url, () => 1)
      .getBlockNumber()
      .catch((e: unknown) => e)

    expectRedacted(logError(error), ALCHEMY_KEY, 'eth-mainnet.g.alchemy.com')
  })

  it('redact a key in the query string of a third-party error', () => {
    const error = new Error(
      `processing response error (body="", requestMethod="POST", url="https://rpc.example.com/?apikey=${QUERY_KEY}", code=SERVER_ERROR, version=web/5.7.1)`,
    )

    expectRedacted(
      logError(error),
      QUERY_KEY,
      'rpc.example.com/?apikey=REDACTED',
    )
  })

  it('redact a key passed in the message, parameters and their keys', () => {
    const url = `https://rpc.l2beat.com/ethereum/um_prod:${PROXY_KEY}`

    expectRedacted(
      log((logger) =>
        logger.error(`Failed to call ${url}`, { url, calls: { [url]: 1 } }),
      ),
      PROXY_KEY,
      'rpc.l2beat.com/ethereum/um_prod:REDACTED',
    )
  })
})

class FetchError extends Error {
  override name = 'FetchError'
}

function logError(error: unknown) {
  return log((logger) => logger.error('Update failed', error))
}

function log(write: (logger: Logger) => void): string[] {
  const entries: LogEntry[] = []
  const logger = new Logger({
    transports: [{ log: (entry) => entries.push(entry), flush: () => {} }],
  })
  write(logger)
  return entries.flatMap((entry) =>
    [formatEcsLog, formatJson, formatPlain(utcTime), formatPretty(utcTime)].map(
      (format) => format(entry),
    ),
  )
}

function expectRedacted(outputs: string[], secret: string, kept: string) {
  for (const output of outputs) {
    expect(output).not.toInclude(secret)
    expect(output).toInclude(kept)
  }
}
