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
})
