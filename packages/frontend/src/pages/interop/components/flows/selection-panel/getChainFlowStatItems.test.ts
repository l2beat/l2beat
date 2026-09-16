import { describe, expect, it } from 'vitest'
import { getChainFlowStatItems } from './getChainFlowStatItems'

describe(getChainFlowStatItems.name, () => {
  it('includes the unique token count', () => {
    const result = getChainFlowStatItems({
      totalVolume: 30_000,
      inflow: 20_000,
      outflow: 10_000,
      netFlow: 10_000,
      transfersIn: 20,
      transfersOut: 10,
      tokenCount: 7,
    })

    expect(result).toContainEqual({
      label: 'Unique tokens',
      value: '7',
    })
  })
})
