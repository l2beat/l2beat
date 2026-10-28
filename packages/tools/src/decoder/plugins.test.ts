import { expect } from 'earl'
import { describe } from 'mocha'
import {
  concatHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
  toHex,
} from 'viem'
import { decode, decodeAs } from './plugins'

const SET_IMPLEMENTATION_ABI =
  'function setImplementation(uint32 _gameType, address _impl, bytes _args)'
const ABI = parseAbi([SET_IMPLEMENTATION_ABI])
const IMPLEMENTATION = '0xe1dffcbe4e22b813f26d2106d943c102e7cab87e'
const OTHER_IMPLEMENTATION = '0x1111111111111111111111111111111111111111'
const FACTORY = '0x10d7b35078d3baabb96dd45a9143b94be65b12cd'
const GAME_ARGS =
  '0xdead000000000000000000000000000000000000000000000000000000000000acc005dcd857b401e4732e6f7837135a22825cfaee018baf058227872540ac60efbd38b023d9dae257b4c29daee99a28e6e86778b499361294c134ea000000000000000000000000000000000000000000000000000000000000def13832bfbef03173e4c49a00ec0dd178817a02d1779ba6e03d8b90de867373db8cf1a58d2f7f006b3a'

describe('packed argument plugin', () => {
  it('decodes PermissionedDisputeGame args in setImplementation', () => {
    const calldata = encodeFunctionData({
      abi: ABI,
      functionName: 'setImplementation',
      args: [1, IMPLEMENTATION, GAME_ARGS],
    })
    const decoded = decode(calldata, [], 1, FACTORY)

    expect(decoded?.functionName).toEqual('setImplementation')
    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.type).toEqual('tuple')
    expect(args?.members?.map(({ name, value }) => ({ name, value }))).toEqual([
      {
        name: 'absolutePrestate',
        value:
          '0xdead000000000000000000000000000000000000000000000000000000000000',
      },
      { name: 'vm', value: '0xacc005dcd857b401e4732e6f7837135a22825cfa' },
      {
        name: 'anchorStateRegistry',
        value: '0xee018baf058227872540ac60efbd38b023d9dae2',
      },
      {
        name: 'weth',
        value: '0x57b4c29daee99a28e6e86778b499361294c134ea',
      },
      { name: 'l2ChainId', value: '57073' },
      {
        name: 'proposer',
        value: '0x3832bfbef03173e4c49a00ec0dd178817a02d177',
      },
      {
        name: 'challenger',
        value: '0x9ba6e03d8b90de867373db8cf1a58d2f7f006b3a',
      },
    ])
  })

  it('does not apply the schema to an unknown implementation', () => {
    const calldata = encodeFunctionData({
      abi: ABI,
      functionName: 'setImplementation',
      args: [1, OTHER_IMPLEMENTATION, GAME_ARGS],
    })
    const decoded = decode(calldata, [SET_IMPLEMENTATION_ABI], 1, FACTORY)

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.type).toEqual('bytes')
    expect(args?.value).toEqual(GAME_ARGS)
  })

  it('does not apply the schema to malformed packed args', () => {
    const calldata = encodeFunctionData({
      abi: ABI,
      functionName: 'setImplementation',
      args: [1, IMPLEMENTATION, '0xdeadbeef'],
    })
    const decoded = decode(calldata, [SET_IMPLEMENTATION_ABI], 1, FACTORY)

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.type).toEqual('bytes')
    expect(args?.value).toEqual('0xdeadbeef')
  })
})

describe('CREATE2 factory plugin', () => {
  it('marks the salt as a fixed-size value, not calldata', () => {
    const decoded = decode(
      `0x8456cb59${'00'.repeat(28)}6080`,
      [],
      1,
      '0x4e59b44847b379578588920ca78fbf26c0b4956c',
    )

    const salt = decoded?.members?.find((x) => x.name === 'salt')
    expect(salt?.isFixedSize).toEqual(true)
  })

  it('leaves data shorter than a salt to the signatures', () => {
    const decoded = decode(
      '0x8456cb59',
      ['function pause()'],
      1,
      '0x4e59b44847b379578588920ca78fbf26c0b4956c',
    )

    expect(decoded?.functionName).toEqual('pause')
  })
})

