import { expect } from 'earl'
import { mergeHyperlaneWarpRouteScales } from './hyperlane.config'

describe(mergeHyperlaneWarpRouteScales.name, () => {
  const scale = { numerator: '1', denominator: '1000000000000' }

  it('drops the scale of a route that is still listed without one', () => {
    const merged = mergeHyperlaneWarpRouteScales(
      { 'bsc:0xa': scale },
      {},
      { 'bsc:0xa': 'EvmHypCollateral' },
    )

    expect(merged).toEqual({})
  })

  it('keeps the scale of a route that is no longer listed', () => {
    const merged = mergeHyperlaneWarpRouteScales({ 'bsc:0xa': scale }, {}, {})

    expect(merged).toEqual({ 'bsc:0xa': scale })
  })

  it('takes the latest scale of a listed route', () => {
    const latest = { numerator: '1', denominator: '1000' }
    const merged = mergeHyperlaneWarpRouteScales(
      { 'bsc:0xa': scale },
      { 'bsc:0xa': latest },
      { 'bsc:0xa': 'EvmHypCollateral' },
    )

    expect(merged).toEqual({ 'bsc:0xa': latest })
  })
})
