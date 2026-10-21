import { expect } from 'earl'
import { parseAbiFunction } from './abi'

describe(parseAbiFunction.name, () => {
  it('counts top-level parameters only', () => {
    expect(
      parseAbiFunction(
        'function execute((address to, uint256 value)[] calls, bytes data) payable returns (bytes[])',
      ),
    ).toEqual({ name: 'execute', arity: 2 })
  })

  it('handles functions without parameters', () => {
    expect(parseAbiFunction('function owner() view returns (address)')).toEqual(
      { name: 'owner', arity: 0 },
    )
  })

  it('ignores everything that is not a function', () => {
    expect(parseAbiFunction('event Upgraded(address indexed impl)')).toEqual(
      undefined,
    )
  })
})
