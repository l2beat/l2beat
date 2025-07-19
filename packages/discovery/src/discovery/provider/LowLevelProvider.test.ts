import type { CoingeckoClient } from '@l2beat/shared'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import type { providers } from 'ethers'
import type { IEtherscanClient } from '../../utils/IEtherscanClient'
import { LowLevelProvider } from './LowLevelProvider'

const SERVER_ERROR = 'SERVER_ERROR'
const TIMEOUT = 'TIMEOUT'

describe(LowLevelProvider.name, () => {
  const ETHERSCAN_PROVIDER = mockObject<IEtherscanClient>()
  const COINGECKO_CLIENT = mockObject<CoingeckoClient>()

  let time: InstalledClock
  let originalConsole: {
    log: typeof console.log
    error: typeof console.error
  } = {
    log: console.log,
    error: console.error,
  }

  beforeEach(() => {
    originalConsole = { log: console.log, error: console.error }

    time = install()

    time.setTimeout = (callback, _, ...args) => {
      callback(...args)
      return 0
    }

    time.setInterval = (callback, _, ...args) => {
      callback(...args)
      return 0
    }

    console.error = () => {}
    console.log = () => {}
  })

  afterEach(() => {
    time.uninstall()
    console.log = originalConsole.log
    console.error = originalConsole.error
  })

  it('returns immediately on success', async () => {
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn().returnsOnce(bytes.toString()),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
      COINGECKO_CLIENT,
    )

    const result = await provider.call(EthereumAddress.random(), bytes, 10)

    expect(result).toEqual(bytes)
  })

  it('retries on server error until success', async () => {
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn()
        .throwsOnce(makeEthersError('random message', { code: SERVER_ERROR }))
        .throwsOnce(makeEthersError('random message', { code: SERVER_ERROR }))
        .returnsOnce(bytes.toString()),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
      COINGECKO_CLIENT,
    )

    const result = await provider.call(EthereumAddress.random(), bytes, 10)

    expect(result).toEqual(bytes)
  })

  it('retries up to maximum attempts and then throws', async () => {
    const errorMessage = 'test error message string'
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn().throws(
        makeEthersError(errorMessage, { code: SERVER_ERROR }),
      ),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
      COINGECKO_CLIENT,
    )

    await expect(
      provider.call(EthereumAddress.random(), bytes, 10),
    ).toBeRejectedWith(errorMessage)
  })

  const outOfGasMessage = [
    'out of gas', // normal
    'out of gas: out of gas', // whatever QucikNode is doing...
    'execution reverted',
    'gas uint64 overflow',
    'invalid opcode: INVALID',
  ]
  for (const message of outOfGasMessage) {
    it(`does not retry on non-server error [${message}]`, async () => {
      const bytes = Bytes.randomOfLength(20)
      const ethersProvider = mockObject<providers.JsonRpcProvider>({
        call: mockFn().throwsOnce(makeSubServerError(message)),
      })
      const provider = new LowLevelProvider(
        ethersProvider,
        ethersProvider,
        ETHERSCAN_PROVIDER,
        COINGECKO_CLIENT,
      )

      await expect(
        provider.call(EthereumAddress.random(), bytes, 10),
      ).toBeRejectedWith('LowLevelProvider test')
    })
  }

  it('does not retry on log size exceeded', async () => {
    const topErrorMessage =
      'processing response error (body="{"jsonrpc":"2.0","id":45,"error":{"code":-32602,"message":"Log response size exceeded. You can make eth_getLogs r'

    const error = makeEthersError(topErrorMessage, {
      reason: 'processing response error',
      code: 'SERVER_ERROR',
      error: makeEthersError('Log response size exceeded', {
        code: -32602,
        data: undefined,
      }),
      requestBody: '{}',
      requestMethod: 'POST',
      url: 'https://',
    })
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn().throwsOnce(error),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
      COINGECKO_CLIENT,
    )

    await expect(
      provider.call(EthereumAddress.random(), bytes, 10),
    ).toBeRejectedWith(topErrorMessage)
  })

  const errors = [
    makeEthersError('timeout', {
      code: TIMEOUT,
      reason: 'timeout',
      requestBody: '{}',
      requestMethod: 'POST',
      timeout: 120000,
    }),
    makeEthersError('bad response', {
      code: SERVER_ERROR,
      status: 502,
      headers: {
        'content-type': 'text/html',
        'content-length': '155',
        connection: 'keep-alive',
      },
      requestMethod: 'POST',
      url: 'https://',
    }),
    makeEthersError('missing response', {
      code: SERVER_ERROR,
      requestMethod: 'POST',
      serverError: { code: 'ETIMEDOUT' },
      url: 'https://',
    }),
    makeEthersError('processing response error', {
      reason: 'processing response error',
      code: 'SERVER_ERROR',
      body: '{}',
      error: makeEthersError('request timed out', {
        code: -32002,
        data: undefined,
      }),
      requestBody: '{}',
      requestMethod: 'POST',
      url: 'https://',
    }),
    makeEthersError('bad response', {
      reason: 'bad response',
      code: 'SERVER_ERROR',
      status: 503,
      headers: {
        'content-type': 'application/json',
        'content-length': '57',
        connection: 'keep-alive',
      },
      body: '{"error":"Internal server error. Forwarder error: 1000."}',
      requestBody: '{}',
      requestMethod: 'POST',
      url: 'https://',
    }),
  ]
  for (const error of errors) {
    it('does retry on different errors', async () => {
      const bytes = Bytes.randomOfLength(20)
      const ethersProvider = mockObject<providers.JsonRpcProvider>({
        call: mockFn().throwsOnce(error).returnsOnce(bytes.toString()),
      })
      const provider = new LowLevelProvider(
        ethersProvider,
        ethersProvider,
        ETHERSCAN_PROVIDER,
        COINGECKO_CLIENT,
      )
      const result = await provider.call(EthereumAddress.random(), bytes, 10)
      expect(result).toEqual(bytes)
    })
  }
})

// NOTE(radomski): I love ethers
function makeSubServerError(message = 'user message'): Error {
  return makeEthersError('LowLevelProvider test', {
    code: 'CALL_EXCEPTION',
    error: makeEthersError('processing response error', {
      code: SERVER_ERROR,
      error: makeEthersError(message, { code: -32000 }),
    }),
  })
}

function makeEthersError(
  message = 'user message',
  params: Record<string, unknown> = {},
): Error {
  const result = new Error(message) as any

  for (const key in params) {
    result[key] = params[key]
  }

  return result as Error
}
