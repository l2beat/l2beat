import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Coverage, CoverageRow, MintedCopy } from './coverage'
import {
  type ChainCall,
  type ChainCallResult,
  estimateValues,
  type MarketData,
  MissingRpcError,
  rowKey,
} from './estimateValues'
import { NetMinted } from './supplyChange'

const TOKEN = '0x1111111111111111111111111111111111111111'
const ESCROW_A = '0x2222222222222222222222222222222222222222'
const ESCROW_B = '0x3333333333333333333333333333333333333333'
const ASSET = '0x4444444444444444444444444444444444444444'
const MINTED = '0x5555555555555555555555555555555555555555'
const SINCE = UnixTime(100)

const noTransfers = new NetMinted(SINCE, [])

describe(estimateValues.name, () => {
  it('values a chain token by total supply capped at circulating supply', async () => {
    const row = coverageRow({ decimals: 6 })
    const reader = fakeReader({
      'totalSupply:0x1111111111111111111111111111111111111111': 5_000_000n,
    })

    const { values } = await estimateValues(
      coverage([row]),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 2,
          circulatingSupply: 3,
          circulatingSupplyUnknown: false,
        },
      }),
      noTransfers,
    )

    expect(values.get(rowKey(row))).toEqual({
      amount: 3,
      amountSource: 'circulatingSupply',
      amountGap: undefined,
      circulatingSupplyUnknown: false,
      escrowBalance: undefined,
      mintedCopy: undefined,
      priceUsd: 2,
      valueUsd: 6,
      vaultAsset: undefined,
      supplyChange: undefined,
    })
  })

  it('flags a total supply when CoinGecko does not know the circulating supply', async () => {
    const row = coverageRow({ decimals: 0 })
    const reader = fakeReader({ [`totalSupply:${TOKEN}`]: 10n })

    const { values } = await estimateValues(
      coverage([row]),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 1,
          circulatingSupply: undefined,
          circulatingSupplyUnknown: true,
        },
      }),
      noTransfers,
    )

    expect(values.get(rowKey(row))).toEqual(
      expect.subset({
        amount: 10,
        amountSource: 'totalSupply',
        circulatingSupplyUnknown: true,
        valueUsd: 10,
      }),
    )
  })

  it('values an escrow token by its balance in every project escrow', async () => {
    const row = coverageRow({ side: 'escrow', chain: 'ethereum', decimals: 0 })
    const reader = fakeReader({
      [`balanceOf:${TOKEN}:${ESCROW_A}`]: 2n,
      [`balanceOf:${TOKEN}:${ESCROW_B}`]: 3n,
    })

    const { values } = await estimateValues(
      coverage([row], { escrows: [ESCROW_A, ESCROW_B] }),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 10,
          circulatingSupply: 1,
          circulatingSupplyUnknown: false,
        },
      }),
      noTransfers,
    )

    expect(values.get(rowKey(row))).toEqual({
      amount: 5,
      amountSource: 'escrowBalance',
      amountGap: undefined,
      circulatingSupplyUnknown: false,
      escrowBalance: 5,
      mintedCopy: undefined,
      priceUsd: 10,
      valueUsd: 50,
      vaultAsset: undefined,
      supplyChange: undefined,
    })
  })

  it('fails an escrow amount when one of its balances cannot be read', async () => {
    const row = coverageRow({ side: 'escrow', chain: 'ethereum', decimals: 0 })
    const reader = fakeReader({
      [`balanceOf:${TOKEN}:${ESCROW_A}`]: 0n,
      [`totalSupply:${MINTED}`]: 900n,
    })

    const { values } = await estimateValues(
      coverage([row], {
        escrows: [ESCROW_A, ESCROW_B],
        minted: {
          chain: 'arbitrum',
          address: MINTED,
          symbol: 'USDC.e',
          decimals: 2,
        },
      }),
      reader,
      prices({}),
      noTransfers,
    )

    expect(values.get(rowKey(row))).toEqual(
      expect.subset({ amount: undefined, amountGap: 'readFailed' }),
    )
  })

  it('fails an escrow amount when its minted copy cannot be read', async () => {
    const row = coverageRow({ side: 'escrow', chain: 'ethereum', decimals: 0 })
    const minted = {
      chain: 'arbitrum',
      address: MINTED,
      symbol: 'USDC.e',
      decimals: 2,
    }
    const reader = fakeReader({ [`balanceOf:${TOKEN}:${ESCROW_A}`]: 0n })

    const listed = await estimateValues(
      coverage([row], { escrows: [ESCROW_A], minted }),
      reader,
      prices({}),
      noTransfers,
    )
    const unlisted = await estimateValues(
      coverage([row], { escrows: [], minted }),
      reader,
      prices({}),
      noTransfers,
    )

    for (const { values } of [listed, unlisted]) {
      expect(values.get(rowKey(row))).toEqual(
        expect.subset({ amount: undefined, amountGap: 'readFailed' }),
      )
    }
  })

  it('reads a call shared by several rows once', async () => {
    const rows = [
      coverageRow({ projectId: 'base' }),
      coverageRow({ projectId: 'other' }),
    ]
    const reader = fakeReader({ [`totalSupply:${TOKEN}`]: 1n })

    await estimateValues(coverage(rows), reader, prices({}), noTransfers)

    expect(reader.read).toHaveBeenCalledTimes(2)
    expect(reader.read).toHaveBeenNthCalledWith(
      1,
      'base',
      [
        { type: 'totalSupply', token: TOKEN },
        { type: 'vaultAsset', token: TOKEN },
      ],
      [],
      undefined,
    )
    expect(reader.read).toHaveBeenNthCalledWith(
      2,
      'base',
      [{ type: 'totalSupply', token: TOKEN }],
      [],
      SINCE,
    )
  })

  it('values an escrow token by its minted copy when that is larger', async () => {
    const row = coverageRow({ side: 'escrow', chain: 'ethereum', decimals: 0 })
    const reader = fakeReader({
      [`balanceOf:${TOKEN}:${ESCROW_A}`]: 0n,
      [`totalSupply:${MINTED}`]: 900n,
    })

    const { values } = await estimateValues(
      coverage([row], {
        escrows: [ESCROW_A],
        minted: {
          chain: 'arbitrum',
          address: MINTED,
          symbol: 'USDC.e',
          decimals: 2,
        },
      }),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 1,
          circulatingSupply: undefined,
          circulatingSupplyUnknown: false,
        },
      }),
      noTransfers,
    )

    expect(reader.read).toHaveBeenCalledWith(
      'arbitrum',
      [{ type: 'totalSupply', token: MINTED }],
      [],
      undefined,
    )
    expect(values.get(rowKey(row))).toEqual({
      amount: 9,
      amountSource: 'mintedSupply',
      amountGap: undefined,
      circulatingSupplyUnknown: false,
      escrowBalance: 0,
      mintedCopy: {
        chain: 'arbitrum',
        address: MINTED,
        symbol: 'USDC.e',
        decimals: 2,
        supply: 9,
      },
      priceUsd: 1,
      valueUsd: 9,
      vaultAsset: undefined,
      supplyChange: undefined,
    })
  })

  it('reads decimals on chain for tokens missing from the token DB', async () => {
    const row = coverageRow({ decimals: undefined })
    const reader = fakeReader({
      [`totalSupply:${TOKEN}`]: 2_000_000n,
      [`decimals:${TOKEN}`]: 6,
    })

    const { values } = await estimateValues(
      coverage([row]),
      reader,
      prices({}),
      noTransfers,
    )

    expect(values.get(rowKey(row))?.amount).toEqual(2)
  })

  it('flags vault tokens and whether the project counts their asset', async () => {
    const row = coverageRow({ decimals: 0 })
    const reader = fakeReader({
      [`totalSupply:${TOKEN}`]: 1n,
      [`vaultAsset:${TOKEN}`]: { address: ASSET, symbol: 'USDC' },
    })

    const { values } = await estimateValues(
      coverage([row], { counted: [`base:${ASSET}`] }),
      reader,
      prices({}),
      noTransfers,
    )

    expect(values.get(rowKey(row))?.vaultAsset).toEqual({
      address: ASSET,
      symbol: 'USDC',
      counted: true,
    })
    expect(values.get(rowKey(row))?.valueUsd).toEqual(undefined)
  })

  it('skips counted rows and says why other rows have no amount', async () => {
    const nonEvm = coverageRow({
      address: 'So11111111111111111111111111111111111111112',
    })
    const native = coverageRow({ address: 'native' })
    const noEscrows = coverageRow({ side: 'escrow', chain: 'ethereum' })
    const reader = fakeReader({})

    const { values } = await estimateValues(
      coverage([coverageRow({ status: 'counted' }), nonEvm, native, noEscrows]),
      reader,
      prices({}),
      noTransfers,
    )

    expect(Array.from(values.values()).map((value) => value.amountGap)).toEqual(
      ['nonEvm', 'nativeSupply', 'noEscrows'],
    )
    expect(reader.read).toHaveBeenCalledTimes(0)
  })

  it('tells a chain without an RPC apart from a failed read', async () => {
    const noRpc = coverageRow({ chain: 'scroll' })
    const failed = coverageRow()
    const reader = {
      read: mockFn(async (chain: string, calls: ChainCall[]) => {
        if (chain === 'scroll') throw new MissingRpcError('scroll')
        return calls.map(() => undefined)
      }),
    }

    const { values, warnings } = await estimateValues(
      coverage([noRpc, failed]),
      reader,
      prices({}),
      noTransfers,
    )

    expect(values.get(rowKey(noRpc))?.amountGap).toEqual('noRpc')
    expect(values.get(rowKey(failed))?.amountGap).toEqual('readFailed')
    expect(warnings).toEqual(['Reading scroll failed: No RPC in the token DB'])
  })

  it('reports a failing chain and keeps other values', async () => {
    const failing = coverageRow({ chain: 'failing', decimals: 0 })
    const working = coverageRow({ decimals: 0 })
    const reader = {
      read: mockFn(async (chain: string, calls: ChainCall[]) => {
        if (chain === 'failing') throw new Error('timeout')
        return calls.map((call) =>
          call.type === 'totalSupply' ? 7n : undefined,
        )
      }),
    }

    const { values, warnings } = await estimateValues(
      coverage([failing, working]),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 1,
          circulatingSupply: undefined,
          circulatingSupplyUnknown: false,
        },
      }),
      noTransfers,
    )

    expect(warnings).toEqual(['Reading failing failed: timeout'])
    expect(values.get(rowKey(failing))?.valueUsd).toEqual(undefined)
    expect(values.get(rowKey(working))?.valueUsd).toEqual(7)
  })

  it('compares the uncapped total supply with the one before the transfers', async () => {
    const row = coverageRow({ decimals: undefined })
    const reader = fakeReader(
      { [`totalSupply:${TOKEN}`]: 5_000_000n, [`decimals:${TOKEN}`]: 6 },
      { [`totalSupply:${TOKEN}`]: 4_000_000n },
    )

    const { values, stats } = await estimateValues(
      coverage([row]),
      reader,
      prices({
        'usd-coin': {
          priceUsd: 2,
          circulatingSupply: 3,
          circulatingSupplyUnknown: false,
        },
      }),
      new NetMinted(SINCE, [
        {
          plugin: 'cctp-v2',
          chain: 'base',
          tokenAddress: TOKEN,
          netMinted: 250_000n,
          transferCount: 1,
          unknownCount: 0,
          valueUsd: 1,
          unknownValueUsd: 0,
        },
      ]),
    )

    expect(values.get(rowKey(row))?.supplyChange).toEqual({
      since: SINCE,
      amount: 1,
      netMintedByBridge: [
        { plugin: 'cctp-v2', amount: 0.25, unknownTransfers: 0 },
      ],
      unexplained: 0.75,
      unexplainedUsd: 1.5,
    })
    expect(stats).toEqual(
      expect.subset({ chainCalls: 3, pastSupplyCalls: 1, supplyChanges: 1 }),
    )
  })

  it("compares the supply of an escrow row's minted copy", async () => {
    const rows = [
      coverageRow({ side: 'escrow', chain: 'ethereum', decimals: 0 }),
      coverageRow({ chain: 'arbitrum', address: MINTED, decimals: 2 }),
    ]
    const reader = fakeReader(
      {
        [`balanceOf:${TOKEN}:${ESCROW_A}`]: 0n,
        [`totalSupply:${MINTED}`]: 900n,
      },
      { [`totalSupply:${MINTED}`]: 800n },
    )

    const { values } = await estimateValues(
      coverage(rows, {
        escrows: [ESCROW_A],
        minted: {
          chain: 'arbitrum',
          address: MINTED,
          symbol: 'USDC.e',
          decimals: 2,
        },
      }),
      reader,
      prices({}),
      noTransfers,
    )

    expect(reader.read).toHaveBeenCalledWith(
      'arbitrum',
      [{ type: 'totalSupply', token: MINTED }],
      [],
      SINCE,
    )
    for (const row of rows) {
      expect(values.get(rowKey(row))?.supplyChange).toEqual(
        expect.subset({ amount: 1, unexplained: 1, unexplainedUsd: undefined }),
      )
    }
  })

  it('has no supply change when either supply cannot be read', async () => {
    const failed = coverageRow()
    const notDeployedYet = coverageRow({ address: ASSET })
    const reader = fakeReader({ [`totalSupply:${ASSET}`]: 1n })

    const { values } = await estimateValues(
      coverage([failed, notDeployedYet]),
      reader,
      prices({}),
      noTransfers,
    )

    expect(reader.read).toHaveBeenLastCalledWith(
      'base',
      [{ type: 'totalSupply', token: ASSET }],
      [],
      SINCE,
    )
    expect(values.get(rowKey(failed))?.supplyChange).toEqual(undefined)
    expect(values.get(rowKey(notDeployedYet))?.supplyChange).toEqual(undefined)
  })
})

