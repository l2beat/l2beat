import { expect } from 'earl'
import { getPrivacyProjectAmountAnalysis } from './getPrivacyProjectAmountAnalysis'
import {
  aggregateAmountRecords,
  type CsvFieldGetter,
  computeAddressOverlap,
  normalizePrivacyPoolsRow,
  normalizeRailgunWithdrawalRow,
  normalizeTornadoWithdrawalRow,
  normalizeTrxsDepositRow,
  type PrivacyAmountRecord,
  parseDecimalToRaw,
  ZERO_ADDRESS,
} from './privacyAmountAnalysisUtils'
import { getPrivacyAmountBucket } from './privacyAmountBuckets'
import { amountToUsd, tryGetPrivacyTokenInfo } from './privacyUtils'

const ETH = tryGetPrivacyTokenInfo({ ticker: 'ETH' })
const USDC = tryGetPrivacyTokenInfo({ ticker: 'USDC' })
const WETH = tryGetPrivacyTokenInfo({ ticker: 'WETH' })

function row(fields: Record<string, string>): CsvFieldGetter {
  return (column) => fields[column]
}

function record(overrides: Partial<PrivacyAmountRecord>): PrivacyAmountRecord {
  return {
    address: '0xabc',
    tokenKey: 'ETH',
    decimals: 18,
    priceUsd: ETH?.price ?? null,
    rawAmount: 0n,
    ...overrides,
  }
}

describe('getPrivacyProjectAmountAnalysis', () => {
  it('disables the section for unsupported projects', () => {
    const result = getPrivacyProjectAmountAnalysis({ projectId: 'aztec' })
    expect(result.sectionEnabled).toEqual(false)
    expect(result.deposits.addressCount).toEqual(0)
    expect(result.withdrawals.addressCount).toEqual(0)
  })
})

describe('normalizeTrxsDepositRow', () => {
  it('derives the Tornado deposit amount from the bucket denomination, not the row amount', () => {
    const normalized = normalizeTrxsDepositRow(
      row({
        protocol: 'tornado-cash',
        bucket: 'tornado-ETH-1',
        sender: '0xAbCDef0000000000000000000000000000000001',
        // Arbitrary junk amount that must be ignored for Tornado.
        amount: '999999999999999999999',
        token: 'ethereum',
      }),
    )

    expect(normalized).not.toEqual(undefined)
    expect(normalized?.projectId).toEqual('tornado-cash')
    expect(normalized?.direction).toEqual('deposit')
    expect(normalized?.record.address).toEqual(
      '0xabcdef0000000000000000000000000000000001',
    )
    expect(normalized?.record.tokenKey).toEqual('ETH')
    // 1 ETH from the bucket, not the junk `amount`.
    expect(normalized?.record.rawAmount).toEqual(parseDecimalToRaw('1', 18))
  })

  it('uses sender and raw amount for Railgun deposits with no Relay Adapter filtering', () => {
    const normalized = normalizeTrxsDepositRow(
      row({
        protocol: 'railgun',
        bucket: 'railgun-USDC',
        sender: '0xSENDER000000000000000000000000000000ABCD',
        amount: '1000000',
        token: 'usd-coin',
      }),
    )

    expect(normalized?.projectId).toEqual('railgun')
    expect(normalized?.direction).toEqual('deposit')
    expect(normalized?.record.address).toEqual(
      '0xsender000000000000000000000000000000abcd',
    )
    expect(normalized?.record.tokenKey).toEqual('USDC')
    expect(normalized?.record.rawAmount).toEqual(1_000_000n)
  })
})

describe('normalizeTornadoWithdrawalRow', () => {
  const base = {
    bucket: 'tornado-ETH-0.1',
    token: 'ethereum',
    token_address: '',
    amount_raw: '100000000000000000',
  }

  it('drops zero-address rows', () => {
    const normalized = normalizeTornadoWithdrawalRow(
      row({ ...base, address: ZERO_ADDRESS }),
    )
    expect(normalized).toEqual(undefined)
  })

  it('keeps non-zero addresses and uses the bucket denomination', () => {
    const normalized = normalizeTornadoWithdrawalRow(
      row({ ...base, address: '0x000000000000000000000000000000000000dEaD' }),
    )
    expect(normalized?.direction).toEqual('withdrawal')
    expect(normalized?.record.rawAmount).toEqual(parseDecimalToRaw('0.1', 18))
  })
})

