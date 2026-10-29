import { expect } from 'earl'
import { toCsvDump, toJsonDump } from './llmDump'
import type { Names, Row, Snapshot } from './rows'

const names: Names = {
  project: (id) => (id === 'arbitrum' ? 'Arbitrum One' : id),
  bridge: (id) => (id === 'axelar' ? 'Axelar' : id),
}
const snapshot = {
  generatedAt: 1_800_000_000,
  window: { days: 90, from: 1_792_224_000, to: 1_800_000_000 },
  minChainVolumeUsd: 10_000,
  projects: [
    { id: 'arbitrum', name: 'Arbitrum One', iconUrl: '', chain: 'arbitrum' },
  ],
  chains: [
    { name: 'arbitrum', explorerUrl: 'https://arbiscan.io' },
    { name: 'ethereum', explorerUrl: 'https://etherscan.io/' },
  ],
  bridges: [],
  rows: [],
  warnings: ['Reading scroll failed: No RPC for scroll in the token DB'],
} as unknown as Snapshot

describe(toJsonDump.name, () => {
  it('describes a row with its token, estimate, interop activity and dismissal', () => {
    const dump = JSON.parse(toJsonDump([axlUsdc()], snapshot, names))

    expect(dump.snapshotAt).toEqual('2027-01-15T08:00:00.000Z')
    expect(dump.interopWindow).toEqual({
      days: 90,
      from: '2026-10-17T08:00:00.000Z',
      to: '2027-01-15T08:00:00.000Z',
      minChainVolumeUsd: 10_000,
    })
    expect(dump.warnings).toEqual(snapshot.warnings)
    expect(Object.keys(dump.definitions.status)).toEqual([
      'counted',
      'countedViaCounterpart',
      'scheduled',
      'sameAssetOnly',
      'missing',
    ])
    expect(dump.rows).toEqual([
      {
        id: 'arbitrum:arbitrum:0xeb466342c4d449bc9f53a865d5cb90586f405215',
        project: { id: 'arbitrum', name: 'Arbitrum One', chain: 'arbitrum' },
        side: 'chain',
        token: {
          chain: 'arbitrum',
          address: '0xeb466342c4d449bc9f53a865d5cb90586f405215',
          symbol: 'axlUSDC',
          decimals: 6,
          explorerUrl:
            'https://arbiscan.io/address/0xeb466342c4d449bc9f53a865d5cb90586f405215',
          abstractTokenId: null,
          abstractSymbol: null,
          issuer: null,
          coingeckoId: null,
          relationRole: 'minted',
          ignoredInTokenDb: false,
        },
        tvs: { status: 'missing', countedVia: null },
        escrowAddresses: null,
        estimate: {
          amount: 400_000,
          amountSource: 'totalSupply',
          amountUnavailable: null,
          circulatingSupplyUnknown: false,
          escrowBalance: null,
          mintedCopy: null,
          priceUsd: 1,
          valueUsd: 400_000,
          priceCoingeckoId: 'usd-coin',
          pricedViaCounterpart: {
            chain: 'ethereum',
            address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            symbol: 'USDC',
          },
          erc4626Asset: null,
        },
        interop: {
          volumeUsd: 1234.57,
          transferCount: 12,
          lastSeen: '2027-01-15T07:00:00.000Z',
          bridges: [
            {
              id: 'axelar',
              name: 'Axelar',
              bridgeType: 'lockAndMint',
              volumeUsd: 1234.57,
              transferCount: 12,
            },
          ],
        },
        dismissal: { reason: 'doubleCounted', comment: 'Counted by Axelar' },
      },
    ])
  })
})

describe(toCsvDump.name, () => {
  it('writes a header and quotes fields that need it', () => {
    const escrow: Row = {
      ...axlUsdc(),
      side: 'escrow',
      chain: 'ethereum',
      address: '0x6c3ea9036406852006290770bedfcaba0e23a0e8',
      symbol: 'PY,USD',
      role: undefined,
      escrowAddresses: ['0x1', '0x2'],
      dismissal: undefined,
    }

    const [header = '', line = ''] = toCsvDump([escrow], snapshot, names).split(
      '\n',
    )

    expect(header.split(',').slice(0, 7)).toEqual([
      'project_id',
      'project_name',
      'project_chain',
      'side',
      'chain',
      'address',
      'symbol',
    ])
    expect(line).toInclude('"PY,USD"')
    expect(line).toInclude(
      'ethereum:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,USDC',
    )
    expect(line).toInclude('0x1 0x2')
    expect(line).toInclude('Axelar (lockAndMint, 1234.57 USD, 12 transfers)')
    expect(line).toInclude(
      'https://etherscan.io/address/0x6c3ea9036406852006290770bedfcaba0e23a0e8',
    )
  })

  it('keeps spreadsheets from running token fields as formulas', () => {
    const row: Row = { ...axlUsdc(), symbol: '=HYPERLINK("x")', decimals: -1 }

    const [, line = ''] = toCsvDump([row], snapshot, names).split('\n')

    expect(line).toInclude(`"'=HYPERLINK(""x"")",-1,`)
  })
})

function axlUsdc(): Row {
  return {
    projectId: 'arbitrum',
    side: 'chain',
    chain: 'arbitrum',
    address: '0xeb466342c4d449bc9f53a865d5cb90586f405215',
    symbol: 'axlUSDC',
    decimals: 6,
    abstractTokenId: undefined,
    abstractSymbol: undefined,
    issuer: undefined,
    iconUrl: undefined,
    coingeckoId: undefined,
    pricing: {
      coingeckoId: 'usd-coin',
      via: {
        chain: 'ethereum',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: 'USDC',
      },
    },
    ignored: false,
    status: 'missing',
    countedVia: undefined,
    role: 'minted',
    bridges: [
      {
        id: 'axelar',
        bridgeType: 'lockAndMint',
        volumeUsd: 1234.5678,
        transferCount: 12,
      },
    ],
    volumeUsd: 1234.5678,
    transferCount: 12,
    lastSeen: 1_800_000_000 - 3600,
    value: {
      amount: 400_000,
      amountGap: undefined,
      circulatingSupplyUnknown: false,
      amountSource: 'totalSupply',
      escrowBalance: undefined,
      mintedCopy: undefined,
      priceUsd: 1,
      valueUsd: 400_000,
      vaultAsset: undefined,
    },
    escrowAddresses: [],
    dismissal: {
      reason: 'doubleCounted',
      comment: 'Counted by Axelar',
      dismissedBy: 'research@l2beat.com',
      dismissedAt: 1,
    },
  }
}
