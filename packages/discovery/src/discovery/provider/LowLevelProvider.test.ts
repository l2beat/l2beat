import { expect, mockFn, mockObject } from 'earl'
import { LowLevelProvider } from './LowLevelProvider'
import type { IEtherscanClient } from '../../utils/IEtherscanClient'
import type { providers } from 'ethers'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { type InstalledClock, install } from '@sinonjs/fake-timers'

describe.only(LowLevelProvider.name, () => {
  const ETHERSCAN_PROVIDER = mockObject<IEtherscanClient>()
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
    )

    const result = await provider.call(EthereumAddress.random(), bytes, 10)

    expect(result).toEqual(bytes)
  })

  it('retries on server error until success', async () => {
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn()
        .throwsOnce(makeServerError())
        .throwsOnce(makeServerError())
        .returnsOnce(bytes.toString()),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
    )

    const result = provider.call(EthereumAddress.random(), bytes, 10)
    await time.runAllAsync()

    expect(await result).toEqual(bytes)
  })

  it('retries up to maximum attempts and then throws', async () => {
    const bytes = Bytes.randomOfLength(20)
    const ethersProvider = mockObject<providers.JsonRpcProvider>({
      call: mockFn().throws(makeServerError()),
    })
    const provider = new LowLevelProvider(
      ethersProvider,
      ethersProvider,
      ETHERSCAN_PROVIDER,
    )

    await expect(async () => {
      const result = provider.call(EthereumAddress.random(), bytes, 10)
      await time.runAllAsync()
      await result
    }).toBeRejectedWith('LowLevelProvider test')
  })

  const outOfGasMessage = [
    'out of gas', // normal
    'out of gas: out of gas', // whatever QucikNode is doing...
  ]
  for (const message of outOfGasMessage) {
    it(`does not retry on non-server error [${message}]`, async () => {
      const bytes = Bytes.randomOfLength(20)
      const ethersProvider = mockObject<providers.JsonRpcProvider>({
        call: mockFn().throwsOnce(makeServerError(message)),
      })
      const provider = new LowLevelProvider(
        ethersProvider,
        ethersProvider,
        ETHERSCAN_PROVIDER,
      )

      await expect(async () => {
        const result = provider.call(EthereumAddress.random(), bytes, 10)
        await time.runAllAsync()
        await result
      }).toBeRejectedWith('LowLevelProvider test')
    })
  }
})

function makeServerError(message: string = 'server not go brrrrr'): Error {
  const result = new Error('LowLevelProvider test') as any

  result['error'] = {
    code: 'SERVER_ERROR',
    error: { code: 123, message },
  }

  return result as Error
}
