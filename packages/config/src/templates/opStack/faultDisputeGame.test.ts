import { expect } from 'earl'
import {
  getOpStackBondScalingFactor,
  getOpStackFullDisputeGameBondCostEther,
  getOpStackMaxCumulativeClockExtension,
} from './faultDisputeGame'

describe(getOpStackBondScalingFactor.name, () => {
  it('derives the deployed OP fault-proof bond multiplier', () => {
    expect(getOpStackBondScalingFactor(73).toFixed(5)).toEqual('1.09493')
  })
})

describe(getOpStackFullDisputeGameBondCostEther.name, () => {
  it('includes bonded claims from depth 0 through the maximum depth', () => {
    const fullPathCostEther = getOpStackFullDisputeGameBondCostEther(
      0.08 * 1e18,
      73,
    )

    expect(fullPathCostEther.toFixed(2)).toEqual('691.23')
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
