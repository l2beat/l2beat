import { expect } from 'earl'
import { utils } from 'ethers'
import { getFunctionCallEventId } from './getFunctionCallEventId'

describe(getFunctionCallEventId.name, () => {
  const signature = 'function submit((uint256,uint256))' as const
  const iface = new utils.Interface([signature])
  const input = iface.encodeFunctionData('submit', [[123, 456]])

  it('extracts a nested function parameter', () => {
    expect(
      getFunctionCallEventId(input, signature, {
        type: 'functionCallParameter',
        path: [0, 0],
      }),
    ).toEqual('123')
  })

  it('rejects paths ending at a tuple', () => {
    expect(() =>
      getFunctionCallEventId(input, signature, {
        type: 'functionCallParameter',
        path: [0],
      }),
    ).toThrow('Event identity parameter must be a scalar')
  })
})