describe('normalizeRailgunWithdrawalRow', () => {
  it('skips rows whose token cannot be resolved', () => {
    const normalized = normalizeRailgunWithdrawalRow(
      row({
        address: '0x000000000000000000000000000000000000beef',
        bucket: 'railgun-GUILD',
        token: 'guild',
        token_address: '0x83e9f223e1edb3486f876ee888d76bfba26c475a',
        amount_raw: '1000000000000000000',
      }),
    )
    expect(normalized).toEqual(undefined)
  })

  it('excludes Railgun Relay Adapter addresses', () => {
    const normalized = normalizeRailgunWithdrawalRow(
      row({
        // Relay Adapter contract — not a distinct entity.
        address: '0x4025ee6512dbbda97049bcf5aa5d38c54af6be8a',
        bucket: 'railgun-WETH',
        token: 'weth',
        token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        amount_raw: '1000000000000000000',
      }),
    )
    expect(normalized).toEqual(undefined)
  })
})

describe('normalizePrivacyPoolsRow', () => {
  it('treats both normal withdrawals and ragequits as withdrawals', () => {
    const normalWithdrawal = normalizePrivacyPoolsRow(
      row({
        action: 'withdrawal',
        address: '0x00000000000000000000000000000000000000a1',
        bucket: 'privacy-pools-ETH-0xf241d57c6debae225c0f2e6ea1529373c9a9c9fb',
        token: 'ethereum',
        token_address: '',
        amount_raw: '100000000000000000',
      }),
    )
    // Ragequits are normalized to action === "withdrawal" in the CSV.
    const ragequitWithdrawal = normalizePrivacyPoolsRow(
      row({
        action: 'withdrawal',
        address: '0x00000000000000000000000000000000000000a2',
        bucket: 'privacy-pools-ETH-0xf241d57c6debae225c0f2e6ea1529373c9a9c9fb',
        token: 'ethereum',
        token_address: '',
        amount_raw: '200000000000000000',
      }),
    )

    expect(normalWithdrawal?.direction).toEqual('withdrawal')
    expect(ragequitWithdrawal?.direction).toEqual('withdrawal')
  })

  it('excludes the entrypoint contract on withdrawals but keeps it on deposits', () => {
    const entrypoint = '0x6818809eefce719e480a7526d76bd3e561526b46'
    const base = {
      address: entrypoint,
      bucket: 'privacy-pools-ETH-0xf241d57c6debae225c0f2e6ea1529373c9a9c9fb',
      token: 'ethereum',
      token_address: '',
      amount_raw: '100000000000000000',
    }

    expect(
      normalizePrivacyPoolsRow(row({ ...base, action: 'withdrawal' })),
    ).toEqual(undefined)
    // The exclusion is withdrawal-only.
    expect(
      normalizePrivacyPoolsRow(row({ ...base, action: 'deposit' }))?.direction,
    ).toEqual('deposit')
  })
})

