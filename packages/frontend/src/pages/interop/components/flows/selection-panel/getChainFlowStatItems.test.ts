import { expect } from 'earl'
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

    expect(result).toInclude({
      label: 'Unique tokens',
      value: '7',
    })
  })
})
