import { expect } from 'earl'
import { utils } from 'ethers'
import { BytesToString } from './BytesToString'

describe('BytesToString', () => {
  it('decodes a UTF-8 bytes hex into its string (CCIP chain config JSON)', () => {
    const json =
      '{"gasPriceDeviationPPB":"4000000000","chainFeeDeviationDisabled":false}'
    const hex = utils.hexlify(utils.toUtf8Bytes(json))
    expect(BytesToString.cast({}, hex)).toEqual(json)
  })

  it('decodes empty bytes to an empty string', () => {
    expect(BytesToString.cast({}, '0x')).toEqual('')
  })

  it('returns the original value when bytes are not valid UTF-8', () => {
    const invalid = '0xff'
    expect(BytesToString.cast({}, invalid)).toEqual(invalid)
  })

  it('throws if value is not a hex string', () => {
    expect(() => BytesToString.cast({}, 42)).toThrow('Value must be a hex string')
  })

  it('throws if value does not start with 0x', () => {
    expect(() => BytesToString.cast({}, 'abc')).toThrow(
      'Value must be a hex string',
    )
  })
})