describe('aggregateAmountRecords', () => {
  it('converts per-token subtotals to USD first, then sums per address', () => {
    const address = '0x00000000000000000000000000000000000000ff'
    const result = aggregateAmountRecords([
      // Two USDC contributions for the same address — summed in raw units.
      record({
        address,
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: USDC?.price ?? null,
        rawAmount: 1_000_000n,
      }),
      record({
        address,
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: USDC?.price ?? null,
        rawAmount: 2_000_000n,
      }),
      // One WETH contribution.
      record({
        address,
        tokenKey: 'WETH',
        decimals: 18,
        priceUsd: WETH?.price ?? null,
        rawAmount: 10n ** 18n,
      }),
    ])

    const expectedUsd =
      amountToUsd(3_000_000n, 6, USDC?.price ?? null) +
      amountToUsd(10n ** 18n, 18, WETH?.price ?? null)

    expect(result.addressCount).toEqual(1)
    expect(result.totalUsd).toEqual(expectedUsd)
  })

  it('excludes addresses with a non-positive USD total', () => {
    const result = aggregateAmountRecords([
      record({
        address: '0xpriced',
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: 1,
        rawAmount: 5_000_000n,
      }),
      // Unpriced token contributes 0 USD -> address excluded entirely.
      record({
        address: '0xzero',
        tokenKey: 'BOLD',
        decimals: 18,
        priceUsd: null,
        rawAmount: 10n ** 18n,
      }),
    ])

    expect(result.addressCount).toEqual(1)
    expect(result.totalUsd).toEqual(5)
  })

  it('assigns addresses to the correct USD buckets', () => {
    const result = aggregateAmountRecords([
      record({
        address: '0x1',
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: 1,
        rawAmount: 50_000_000n,
      }), // $50 -> [0, 128)
      record({
        address: '0x2',
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: 1,
        rawAmount: 200_000_000n,
      }), // $200 -> [128, 256)
      record({
        address: '0x3',
        tokenKey: 'USDC',
        decimals: 6,
        priceUsd: 1,
        rawAmount: 5_000_000_000n,
      }), // $5K -> [4096, 8192)
    ])

    const counts = Object.fromEntries(
      result.buckets.map((bucket) => [bucket.key, bucket.count]),
    )
    expect(counts.b0).toEqual(1) // $50 -> [0, 128)
    expect(counts.b128).toEqual(1) // $200 -> [128, 256)
    expect(counts.b4096).toEqual(1) // $5K -> [4096, 8192)
    expect(counts.b256).toEqual(0)
  })
})

describe('computeAddressOverlap', () => {
  it('counts addresses on both sides and the withdrawer overlap share', () => {
    const deposits = [
      record({ address: '0xa' }),
      record({ address: '0xb' }),
      record({ address: '0xb' }), // same depositor twice -> deduped to one
      record({ address: '0xc' }),
    ]
    const withdrawals = [
      record({ address: '0xb' }), // also deposited
      record({ address: '0xc' }), // also deposited
      record({ address: '0xd' }), // withdrawer only
      record({ address: '0xd' }),
    ]

    const overlap = computeAddressOverlap(deposits, withdrawals)
    expect(overlap.depositorCount).toEqual(3)
    expect(overlap.withdrawerCount).toEqual(3)
    expect(overlap.bothCount).toEqual(2)
    // 2 of 3 withdrawers (0xb, 0xc) also deposited.
    expect(overlap.withdrawersAlsoDepositorsPct).toEqual((2 / 3) * 100)
  })

  it('returns 0% when there are no withdrawers', () => {
    const overlap = computeAddressOverlap([record({ address: '0xa' })], [])
    expect(overlap.withdrawersAlsoDepositorsPct).toEqual(0)
  })
})

describe('getPrivacyAmountBucket', () => {
  it('uses inclusive lower / exclusive upper boundaries', () => {
    expect(getPrivacyAmountBucket(0)?.key).toEqual('b0')
    expect(getPrivacyAmountBucket(127.99)?.key).toEqual('b0')
    expect(getPrivacyAmountBucket(128)?.key).toEqual('b128')
    expect(getPrivacyAmountBucket(255.99)?.key).toEqual('b128')
    expect(getPrivacyAmountBucket(256)?.key).toEqual('b256')
    expect(getPrivacyAmountBucket(1_024)?.key).toEqual('b1024')
    expect(getPrivacyAmountBucket(8_388_607)?.key).toEqual('b4194304')
    expect(getPrivacyAmountBucket(8_388_608)?.key).toEqual('b8388608')
    expect(getPrivacyAmountBucket(50_000_000)?.key).toEqual('b8388608')
    expect(getPrivacyAmountBucket(-1)).toEqual(undefined)
  })
})
