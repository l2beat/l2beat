import { expect } from 'earl'
import { getCompareSeriesColors } from './getCompareSeriesColors'

describe(getCompareSeriesColors.name, () => {
  it('assigns a distinct color to each project by selection order', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `project-${i}`)
    const colors = getCompareSeriesColors(ids)

    expect(Object.keys(colors)).toEqual(ids)
    expect(new Set(Object.values(colors)).size).toEqual(10)
  })

  it('keeps colors of preceding projects stable when the selection grows', () => {
    const two = getCompareSeriesColors(['arbitrum', 'base'])
    const three = getCompareSeriesColors(['arbitrum', 'base', 'optimism'])

    expect(three.arbitrum).toEqual(two.arbitrum)
    expect(three.base).toEqual(two.base)
  })
})
