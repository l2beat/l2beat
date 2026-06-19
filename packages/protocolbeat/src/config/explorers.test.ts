import { expect } from 'earl'
import { getExplorerTxUrl } from './explorers'

describe('getExplorerTxUrl', () => {
  it('swaps an /address base for /tx', () => {
    expect(getExplorerTxUrl('eth')).toEqual('https://etherscan.io/tx')
  })

  it('preserves a nested path when swapping /address', () => {
    expect(getExplorerTxUrl('jovay')).toEqual('https://explorer.jovay.io/l2/tx')
  })

  it('appends /tx for explorers configured as a bare site root', () => {
    // katana is configured as `https://katanascan.com` (no /address segment).
    expect(getExplorerTxUrl('katana')).toEqual('https://katanascan.com/tx')
  })

  it('returns undefined for chains without an explorer', () => {
    expect(getExplorerTxUrl('zircuit')).toEqual(undefined)
    expect(getExplorerTxUrl('does-not-exist')).toEqual(undefined)
  })
})
