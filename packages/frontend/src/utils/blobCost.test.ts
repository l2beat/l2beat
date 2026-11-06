import { expect } from 'earl'
import { blobCostUsd, formatBlobCost } from './blobCost'

describe(blobCostUsd.name, () => {
  it('prices a blob at the fee per blob gas and the ETH price', () => {
    // 0.003 gwei × 131072 gas = 393.216 gwei = 3.93e-7 ETH
    expect(blobCostUsd(0.003, 3000)).toBeCloseTo(0.00117965, 8)
  })
})

describe(formatBlobCost.name, () => {
  it('shows cents from a dollar up, and two figures below', () => {
    expect(formatBlobCost(7.3)).toEqual('$7.30')
    expect(formatBlobCost(0.0014)).toEqual('$0.0014')
    expect(formatBlobCost(0.12)).toEqual('$0.12')
    expect(formatBlobCost(0)).toEqual('$0')
  })
})