describe(decodeAs.name, () => {
  const TARGET = '0x1111111111111111111111111111111111111111'
  const TOKEN = '0x4444444444444444444444444444444444444444'

  it('decodes a parameter list without parentheses', () => {
    const bytes = encodeAbiParameters(parseAbiParameters('address, bytes'), [
      TARGET,
      '0xdeadbeef',
    ])

    const decoded = decodeAs(' address, bytes ', bytes, 10)

    expect(decoded.type).toEqual('tuple')
    expect(decoded.members?.map((x) => [x.type, x.value, x.chainId])).toEqual([
      ['address', TARGET, 10],
      ['bytes', '0xdeadbeef', 10],
    ])
    expect(decoded.members?.[1]?.address).toEqual(TARGET)
  })

  it('decodes a parenthesized type as one tuple like abi.decode', () => {
    const bytes = encodeAbiParameters(
      parseAbiParameters('(uint256 a, string b)'),
      [{ a: 7n, b: 'hi' }],
    )

    const decoded = decodeAs('(uint256 a, string b)', bytes, 1)

    expect(
      decoded.members?.[0]?.members?.map((x) => [x.name, x.value]),
    ).toEqual([
      ['a', '7'],
      ['b', 'hi'],
    ])
  })

  it('routes a retryable ticket to its L2 target', () => {
    const bytes = encodeAbiParameters(
      parseAbiParameters('address, address, uint256, uint256, uint256, bytes'),
      [
        '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f',
        TARGET,
        0n,
        100_000n,
        1n,
        '0xdeadbeef',
      ],
    )

    const decoded = decodeAs('retryableTicket', bytes, 1)

    const l2Calldata = decoded.members?.[5]
    expect([
      l2Calldata?.name,
      l2Calldata?.address,
      l2Calldata?.chainId,
    ]).toEqual(['l2Calldata', TARGET, 42161])
  })

  it('marks token amounts in a custom function', () => {
    const bytes = encodeFunctionData({
      abi: parseAbi(['function transfer(address, uint256)']),
      args: [TARGET, 7n],
    })

    const decoded = decodeAs(
      'function transfer(address to, uint256 value)',
      bytes,
      1,
      TOKEN,
    )

    expect(decoded.members?.[1]?.token).toEqual(TOKEN)
  })

  it('decodes a function call', () => {
    const bytes = encodeFunctionData({
      abi: parseAbi(['function foo(uint256 a)']),
      args: [7n],
    })

    const decoded = decodeAs('function foo(uint a)', bytes, 1, TARGET)

    expect(decoded.functionName).toEqual('foo')
    expect(decoded.address).toEqual(TARGET)
    expect(decoded.members?.[0]?.value).toEqual('7')
  })

  it('decodes packed multiSend transactions', () => {
    const bytes = concatHex([
      '0x01',
      TARGET,
      toHex(5n, { size: 32 }),
      toHex(4n, { size: 32 }),
      '0xdeadbeef',
    ])

    const decoded = decodeAs('multiSend', bytes, 1)

    expect(
      decoded.members?.[0]?.members?.map((x) => [x.name, x.value]),
    ).toEqual([
      ['operation', 'delegatecall'],
      ['target', TARGET],
      ['value', '5'],
      ['data', '0xdeadbeef'],
    ])
  })

  it('decodes a single word', () => {
    const decoded = decodeAs('uint256', toHex(42n, { size: 32 }), 1)

    expect(decoded.members?.[0]?.value).toEqual('42')
  })

  it('rejects bytes that do not match the type', () => {
    expect(() => decodeAs('address', '0xdeadbeef', 1)).toThrow()
  })
})
