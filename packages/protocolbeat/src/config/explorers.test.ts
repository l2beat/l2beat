import { describe, expect, it } from 'vitest'
import { getExplorerTxUrl } from './explorers'

describe('getExplorerTxUrl', () => {
  it('swaps an /address base for /tx', () => {
    expect(getExplorerTxUrl('eth')).toBe('https://etherscan.io/tx')
  })

  it('preserves a nested path when swapping /address', () => {
    expect(getExplorerTxUrl('jovay')).toBe('https://explorer.jovay.io/l2/tx')
  })

  it('appends /tx for explorers configured as a bare site root', () => {
    // katana is configured as `https://katanascan.com` (no /address segment).
    expect(getExplorerTxUrl('katana')).toBe('https://katanascan.com/tx')
  })

  it('returns undefined for chains without an explorer', () => {
    expect(getExplorerTxUrl('zircuit')).toBe(undefined)
    expect(getExplorerTxUrl('does-not-exist')).toBe(undefined)
  })
})
