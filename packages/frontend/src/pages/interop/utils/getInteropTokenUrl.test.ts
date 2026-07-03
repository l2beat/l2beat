import { expect } from 'earl'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import { getInteropTokenUrl } from './getInteropTokenUrl'

describe(getInteropTokenUrl.name, () => {
  it('returns undefined for unknown tokens', () => {
    const result = getInteropTokenUrl({
      id: UNKNOWN_ABSTRACT_TOKEN_ID,
      issuer: null,
      symbol: 'Unknown',
    })

    expect(result).toEqual(undefined)
  })

  it('returns undefined for synthetic unknown tokens', () => {
    const result = getInteropTokenUrl({
      id: 'unknown-cctp',
      issuer: null,
      symbol: 'Unknown',
      isUnknown: true,
    })

    expect(result).toEqual(undefined)
  })

  it('builds token URL without chain selection', () => {
    const result = getInteropTokenUrl({
      id: 'usdc',
      issuer: 'circle',
      symbol: 'USDC',
    })

    expect(result).toEqual('/interop/tokens/circle-usdc')
  })
})
