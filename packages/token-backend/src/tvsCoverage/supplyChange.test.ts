import type {
  Database,
  InteropTransferSupplyChangeRecord,
} from '@l2beat/database'
import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { loadNetMinted, NetMinted, type TokenSupply } from './supplyChange'

const NOW = UnixTime(10 * UnixTime.DAY)
const SINCE = UnixTime(NOW - 7 * UnixTime.DAY + UnixTime.HOUR)
const ARB_USDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831'

describe(NetMinted.name, () => {
  it('splits the supply change into what each bridge minted and the rest', () => {
    const netMinted = new NetMinted(SINCE, [
      // Lock-and-mint: deposits minted, withdrawals burned.
      transfers({
        plugin: 'orbitstack-standardgateway',
        netMinted: 30_000_000n,
      }),
      transfers({
        plugin: 'orbitstack-standardgateway',
        netMinted: -5_000_000n,
      }),
      // Burn-and-mint, recorded under the padded address.
      transfers({
        plugin: 'cctp-v2',
        tokenAddress: Address32.from(EthereumAddress(ARB_USDC)),
        netMinted: 8_000_000n,
      }),
      transfers({ plugin: 'relay', netMinted: 0n }),
      transfers({ chain: 'base', plugin: 'cctp-v2', netMinted: 1_000_000n }),
    ])

    expect(netMinted.supplyChange(supply(150), 100, 2)).toEqual({
      since: SINCE,
      amount: 50,
      netMintedByBridge: [
        {
          plugin: 'orbitstack-standardgateway',
          amount: 25,
          unknownTransfers: 0,
        },
        { plugin: 'cctp-v2', amount: 8, unknownTransfers: 0 },
      ],
      unexplained: 17,
      unexplainedUsd: 34,
    })
  })

  it('keeps bridges whose transfers do not say what they minted', () => {
    const netMinted = new NetMinted(SINCE, [
      transfers({
        plugin: 'hyperlane-merkly',
        netMinted: 0n,
        unknownCount: 3,
      }),
    ])

    expect(netMinted.supplyChange(supply(90), 100, undefined)).toEqual({
      since: SINCE,
      amount: -10,
      netMintedByBridge: [
        { plugin: 'hyperlane-merkly', amount: 0, unknownTransfers: 3 },
      ],
      unexplained: -10,
      unexplainedUsd: undefined,
    })
  })
})

describe(loadNetMinted.name, () => {
  it('counts transfers since an hour inside their retention', async () => {
    const getSupplyChangesSince = mockFn().resolvesTo([
      transfers({
        plugin: 'hyperlane-merkly',
        netMinted: 0n,
        transferCount: 4,
        unknownCount: 1,
        valueUsd: 100,
        unknownValueUsd: 10,
      }),
      transfers({ plugin: 'cctp-v2', netMinted: 1_000_000n }),
    ])
    const db = mockObject<Database>({
      interopTransfer: mockObject<Database['interopTransfer']>({
        getSupplyChangesSince,
      }),
    })

    const { netMinted, stats } = await loadNetMinted(db, NOW)

    expect(getSupplyChangesSince).toHaveBeenOnlyCalledWith(SINCE)
    expect(netMinted.since).toEqual(SINCE)
    expect(netMinted.supplyChange(supply(1), 0, 1).unexplained).toEqual(0)
    expect(stats).toEqual({
      since: SINCE,
      queryMs: expect.a(Number),
      unknownFlags: [
        {
          plugin: 'hyperlane-merkly',
          sides: 4,
          unknownShare: 0.25,
          unknownUsdShare: 0.1,
        },
      ],
    })
  })
})

function supply(amount: number): TokenSupply {
  return { chain: 'arbitrum', address: ARB_USDC, amount, decimals: 6 }
}

function transfers(
  overrides: Partial<InteropTransferSupplyChangeRecord> &
    Pick<InteropTransferSupplyChangeRecord, 'plugin' | 'netMinted'>,
): InteropTransferSupplyChangeRecord {
  return {
    chain: 'arbitrum',
    tokenAddress: ARB_USDC,
    transferCount: 1,
    unknownCount: 0,
    valueUsd: 1,
    unknownValueUsd: 0,
    ...overrides,
  }
}
