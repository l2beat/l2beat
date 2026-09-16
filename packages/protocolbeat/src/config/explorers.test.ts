import { describe, expect, it } from 'vitest'
import { getExplorerTxUrl } from './explorers'

describe('getExplorerTxUrl', () => {
  it('swaps an /address base for /tx', () => {
    expect(getExplorerTxUrl('eth')).toStrictEqual('https://etherscan.io/tx')
  })

  it('preserves a nested path when swapping /address', () => {
    expect(getExplorerTxUrl('jovay')).toStrictEqual(
      'https://explorer.jovay.io/l2/tx',
    )
  })

  it('appends /tx for explorers configured as a bare site root', () => {
    // katana is configured as `https://katanascan.com` (no /address segment).
    expect(getExplorerTxUrl('katana')).toStrictEqual(
      'https://katanascan.com/tx',
    )
  })

  it('returns undefined for chains without an explorer', () => {
    expect(getExplorerTxUrl('zircuit')).toStrictEqual(undefined)
    expect(getExplorerTxUrl('does-not-exist')).toStrictEqual(undefined)
  })
})
