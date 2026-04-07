import { expect } from 'earl'
import { buildInteropUrl } from './buildInteropUrl'

describe(buildInteropUrl.name, () => {
  it('builds public URL with selectedChains for complete pair', () => {
    const result = buildInteropUrl(
      '/interop/summary',
      {
        from: ['ethereum'],
        to: ['arbitrum'],
      },
      'public',
    )

    expect(result).toEqual(
      '/interop/summary?selectedChains=ethereum%2Carbitrum',
    )
  })

  it('returns public path without query for incomplete pair', () => {
    const result = buildInteropUrl(
      '/interop/summary',
      {
        from: ['ethereum'],
        to: [],
      },
      'public',
    )

    expect(result).toEqual('/interop/summary')
  })

  it('builds internal URL with from and to arrays', () => {
    const result = buildInteropUrl(
      '/interop/summary/internal',
      {
        from: ['ethereum', 'arbitrum'],
        to: ['base'],
      },
      'internal',
    )

    expect(result).toEqual(
      '/interop/summary/internal?from=ethereum%2Carbitrum&to=base',
    )
  })
})
