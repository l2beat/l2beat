import { expect } from 'earl'
import { EXPLORER_URLS, getExplorerTxUrl } from './explorers'

describe('getExplorerTxUrl', () => {
  it('swaps an /address base for /tx', () => {
    expect(getExplorerTxUrl('eth')).toEqual('https://etherscan.io/tx')
  })

  it('preserves a nested path when swapping /address', () => {
    expect(getExplorerTxUrl('jovay')).toEqual('https://explorer.jovay.io/l2/tx')
  })

  it('returns undefined for chains without an explorer', () => {
    expect(getExplorerTxUrl('zircuit')).toEqual(undefined)
    expect(getExplorerTxUrl('does-not-exist')).toEqual(undefined)
  })
})

describe('EXPLORER_URLS', () => {
  it('points every chain at its address page', () => {
    for (const url of Object.values(EXPLORER_URLS)) {
      expect(url.endsWith('/address')).toEqual(true)
    }
  })
})
