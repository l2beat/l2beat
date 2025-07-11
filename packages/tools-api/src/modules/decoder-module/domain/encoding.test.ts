import { parseAbiParameter } from 'abitype'
import { expect } from 'earl'
import { describe } from 'mocha'
import { encodeAbiParameters } from 'viem'
import {
  decodeType,
  type ParsedType,
  parseType,
  tokenizeType,
} from './encoding'

describe(decodeType.name, () => {
  it('uint', () => {
    const e = encode('uint', 12345n)
    const d = decodeType('uint', e)
    expect(d).toEqual({
      name: '',
      abi: 'uint256',
      encoded: e,
      decoded: { type: 'number', value: '12345' },
    })
  })

  it('uint8', () => {
    const e = encode('uint8', 15)
    const d = decodeType('uint8', e)
    expect(d).toEqual({
      name: '',
      abi: 'uint8',
      encoded: e,
      decoded: { type: 'number', value: '15' },
    })
  })

  it('uint overflow', () => {
    const e = encode('uint32', 12345678)
    expect(() => decodeType('uint8', e)).toThrow()
  })

  it('int (negative)', () => {
    const e = encode('int', -12345n)
    const d = decodeType('int', e)
    expect(d).toEqual({
      name: '',
      abi: 'int256',
      encoded: e,
      decoded: { type: 'number', value: '-12345' },
    })
  })

  it('int (positive)', () => {
    const e = encode('int', 12345n)
    const d = decodeType('int', e)
    expect(d).toEqual({
      name: '',
      abi: 'int256',
      encoded: e,
      decoded: { type: 'number', value: '12345' },
    })
  })

  it('int8', () => {
    const e = encode('int8', -17)
    const d = decodeType('int8', e)
    expect(d).toEqual({
      name: '',
      abi: 'int8',
      encoded: e,
      decoded: { type: 'number', value: '-17' },
    })
  })

  it('int8 min', () => {
    const e = encode('int8', -128)
    const d = decodeType('int8', e)
    expect(d).toEqual({
      name: '',
      abi: 'int8',
      encoded: e,
      decoded: { type: 'number', value: '-128' },
    })
  })

  it('int overflow', () => {
    const e = encode('int32', -12345678)
    expect(() => decodeType('int8', e)).toThrow()
  })

  it('address', () => {
    const e = encode('address', '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    const d = decodeType('address', e)
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
    const e = encode('int', -1n)
    expect(() => decodeType('address', e)).toThrow()
  })

  it('bool true', () => {
    const e = encode('bool', true)
    const d = decodeType('bool', e)
    expect(d).toEqual({
      name: '',
      abi: 'bool',
      encoded: e,
      decoded: { type: 'bool', value: true },
    })
  })

  it('bool false', () => {
    const e = encode('bool', false)
    const d = decodeType('bool', e)
    expect(d).toEqual({
      name: '',
      abi: 'bool',
      encoded: e,
      decoded: { type: 'bool', value: false },
    })
  })

  it('bool overflow', () => {
    const e = encode('uint', 2n)
    expect(() => decodeType('bool', e)).toThrow()
  })

  it('bytes32', () => {
    const encoded: `0x${string}` = `0x${'deadbeef'.repeat(8)}`
    const d = decodeType('bytes32', encoded)
    expect(d).toEqual({
      name: '',
      abi: 'bytes32',
      encoded: encoded,
      decoded: { type: 'bytes', value: encoded, extra: '0x', dynamic: false },
    })
  })

  it('bytes4', () => {
    const encoded = encode('bytes4', '0xdeadbeef')
    const d = decodeType('bytes4', encoded)
    expect(d).toEqual({
      name: '',
      abi: 'bytes4',
      encoded: encoded,
      decoded: {
        type: 'bytes',
        value: '0xdeadbeef',
        extra: '0x',
        dynamic: false,
      },
    })
  })

  it('bytes4 overflow', () => {
    const encoded = encode('bytes5', '0xdeadbeef12')
    expect(() => decodeType('bytes4', encoded)).toThrow()
  })

  it('bytes', () => {
    const bytes: `0x${string}` = `0x${'ab12'.repeat(20)}`
    const e = encode('bytes', bytes)
    const d = decodeType('bytes', e)
    expect(d).toEqual({
      name: '',
      abi: 'bytes',
      encoded: e,
      decoded: { type: 'bytes', value: bytes, extra: '0x', dynamic: true },
    })
  })

  it('bytes extra', () => {
    const bytes: `0x${string}` = `0x${'ab12'.repeat(20)}`
    const e: `0x${string}` = `${encode('bytes', bytes)}${'deadbeef'.repeat(8)}`
    const d = decodeType('bytes', e)
    expect(d).toEqual({
      name: '',
      abi: 'bytes',
      encoded: e,
      decoded: {
        type: 'bytes',
        value: bytes,
        extra: `0x${'deadbeef'.repeat(8)}`,
        dynamic: true,
      },
    })
  })

  it('string', () => {
    const s = 'I like pancakes!'
    const e = encode('string', s)
    const d = decodeType('string', e)
    expect(d).toEqual({
      name: '',
      abi: 'string',
      encoded: e,
      decoded: { type: 'string', value: s, extra: '0x' },
    })
  })

  it('uint[2]', () => {
    const e = encode('uint[2]', [1n, 2n])
    const d = decodeType('uint[2]', e)
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
        extra: '0x',
      },
    })
  })

  it('uint[2] extra', () => {
    const e: `0x${string}` = `${encode('uint[2]', [1n, 2n])}deadbeef`
    const d = decodeType('uint[2]', e)
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
        extra: '0xdeadbeef',
      },
    })
  })

  it('uint[]', () => {
    const e = encode('uint[]', [1n, 2n])
    const d = decodeType('uint[]', e)
    expect(d).toEqual({
      name: '',
      abi: 'uint256[]',
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
        extra: '0x',
      },
    })
  })

  it('string[]', () => {
    const e = encode('string[]', ['foo', 'bar'])
    const d = decodeType('string[]', e)
    expect(d).toEqual({
      name: '',
      abi: 'string[]',
      encoded: e,
      decoded: {
        type: 'array',
        value: [
          {
            name: '',
            abi: 'string',
            encoded: encode('string', 'foo'),
            decoded: { type: 'string', value: 'foo', extra: '0x' },
          },
          {
            name: '',
            abi: 'string',
            encoded: encode('string', 'bar'),
            decoded: { type: 'string', value: 'bar', extra: '0x' },
          },
        ],
        extra: '0x',
      },
    })
  })

  it('(uint256, string)[]', () => {
    const e = encode('(uint256, string)[]', [
      [1n, 'foo'],
      [2n, 'bar'],
    ])
    const d = decodeType('(uint256, string)[]', e)
    expect(d).toEqual({
      name: '',
      abi: '(uint256, string)[]',
      encoded: e,
      decoded: {
        type: 'array',
        value: [
          {
            name: '',
            abi: '(uint256, string)',
            encoded: encode('(uint256, string)', [1n, 'foo']),
            decoded: {
              type: 'array',
              value: [
                {
                  name: '',
                  abi: 'uint256',
                  encoded: encode('uint256', 1n),
                  decoded: { type: 'number', value: '1' },
                },
                {
                  name: '',
                  abi: 'string',
                  encoded: encode('string', 'foo'),
                  decoded: { type: 'string', value: 'foo', extra: '0x' },
                },
              ],
              extra: '0x',
            },
          },
          {
            name: '',
            abi: '(uint256, string)',
            encoded: encode('(uint256, string)', [2n, 'bar']),
            decoded: {
              type: 'array',
              value: [
                {
                  name: '',
                  abi: 'uint256',
                  encoded: encode('uint256', 2n),
                  decoded: { type: 'number', value: '2' },
                },
                {
                  name: '',
                  abi: 'string',
                  encoded: encode('string', 'bar'),
                  decoded: { type: 'string', value: 'bar', extra: '0x' },
                },
              ],
              extra: '0x',
            },
          },
        ],
        extra: '0x',
      },
    })
  })

  it('function approve(address spender, uint256 amount)', () => {
    const spender: `0x${string}` = `0x${'deadbeef'.repeat(5)}`
    const selector = '0x095ea7b3'
    const tuple = encode('(address spender, uint256 amount)', [spender, 1234n])
    const e: `0x${string}` = `${selector}${tuple.slice(2)}`
    const d = decodeType('function approve(address spender, uint256 amount)', e)
    expect(d).toEqual({
      name: 'approve',
      abi: 'function approve(address, uint256)',
      encoded: e,
      decoded: {
        type: 'call',
        selector,
        parameters: [
          {
            name: 'spender',
            abi: 'address',
            encoded: encode('address', spender),
            decoded: { type: 'address', value: spender },
          },
          {
            name: 'amount',
            abi: 'uint256',
            encoded: encode('uint256', 1234n),
            decoded: { type: 'number', value: '1234' },
          },
        ],
        extra: '0x',
      },
    })
  })

  it('function name() extra', () => {
    const selector: `0x${string}` = '0x06fdde03'
    const e: `0x${string}` = `${selector}deadbeef`
    const d = decodeType('function name()', e)
    expect(d).toEqual({
      name: 'name',
      abi: 'function name()',
      encoded: e,
      decoded: {
        type: 'call',
        selector,
        parameters: [],
        extra: '0xdeadbeef',
      },
    })
  })
})

