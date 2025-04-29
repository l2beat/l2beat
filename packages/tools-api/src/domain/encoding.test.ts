import { parseAbiParameter } from 'abitype'
import { expect } from 'earl'
import { describe } from 'mocha'
import { encodeAbiParameters } from 'viem'
import { decodeType } from './encoding'

describe(decodeType.name, () => {
  it('uint', () => {
    const t = parseAbiParameter('uint')
    const e = encodeAbiParameters([t], [12345n])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'uint256',
      encoded: e,
      decoded: { type: 'number', value: '12345' },
    })
  })

  it('uint8', () => {
    const t = parseAbiParameter('uint8')
    const e = encodeAbiParameters([t], [15])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'uint8',
      encoded: e,
      decoded: { type: 'number', value: '15' },
    })
  })

  it('int (negative)', () => {
    const t = parseAbiParameter('int')
    const e = encodeAbiParameters([t], [-12345n])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'int256',
      encoded: e,
      decoded: { type: 'number', value: '-12345' },
    })
  })

  it('int (positive)', () => {
    const t = parseAbiParameter('int')
    const e = encodeAbiParameters([t], [12345n])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'int256',
      encoded: e,
      decoded: { type: 'number', value: '12345' },
    })
  })

  it('int8', () => {
    const t = parseAbiParameter('int8')
    const e = encodeAbiParameters([t], [-17])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'int8',
      encoded: e,
      decoded: { type: 'number', value: '-17' },
    })
  })
})
