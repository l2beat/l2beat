import { expect } from 'earl'
import { formatEther } from 'ethers/lib/utils'
import {
  getOpStackBondScalingFactor,
  getOpStackFullDisputeGameBondCost,
  getOpStackMaxCumulativeClockExtension,
} from './opStack'

describe(getOpStackBondScalingFactor.name, () => {
  it('derives the deployed OP fault-proof bond multiplier', () => {
    expect(getOpStackBondScalingFactor(73).toFixed(5)).toEqual('1.09493')
  })
})

describe(getOpStackFullDisputeGameBondCost.name, () => {
  it('includes bonded claims from depth 0 through the maximum depth', () => {
    const fullPathCost = getOpStackFullDisputeGameBondCost(
      '80000000000000000',
      73,
    )

    expect(Number(formatEther(fullPathCost)).toFixed(2)).toEqual('691.23')
  })

  it('handles bonds that are small relative to the scale factor', () => {
    expect(getOpStackFullDisputeGameBondCost(1_000, 73)).toEqual(8_600_000n)
  })
})

describe(getOpStackMaxCumulativeClockExtension.name, () => {
  it('includes every standard extension and both special extensions', () => {
    const maxExtension = getOpStackMaxCumulativeClockExtension(
      73,
      10_800,
      86_400,
    )

    expect(maxExtension).toEqual(874_800)
  })
})
