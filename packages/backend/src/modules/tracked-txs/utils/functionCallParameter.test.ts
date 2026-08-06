import { expect } from 'earl'
import { utils } from 'ethers'
import {
  getFunctionCallParameter,
  getFunctionCallParameterPrefix,
} from './functionCallParameter'

describe(getFunctionCallParameterPrefix.name, () => {
  it('returns the prefix ending after the selected scalar', () => {
    expect(
      getFunctionCallParameterPrefix('function submit(uint256)', [0]),
    ).toEqual(36)
    expect(
      getFunctionCallParameterPrefix(
        'function submit((uint256,uint256,bytes))',
        [0, 0],
      ),
    ).toEqual(68)
  })

  it('returns 68 bytes for Aztec args.start', () => {
    expect(
      getFunctionCallParameterPrefix(
        'function submitEpochRootProof((uint256,uint256,(bytes32,bytes32,bytes32,address),(bytes32,bytes32,bytes32,bytes32,bytes32,uint256,uint256,address,bytes32,(uint128,uint128),uint256,uint256)[],(bytes,bytes),bytes,bytes))',
        [0, 0],
      ),
    ).toEqual(68)
  })

  it('falls back to full input for paths without a static prefix', () => {
    expect(
      getFunctionCallParameterPrefix(
        'function submit(bytes,(uint256,bytes))',
        [1, 0],
      ),
    ).toEqual(undefined)
    expect(
      getFunctionCallParameterPrefix('function submit(bytes)', [0]),
    ).toEqual(undefined)
    expect(
      getFunctionCallParameterPrefix('function submit(uint256[])', [0, 0]),
    ).toEqual(undefined)
  })

  it('rejects invalid configuration instead of falling back', () => {
    expect(() =>
      getFunctionCallParameterPrefix('function submit(uint256)', [1]),
    ).toThrow('Parameter path does not exist')
    expect(() =>
      getFunctionCallParameterPrefix('function invalid(', [0]),
    ).toThrow()
  })
})

describe(getFunctionCallParameter.name, () => {
  const signature =
    'function submit((uint256 start,uint256 end,bytes proof))' as const
  const iface = new utils.Interface([signature])
  const input = iface.encodeFunctionData('submit', [[123, 456, '0x1234']])

  it('extracts a scalar from a truncated dynamic tuple', () => {
    const prefix = input.slice(0, 2 + 68 * 2)

    expect(getFunctionCallParameter(signature, prefix, [0, 0])).toEqual('123')
  })

  it('rejects input truncated before the selected scalar', () => {
    const prefix = input.slice(0, 2 + 67 * 2)

    expect(() => getFunctionCallParameter(signature, prefix, [0, 0])).toThrow(
      'Unexpected end of function call input',
    )
  })

  it('rejects a mismatched selector', () => {
    const other = new utils.Interface(['function other(uint256)'])

    expect(() =>
      getFunctionCallParameter(
        signature,
        other.encodeFunctionData('other', [123]),
        [0, 0],
      ),
    ).toThrow('Input does not match the function selector')
  })

  it('uses the full decoder for unsupported paths', () => {
    expect(getFunctionCallParameter(signature, input, [0, 2])).toEqual('0x1234')
  })

  it('follows the actual tuple pointer and fails outside the prefix', () => {
    const prefix = input.slice(0, 2 + 68 * 2)
    const pointerToByte64 = utils.hexZeroPad('0x40', 32).slice(2)
    const nonCanonicalPrefix = `${prefix.slice(0, 10)}${pointerToByte64}${prefix.slice(74)}`

    expect(() =>
      getFunctionCallParameter(signature, nonCanonicalPrefix, [0, 0]),
    ).toThrow('Unexpected end of function call input')
  })
})
