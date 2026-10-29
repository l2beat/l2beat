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

const TOKEN = '0x1111111111111111111111111111111111111111'
const ESCROW_A = '0x2222222222222222222222222222222222222222'
const ESCROW_B = '0x3333333333333333333333333333333333333333'
const ASSET = '0x4444444444444444444444444444444444444444'
const MINTED = '0x5555555555555555555555555555555555555555'

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
    )

    expect(values.get(rowKey(row))).toEqual(
      expect.subset({ amount: undefined, amountGap: 'readFailed' }),
    )
  })

  it('reads a call shared by several rows once', async () => {
    const rows = [
      coverageRow({ projectId: 'base' }),
      coverageRow({ projectId: 'other' }),
    ]
    const reader = fakeReader({ [`totalSupply:${TOKEN}`]: 1n })

    await estimateValues(coverage(rows), reader, prices({}))

    expect(reader.read).toHaveBeenOnlyCalledWith(
      'base',
      [
        { type: 'totalSupply', token: TOKEN },
        { type: 'vaultAsset', token: TOKEN },
      ],
      [],
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
    )

    expect(reader.read).toHaveBeenCalledWith(
      'arbitrum',
      [{ type: 'totalSupply', token: MINTED }],
      [],
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
    })
  })

  it('reads decimals on chain for tokens missing from the token DB', async () => {
    const row = coverageRow({ decimals: undefined })
    const reader = fakeReader({
      [`totalSupply:${TOKEN}`]: 2_000_000n,
      [`decimals:${TOKEN}`]: 6,
    })

    const { values } = await estimateValues(coverage([row]), reader, prices({}))

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
    )

    expect(warnings).toEqual(['Reading failing failed: timeout'])
    expect(values.get(rowKey(failing))?.valueUsd).toEqual(undefined)
    expect(values.get(rowKey(working))?.valueUsd).toEqual(7)
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

function fakeReader(results: Record<string, ChainCallResult>) {
  return {
    read: mockFn(async (_chain: string, calls: ChainCall[], _: string[]) =>
      calls.map((call) => {
        const key =
          call.type === 'balanceOf'
            ? `${call.type}:${call.token}:${call.holder}`
            : `${call.type}:${call.token}`
        return results[key]
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
