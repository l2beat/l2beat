import { expect } from 'earl'
import {
  type Filters,
  filterRows,
  type Names,
  type Row,
  sortRows,
} from './rows'

const NOW = 100 * 24 * 60 * 60
const names: Names = { project: (id) => id, bridge: (id) => id }
const filters: Filters = {
  status: 'all',
  project: 'all',
  side: 'all',
  seenWithinDays: undefined,
  minValueUsd: 0,
  search: '',
  showIgnored: true,
}

describe(filterRows.name, () => {
  it('hides ignored tokens unless asked', () => {
    const rows = [
      row({ address: '0x1' }),
      row({ address: '0x2', ignored: true }),
    ]

    expect(
      addresses(
        filterRows(rows, { ...filters, showIgnored: false }, names, NOW),
      ),
    ).toEqual(['0x1'])
    expect(addresses(filterRows(rows, filters, names, NOW))).toEqual([
      '0x1',
      '0x2',
    ])
  })

  it('groups statuses into missing, review, unpriced and counted', () => {
    const rows = [
      row({ address: '0x1', status: 'missing' }),
      row({ address: '0x2', status: 'sameAssetOnly' }),
      row({ address: '0x3', status: 'missing', value: value(undefined) }),
      row({ address: '0x4', status: 'countedViaCounterpart' }),
      row({ address: '0x5', status: 'counted' }),
    ]

    const pick = (status: Filters['status']) =>
      addresses(filterRows(rows, { ...filters, status }, names, NOW))
    expect(pick('missing')).toEqual(['0x1', '0x3'])
    expect(pick('review')).toEqual(['0x2'])
    expect(pick('unpriced')).toEqual(['0x3'])
    expect(pick('counted')).toEqual(['0x4', '0x5'])
  })

  it('filters by side, recency, value and search', () => {
    const rows = [
      row({ address: '0x1', side: 'escrow', lastSeen: NOW - 2 * 86_400 }),
      row({ address: '0x2', lastSeen: NOW - 20 * 86_400, value: value(500) }),
      row({ address: '0x3', symbol: 'wstETH', value: value(5_000) }),
    ]

    expect(
      addresses(filterRows(rows, { ...filters, side: 'escrow' }, names, NOW)),
    ).toEqual(['0x1'])
    expect(
      addresses(
        filterRows(rows, { ...filters, seenWithinDays: 7 }, names, NOW),
      ),
    ).toEqual(['0x1', '0x3'])
    expect(
      addresses(
        filterRows(rows, { ...filters, minValueUsd: 1_000 }, names, NOW),
      ),
    ).toEqual(['0x3'])
    expect(
      addresses(filterRows(rows, { ...filters, search: 'WSTETH' }, names, NOW)),
    ).toEqual(['0x3'])
  })
})

describe(sortRows.name, () => {
  it('sorts by value and keeps unknown values last in both directions', () => {
    const rows = [
      row({ address: '0x1', value: value(10) }),
      row({ address: '0x2', value: undefined }),
      row({ address: '0x3', value: value(30) }),
    ]

    expect(
      addresses(sortRows(rows, { key: 'value', direction: 'desc' }, names)),
    ).toEqual(['0x3', '0x1', '0x2'])
    expect(
      addresses(sortRows(rows, { key: 'value', direction: 'asc' }, names)),
    ).toEqual(['0x1', '0x3', '0x2'])
  })

  it('sorts values without a circulating supply after the other values', () => {
    const rows = [
      row({ address: '0x1', value: value(10) }),
      row({ address: '0x2', value: value(1_000, true) }),
      row({ address: '0x3', value: undefined }),
      row({ address: '0x4', value: value(30) }),
    ]

    expect(
      addresses(sortRows(rows, { key: 'value', direction: 'desc' }, names)),
    ).toEqual(['0x4', '0x1', '0x2', '0x3'])
  })
})

function addresses(rows: Row[]) {
  return rows.map((row) => row.address)
}

function value(
  valueUsd: number | undefined,
  circulatingSupplyUnknown = false,
): Row['value'] {
  return {
    amount: 1,
    amountSource: 'totalSupply',
    amountGap: undefined,
    circulatingSupplyUnknown,
    escrowBalance: undefined,
    mintedCopy: undefined,
    priceUsd: valueUsd,
    valueUsd,
    vaultAsset: undefined,
  }
}

function row(overrides: Partial<Row>): Row {
  return {
    projectId: 'base',
    side: 'chain',
    chain: 'base',
    address: '0x0',
    symbol: 'USDC',
    decimals: 6,
    abstractTokenId: undefined,
    abstractSymbol: undefined,
    issuer: undefined,
    iconUrl: undefined,
    coingeckoId: undefined,
    pricing: { coingeckoId: 'usd-coin', via: undefined },
    ignored: false,
    status: 'missing',
    countedVia: undefined,
    role: undefined,
    bridges: [],
    volumeUsd: 0,
    transferCount: 0,
    lastSeen: NOW,
    value: value(1),
    escrowAddresses: [],
    ...overrides,
  }
}
