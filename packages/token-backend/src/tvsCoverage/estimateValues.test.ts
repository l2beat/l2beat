import { expect, mockFn } from 'earl'
import {
  type ChainCall,
  type ChainCallResult,
  estimateValues,
  type MarketData,
  rowKey,
} from './estimateValues'
import type { CoverageResult, CoverageRow } from './model'

const TOKEN = '0x1111111111111111111111111111111111111111'
const ESCROW_A = '0x2222222222222222222222222222222222222222'
const ESCROW_B = '0x3333333333333333333333333333333333333333'
const ASSET = '0x4444444444444444444444444444444444444444'

describe(estimateValues.name, () => {
  it('values a chain token by total supply capped at circulating supply', async () => {
    const row = coverageRow({ decimals: 6 })
    const reader = fakeReader({
      'totalSupply:0x1111111111111111111111111111111111111111': 5_000_000n,
    })

    const { values } = await estimateValues(
      coverage([row]),
      reader,
      prices({ 'usd-coin': { priceUsd: 2, circulatingSupply: 3 } }),
    )

    expect(values.get(rowKey(row))).toEqual({
      amount: 3,
      cappedByCirculatingSupply: true,
      priceUsd: 2,
      valueUsd: 6,
      vaultAsset: undefined,
    })
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
      prices({ 'usd-coin': { priceUsd: 10, circulatingSupply: 1 } }),
    )

    expect(values.get(rowKey(row))).toEqual({
      amount: 5,
      cappedByCirculatingSupply: false,
      priceUsd: 10,
      valueUsd: 50,
      vaultAsset: undefined,
    })
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

  it('skips counted rows and non-EVM addresses', async () => {
    const reader = fakeReader({})
    const { values } = await estimateValues(
      coverage([
        coverageRow({ status: 'counted' }),
        coverageRow({ address: 'So11111111111111111111111111111111111111112' }),
      ]),
      reader,
      prices({}),
    )

    expect(values.size).toEqual(0)
    expect(reader.read).toHaveBeenCalledTimes(0)
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
      prices({ 'usd-coin': { priceUsd: 1, circulatingSupply: undefined } }),
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
  options: { escrows?: string[]; counted?: string[] } = {},
): CoverageResult {
  return {
    rows,
    isCounted: (_, token) =>
      (options.counted ?? []).includes(`${token.chain}:${token.address}`),
    escrowAddresses: () => options.escrows ?? [],
  }
}

function fakeReader(results: Record<string, ChainCallResult>) {
  return {
    read: mockFn(async (_: string, calls: ChainCall[]) =>
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
