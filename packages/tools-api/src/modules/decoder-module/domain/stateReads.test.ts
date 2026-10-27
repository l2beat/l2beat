import { expect } from 'earl'
import { encodeFunctionData, parseAbi } from 'viem'
import { isAllowedStateRead } from './stateReads'

describe(isAllowedStateRead.name, () => {
  const abi = parseAbi([
    'function gameArgs(uint32) view returns (bytes)',
    'function balanceOf(address) view returns (uint256)',
    'function owner() view returns (address)',
  ])

  it('allows listed getters and calls without arguments', () => {
    expect(
      isAllowedStateRead(
        encodeFunctionData({ abi, functionName: 'gameArgs', args: [5] }),
      ),
    ).toEqual(true)
    expect(
      isAllowedStateRead(encodeFunctionData({ abi, functionName: 'owner' })),
    ).toEqual(true)
    expect(
      isAllowedStateRead(
        encodeFunctionData({
          abi,
          functionName: 'balanceOf',
          args: ['0x6b1bae59d09fccbddb6c6cceb07b7279367c4e3b'],
        }),
      ),
    ).toEqual(false)
  })
})
