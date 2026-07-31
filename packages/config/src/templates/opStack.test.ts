import { expect } from 'earl'
import { formatEther } from 'ethers/lib/utils'
import {
  getOpStackBondScalingFactor,
  getOpStackFullDisputeGameBondCost,
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

  it('can use a scaling factor observed from the deployed game', () => {
    const fullPathCost = getOpStackFullDisputeGameBondCost(100_000, 2, 2)

    expect(fullPathCost).toEqual(700_000n)
  })
})
