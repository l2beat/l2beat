import { parseAbiParameter } from 'abitype'
import { expect } from 'earl'
import { describe } from 'mocha'
import { encodeAbiParameters } from 'viem'
import { decodeType, type ParsedType, parseType } from './encoding'

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

  it('uint overflow', () => {
    const e = encodeAbiParameters([parseAbiParameter('uint32')], [12345678])
    expect(() => decodeType(parseAbiParameter('uint8'), e)).toThrow()
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

  it('int8 min', () => {
    const t = parseAbiParameter('int8')
    const e = encodeAbiParameters([t], [-128])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'int8',
      encoded: e,
      decoded: { type: 'number', value: '-128' },
    })
  })

  it('int overflow', () => {
    const e = encodeAbiParameters([parseAbiParameter('int32')], [-12345678])
    expect(() => decodeType(parseAbiParameter('int8'), e)).toThrow()
  })

  it('address', () => {
    const t = parseAbiParameter('address')
    const e = encodeAbiParameters(
      [t],
      ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'],
    )
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'address',
      encoded: e,
      decoded: {
        type: 'address',
        value: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      },
    })
  })

  it('address overflow', () => {
    const e = encodeAbiParameters([parseAbiParameter('int')], [-1n])
    expect(() => decodeType(parseAbiParameter('address'), e)).toThrow()
  })

  it('bool true', () => {
    const t = parseAbiParameter('bool')
    const e = encodeAbiParameters([t], [true])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'bool',
      encoded: e,
      decoded: { type: 'bool', value: true },
    })
  })

  it('bool false', () => {
    const t = parseAbiParameter('bool')
    const e = encodeAbiParameters([t], [false])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'bool',
      encoded: e,
      decoded: { type: 'bool', value: false },
    })
  })

  it('bool overflow', () => {
    const e = encodeAbiParameters([parseAbiParameter('uint')], [2n])
    expect(() => decodeType(parseAbiParameter('bool'), e)).toThrow()
  })

  it('bytes32', () => {
    const encoded: `0x${string}` = `0x${'deadbeef'.repeat(8)}`
    const d = decodeType(parseAbiParameter('bytes32'), encoded)
    expect(d).toEqual({
      name: '',
      abi: 'bytes32',
      encoded: encoded,
      decoded: { type: 'bytes', value: encoded },
    })
  })

  it('bytes4', () => {
    const encoded: `0x${string}` = `0x${'deadbeef'.padStart(64, '0')}`
    const d = decodeType(parseAbiParameter('bytes4'), encoded)
    expect(d).toEqual({
      name: '',
      abi: 'bytes4',
      encoded: encoded,
      decoded: { type: 'bytes', value: `0xdeadbeef` },
    })
  })

  it('bytes4 overflow', () => {
    const encoded: `0x${string}` = `0x${'deadbeef12'.padStart(64, '0')}`
    expect(() => decodeType(parseAbiParameter('bytes4'), encoded)).toThrow()
  })

  it('bytes', () => {
    const bytes: `0x${string}` = `0x${'ab12'.repeat(20)}`
    const t = parseAbiParameter('bytes')
    const e: `0x${string}` = `0x${encodeAbiParameters([t], [bytes]).slice(66)}`
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'bytes',
      encoded: e,
      decoded: { type: 'bytes', value: bytes },
    })
  })

  it('string', () => {
    const s = 'I like pancakes!'
    const t = parseAbiParameter('string')
    const e: `0x${string}` = `0x${encodeAbiParameters([t], [s]).slice(66)}`
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'string',
      encoded: e,
      decoded: { type: 'string', value: s },
    })
  })

  it('uint[2]', () => {
    const t = parseAbiParameter('uint[2]')
    const e = encodeAbiParameters([t], [[1n, 2n]])
    const d = decodeType(t, e)
    expect(d).toEqual({
      name: '',
      abi: 'uint256[2]',
      encoded: e,
      decoded: {
        type: 'array',
        value: [
          {
            name: '',
            abi: 'uint256',
            encoded: `0x${'0'.repeat(63)}1`,
            decoded: { type: 'number', value: '1' },
          },
          {
            name: '',
            abi: 'uint256',
            encoded: `0x${'0'.repeat(63)}2`,
            decoded: { type: 'number', value: '2' },
          },
        ],
      },
    })
  })
})

describe(parseType.name, () => {
  const testCases: ParsedType[] = [
    { type: 'uint256', size: 1, dynamic: false },
    {
      type: 'uint256[2]',
      size: 2,
      dynamic: false,
      tupleElements: [
        { type: 'uint256', size: 1, dynamic: false },
        { type: 'uint256', size: 1, dynamic: false },
      ],
    },
    {
      type: 'uint256[2][2]',
      size: 4,
      dynamic: false,
      tupleElements: [
        {
          type: 'uint256[2]',
          size: 2,
          dynamic: false,
          tupleElements: [
            { type: 'uint256', size: 1, dynamic: false },
            { type: 'uint256', size: 1, dynamic: false },
          ],
        },
        {
          type: 'uint256[2]',
          size: 2,
          dynamic: false,
          tupleElements: [
            { type: 'uint256', size: 1, dynamic: false },
            { type: 'uint256', size: 1, dynamic: false },
          ],
        },
      ],
    },
    { type: 'bytes', size: 1, dynamic: true },
    { type: 'string', size: 1, dynamic: true },
    {
      type: 'uint256[]',
      size: 1,
      dynamic: true,
      arrayElement: { type: 'uint256', size: 1, dynamic: false },
    },
    {
      type: 'uint256[][2]',
      size: 1,
      dynamic: true,
      tupleElements: [
        {
          type: 'uint256[]',
          size: 1,
          dynamic: true,
          arrayElement: { type: 'uint256', size: 1, dynamic: false },
        },
        {
          type: 'uint256[]',
          size: 1,
          dynamic: true,
          arrayElement: { type: 'uint256', size: 1, dynamic: false },
        },
      ],
    },
    {
      type: '(uint256, uint256)',
      size: 2,
      dynamic: false,
      tupleElements: [
        { type: 'uint256', size: 1, dynamic: false },
        { type: 'uint256', size: 1, dynamic: false },
      ],
    },
    {
      type: '((uint256, uint256), (uint256))',
      size: 3,
      dynamic: false,
      tupleElements: [
        {
          type: '(uint256, uint256)',
          size: 2,
          dynamic: false,
          tupleElements: [
            { type: 'uint256', size: 1, dynamic: false },
            { type: 'uint256', size: 1, dynamic: false },
          ],
        },
        {
          type: '(uint256)',
          size: 1,
          dynamic: false,
          tupleElements: [{ type: 'uint256', size: 1, dynamic: false }],
        },
      ],
    },
    {
      type: '(uint256, string)',
      size: 1,
      dynamic: true,
      tupleElements: [
        { type: 'uint256', size: 1, dynamic: false },
        { type: 'string', size: 1, dynamic: true },
      ],
    },
    {
      type: '(uint256, (uint256, string))',
      size: 1,
      dynamic: true,
      tupleElements: [
        { type: 'uint256', size: 1, dynamic: false },
        {
          type: '(uint256, string)',
          size: 1,
          dynamic: true,
          tupleElements: [
            { type: 'uint256', size: 1, dynamic: false },
            { type: 'string', size: 1, dynamic: true },
          ],
        },
      ],
    },
  ]

  for (const testCase of testCases) {
    it(testCase.type, () => {
      const parsed = parseType(testCase.type)
      expect(parsed).toEqual(testCase)
    })
  }
})
