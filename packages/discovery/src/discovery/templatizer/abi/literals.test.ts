import { expect } from 'earl'
import { utils } from 'ethers'
import { checkLiteral, isAddressLiteral } from './literals'

/**
 * Checks accepted and rejected spellings per ABI type. The literal rules are
 * the contract between the prompt (what the model is told to write) and the
 * executor (what ethers can encode), so every accepted form here is one the
 * executor test also runs.
 */
describe(checkLiteral.name, () => {
  const param = (type: string) => utils.ParamType.from(type)

  it('accepts lowercase, checksummed and chain-prefixed addresses and rejects a bad checksum', () => {
    const lower = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
    const checksummed = '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF'
    expect(checkLiteral(lower, param('address'))).toEqual(undefined)
    expect(checkLiteral(checksummed, param('address'))).toEqual(undefined)
    expect(checkLiteral(`eth:${checksummed}`, param('address'))).toEqual(
      undefined,
    )
    expect(
      checkLiteral(
        '0xDEADbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        param('address'),
      ),
    ).toEqual(
      'expected an address (0x + 40 hex digits, lowercase or checksummed, optionally chain-prefixed), got "0xDEADbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF"',
    )
    expect(String(checkLiteral('0xdead', param('address')))).toMatchRegex(
      /expected an address/,
    )
    expect(isAddressLiteral(12)).toEqual(false)
  })

  it('accepts integers as numbers or decimal strings within the type range', () => {
    expect(checkLiteral(1, param('uint8'))).toEqual(undefined)
    expect(
      checkLiteral('340282366920938463463374607431768211456', param('uint256')),
    ).toEqual(undefined)
    expect(checkLiteral(-1, param('int256'))).toEqual(undefined)
    expect(checkLiteral(256, param('uint8'))).toEqual(
      '256 is out of range for uint8',
    )
    expect(checkLiteral(-1, param('uint256'))).toEqual(
      '-1 is out of range for uint256',
    )
    expect(checkLiteral(1.5, param('uint256'))).toEqual(
      'expected uint256 as an integer number or a decimal string, got 1.5',
    )
    expect(String(checkLiteral('0x10', param('uint256')))).toMatchRegex(
      /expected uint256/,
    )
  })

  it('requires booleans, strings and hex bytes of the declared length', () => {
    expect(checkLiteral(true, param('bool'))).toEqual(undefined)
    expect(checkLiteral('true', param('bool'))).toEqual(
      'expected a boolean, got "true"',
    )
    expect(checkLiteral('abc', param('string'))).toEqual(undefined)
    expect(checkLiteral(`0x${'ab'.repeat(32)}`, param('bytes32'))).toEqual(
      undefined,
    )
    expect(checkLiteral(`0x${'ab'.repeat(4)}`, param('bytes32'))).toEqual(
      'expected bytes32 as 0x + 64 hex digits, got "0xabababab"',
    )
    expect(checkLiteral('0x01ff', param('bytes'))).toEqual(undefined)
    expect(String(checkLiteral('0x1', param('bytes')))).toMatchRegex(
      /even length/,
    )
  })

  it('checks arrays element by element and fixed lengths, and tuples component by component', () => {
    expect(checkLiteral([1, 2], param('uint256[]'))).toEqual(undefined)
    expect(checkLiteral([1, 'x'], param('uint256[]'))).toEqual(
      '[1]: expected uint256 as an integer number or a decimal string, got "x"',
    )
    expect(checkLiteral([1], param('uint256[2]'))).toEqual(
      'expected 2 element(s) for uint256[2], got 1',
    )
    const tuple = param('tuple(address a, uint256 b)')
    expect(
      checkLiteral(['0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 1], tuple),
    ).toEqual(undefined)
    expect(checkLiteral([1], tuple)).toEqual(
      'expected 2 component(s) for (address,uint256), got 1',
    )
    expect(String(checkLiteral('x', tuple))).toMatchRegex(
      /expected an array of 2 component/,
    )
  })
})
