import { describe, expect, it } from 'vitest'
import { getCompareSeriesColors } from './getCompareSeriesColors'

describe(getCompareSeriesColors.name, () => {
  it('assigns a distinct color to each project by selection order', () => {
    const ids = Array.from({ length: 10 }, (_, i) => `project-${i}`)
    const colors = getCompareSeriesColors(ids)

    expect(Object.keys(colors)).toStrictEqual(ids)
    expect(new Set(Object.values(colors)).size).toStrictEqual(10)
  })

  it('keeps colors of preceding projects stable when the selection grows', () => {
    const two = getCompareSeriesColors(['arbitrum', 'base'])
    const three = getCompareSeriesColors(['arbitrum', 'base', 'optimism'])

    expect(three.arbitrum).toStrictEqual(two.arbitrum)
    expect(three.base).toStrictEqual(two.base)
  })

  it('gives Ethereum its fixed chart color without taking a palette slot', () => {
    const without = getCompareSeriesColors(['arbitrum', 'base'])
    const withEthereum = getCompareSeriesColors([
      'arbitrum',
      'ethereum',
      'base',
    ])

    expect(withEthereum.ethereum).toStrictEqual('var(--chart-ethereum)')
    expect(withEthereum.arbitrum).toStrictEqual(without.arbitrum)
    expect(withEthereum.base).toStrictEqual(without.base)
  })

  it('does not map Ethereum when it is not selected', () => {
    const colors = getCompareSeriesColors(['arbitrum'])

    expect(colors.ethereum).toStrictEqual(undefined)
  })
})
