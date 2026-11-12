import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { TokenDbClient } from '@l2beat/token-backend'
import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { InteropFinancialsReprocessLoop } from './InteropFinancialsReprocessLoop'

const CHAINS = [{ id: 'ethereum', type: 'evm' as const }]
const NOW = UnixTime(1_700_000_000)

describe(InteropFinancialsReprocessLoop.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install({ now: NOW * 1000 })
  })

  afterEach(() => {
    time.uninstall()
  })

  it('marks transfers of tokens that the token DB now identifies', async () => {
    const identified = EthereumAddress.random()
    const unknown = EthereumAddress.random()
    const identifiedStored = {
      chain: 'ethereum',
      address: Address32.from(identified),
    }
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getUnidentifiedTokensSince: mockFn().resolvesTo([
        identifiedStored,
        { chain: 'ethereum', address: Address32.from(unknown) },
        { chain: 'unsupported', address: Address32.from(identified) },
      ]),
      markUnidentifiedAsUnprocessed: mockFn().resolvesTo(5),
    })
    const getByChainAndAddress = mockFn().resolvesTo([
      tokenDbEntry(identified.toLowerCase()),
    ])
    const loop = new InteropFinancialsReprocessLoop(
      CHAINS,
      mockObject<Database>({ interopTransfer }),
      tokenDbClient(getByChainAndAddress),
      Logger.SILENT,
    )

    await loop.run()

    const since = NOW - UnixTime.DAY
    expect(interopTransfer.getUnidentifiedTokensSince).toHaveBeenOnlyCalledWith(
      since,
    )
    expect(getByChainAndAddress).toHaveBeenOnlyCalledWith([
      { chain: 'ethereum', address: identified.toLowerCase() },
      { chain: 'ethereum', address: unknown.toLowerCase() },
    ])
    expect(
      interopTransfer.markUnidentifiedAsUnprocessed,
    ).toHaveBeenOnlyCalledWith([identifiedStored], since)
  })

  it('does not mark transfers when no token is identified', async () => {
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getUnidentifiedTokensSince: mockFn().resolvesTo([
        {
          chain: 'ethereum',
          address: Address32.from(EthereumAddress.random()),
        },
      ]),
      markUnidentifiedAsUnprocessed: mockFn().resolvesTo(0),
    })
    const loop = new InteropFinancialsReprocessLoop(
      CHAINS,
      mockObject<Database>({ interopTransfer }),
      tokenDbClient(mockFn().resolvesTo([])),
      Logger.SILENT,
    )

    await loop.run()

    expect(interopTransfer.markUnidentifiedAsUnprocessed).not.toHaveBeenCalled()
  })

  it('does not query the token DB without unidentified tokens', async () => {
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getUnidentifiedTokensSince: mockFn().resolvesTo([]),
    })
    const getByChainAndAddress = mockFn().resolvesTo([])
    const loop = new InteropFinancialsReprocessLoop(
      CHAINS,
      mockObject<Database>({ interopTransfer }),
      tokenDbClient(getByChainAndAddress),
      Logger.SILENT,
    )

    await loop.run()

    expect(getByChainAndAddress).not.toHaveBeenCalled()
  })
})

function tokenDbClient(getByChainAndAddress: ReturnType<typeof mockFn>) {
  return mockObject<TokenDbClient>({
    deployedTokens: { getByChainAndAddress: { query: getByChainAndAddress } },
  } as any)
}

function tokenDbEntry(address: string) {
  return {
    deployedToken: {
      chain: 'ethereum',
      address,
      symbol: 'TEST',
      decimals: 18,
      ignored: false,
    },
    abstractToken: {
      id: 'abstract-id',
      coingeckoId: 'test-token',
      isPriceUnreliable: false,
    },
  }
}
