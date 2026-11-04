import { expect } from 'earl'
import {
  getPrivacyProjectChainHref,
  resolvePrivacyChain,
} from './resolvePrivacyChain'

describe(resolvePrivacyChain.name, () => {
  const trackedOn = ['ethereum', 'arbitrum', 'bsc']

  it('keeps a tracked chain', () => {
    expect(resolvePrivacyChain(trackedOn, 'bsc')).toEqual('bsc')
  })

  it('falls back to the primary chain without a request', () => {
    expect(resolvePrivacyChain(trackedOn, undefined)).toEqual('ethereum')
  })

  it('falls back to the primary chain for an unknown or untracked chain', () => {
    expect(resolvePrivacyChain(trackedOn, 'gnosis')).toEqual('ethereum')
    expect(resolvePrivacyChain(trackedOn, 'nonsense')).toEqual('ethereum')
  })

  it('rejects a project tracked on no chain', () => {
    expect(() => resolvePrivacyChain([], 'ethereum')).toThrow()
  })
})

describe(getPrivacyProjectChainHref.name, () => {
  it('omits the parameter on the primary chain', () => {
    expect(
      getPrivacyProjectChainHref('railgun', ['ethereum', 'bsc'], 'ethereum'),
    ).toEqual('/privacy/projects/railgun')
    expect(
      getPrivacyProjectChainHref('railgun', ['ethereum', 'bsc'], 'bsc'),
    ).toEqual('/privacy/projects/railgun?chain=bsc')
  })
})
