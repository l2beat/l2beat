import { expect } from 'earl'
import { buildInteropUrl } from './buildInteropUrl'

describe(buildInteropUrl.name, () => {
  it('builds URL with from and to arrays', () => {
    const result = buildInteropUrl('/interop/summary', {
      from: ['ethereum', 'arbitrum'],
      to: ['base'],
    })

    expect(result).toEqual('/interop/summary?from=ethereum%2Carbitrum&to=base')
  })

  it('returns path without query when selection is empty', () => {
    const result = buildInteropUrl('/interop/summary', {
      from: [],
      to: [],
    })

    expect(result).toEqual('/interop/summary')
  })

  it('returns path without query when selection equals default selection', () => {
    const result = buildInteropUrl(
      '/interop/tokens/circle-usdc',
      {
        from: ['ethereum', 'arbitrum'],
        to: ['ethereum', 'arbitrum'],
      },
      {
        from: ['ethereum', 'arbitrum'],
        to: ['ethereum', 'arbitrum'],
      },
    )

    expect(result).toEqual('/interop/tokens/circle-usdc')
  })

  it('builds URL with empty params when selection is empty but default is not', () => {
    const result = buildInteropUrl(
      '/interop/tokens/circle-usdc',
      {
        from: [],
        to: [],
      },
      {
        from: ['ethereum', 'arbitrum'],
        to: ['ethereum', 'arbitrum'],
      },
    )

    expect(result).toEqual('/interop/tokens/circle-usdc?from=&to=')
  })
})