function encode(type: string, value: unknown): `0x${string}` {
  const encoded = encodeAbiParameters([parseAbiParameter(type)], [value])
  if (parseType(type).dynamic) {
    return `0x${encoded.slice(66)}`
  }
  return encoded
}

describe(parseType.name, () => {
  const testCases: (ParsedType & { __type?: string })[] = [
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
    {
      __type: 'uint balance',
      type: 'uint256',
      name: 'balance',
      size: 1,
      dynamic: false,
    },
    {
      __type: 'bytes calldata data',
      type: 'bytes',
      name: 'data',
      size: 1,
      dynamic: true,
    },
    {
      __type: 'string calldata',
      type: 'string',
      size: 1,
      dynamic: true,
    },
    {
      __type:
        'function foo(string calldata name, (uint a, uint b) c) returns (bool)',
      type: 'function foo(string, (uint256, uint256))',
      name: 'foo',
      dynamic: true,
      size: 1,
      function: true,
      tupleElements: [
        { type: 'string', name: 'name', size: 1, dynamic: true },
        {
          type: '(uint256, uint256)',
          name: 'c',
          size: 2,
          dynamic: false,
          tupleElements: [
            { type: 'uint256', name: 'a', size: 1, dynamic: false },
            { type: 'uint256', name: 'b', size: 1, dynamic: false },
          ],
        },
      ],
    },
  ]

  for (const testCase of testCases) {
    const toParse = testCase.__type ?? testCase.type
    // biome-ignore lint/performance/noDelete: Those are just tests
    delete testCase.__type
    it(toParse, () => {
      const parsed = parseType(toParse)
      expect(parsed).toEqual(testCase)
    })
  }
})

describe(tokenizeType.name, () => {
  const testCases: [string, string[]][] = [
    [
      'function foo() returns (uint)',
      ['function', 'foo', '(', ')', 'returns', '(', 'uint', ')'],
    ],
    [
      '(uint[2][] a, string)',
      ['(', 'uint', '[', '2', ']', '[', ']', 'a', ',', 'string', ')'],
    ],
  ]

  for (const testCase of testCases) {
    const [first, rest] = testCase
    it(first, () => {
      const tokens = tokenizeType(first)
      expect(tokens).toEqual(rest)
    })
  }
})