function coverageRow(overrides: Partial<CoverageRow> = {}): CoverageRow {
  return {
    projectId: 'base',
    side: 'chain',
    chain: 'base',
    address: TOKEN,
    symbol: 'USDC',
    decimals: 18,
    abstractTokenId: 'circle.USDC',
    abstractSymbol: 'USDC',
    issuer: 'circle',
    iconUrl: undefined,
    coingeckoId: 'usd-coin',
    pricing: { coingeckoId: 'usd-coin', via: undefined },
    ignored: false,
    status: 'missing',
    countedVia: undefined,
    role: undefined,
    bridges: [],
    volumeUsd: 0,
    transferCount: 0,
    lastSeen: 0,
    pairedWith: undefined,
    ...overrides,
  }
}

function coverage(
  rows: CoverageRow[],
  options: { escrows?: string[]; counted?: string[]; minted?: MintedCopy } = {},
): Coverage {
  return mockObject<Coverage>({
    rows,
    isCounted: (_, token) =>
      (options.counted ?? []).includes(`${token.chain}:${token.address}`),
    escrowAddresses: () => options.escrows ?? [],
    mintedCopy: () => options.minted,
  })
}

function fakeReader(
  results: Record<string, ChainCallResult>,
  pastResults: Record<string, ChainCallResult> = {},
) {
  return {
    read: mockFn(
      async (
        _chain: string,
        calls: ChainCall[],
        _: string[],
        before?: UnixTime,
      ) =>
        calls.map((call) => {
          const key =
            call.type === 'balanceOf'
              ? `${call.type}:${call.token}:${call.holder}`
              : `${call.type}:${call.token}`
          return (before === undefined ? results : pastResults)[key]
        }),
    ),
  }
}

function prices(data: Record<string, MarketData>) {
  return {
    getMarketData: async (ids: string[]) =>
      new Map(
        ids.flatMap((id) => {
          const market = data[id]
          return market ? [[id, market] as const] : []
        }),
      ),
  }
}
