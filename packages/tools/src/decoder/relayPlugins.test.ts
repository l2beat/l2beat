import { expect } from 'earl'
import { describe } from 'mocha'
import {
  concatHex,
  encodeAbiParameters,
  encodeFunctionData,
  parseAbi,
  parseAbiParameters,
  toFunctionSelector,
} from 'viem'
import type { DecodedValue } from './decode'
import { decode } from './plugins'

const TARGET = '0x1111111111111111111111111111111111111111'
const L2_TARGET = '0x2222222222222222222222222222222222222222'
const CALLER = '0x3333333333333333333333333333333333333333'
const TOKEN = '0x4444444444444444444444444444444444444444'
const ARBITRUM_ONE_INBOX = '0x4dbd4fc535ac27206064b68ffcf827b0a60bab3f'
const RETRYABLE_TICKET_MAGIC = '0xa723c008e76e379c55599d2e4d93879beafda79c'
const INNER_CALL = encodeFunctionData({
  abi: parseAbi(['function pause()']),
  functionName: 'pause',
})

describe('relay plugins', () => {
  it('routes Arbitrum timelock payloads to their targets and L2', () => {
    const ticket = encodeAbiParameters(
      parseAbiParameters('address, address, uint256, uint256, uint256, bytes'),
      [ARBITRUM_ONE_INBOX, L2_TARGET, 0n, 100_000n, 1n, INNER_CALL],
    )
    const data = encodeFunctionData({
      abi: parseAbi([
        'function scheduleBatch(address[], uint256[], bytes[], bytes32, bytes32, uint256)',
      ]),
      args: [
        [TARGET, RETRYABLE_TICKET_MAGIC],
        [0n, 0n],
        [INNER_CALL, ticket],
        `0x${'00'.repeat(32)}`,
        `0x${'00'.repeat(32)}`,
        259200n,
      ],
    })

    const payloads = member(decode(data, [], 1, CALLER), 'payloads')

    expect(target(member(payloads, '0'))).toEqual({
      type: 'bytes',
      chainId: 1,
      address: TARGET,
    })
    expect(member(payloads, '1').type).toEqual('tuple')
    expect(target(member(member(payloads, '1'), 'l2Target'))).toEqual({
      type: 'address',
      chainId: 42161,
      address: undefined,
    })
    expect(target(member(member(payloads, '1'), 'l2Calldata'))).toEqual({
      type: 'bytes',
      chainId: 42161,
      address: L2_TARGET,
    })
  })

  it('routes ArbSys messages to Ethereum', () => {
    const data = encodeFunctionData({
      abi: parseAbi(['function sendTxToL1(address, bytes)']),
      args: [TARGET, INNER_CALL],
    })

    const decoded = decode(data, [], 42161, CALLER)

    expect(target(member(decoded, 'data'))).toEqual({
      type: 'bytes',
      chainId: 1,
      address: TARGET,
    })
  })

  it('decodes ZKsync upgrade proposals sent to Ethereum', () => {
    const proposal = encodeAbiParameters(
      parseAbiParameters('((address, uint256, bytes)[], address, bytes32)'),
      [[[[TARGET, 0n, INNER_CALL]], CALLER, `0x${'00'.repeat(32)}`]],
    )
    const data = encodeFunctionData({
      abi: parseAbi(['function sendToL1(bytes)']),
      args: [proposal],
    })

    const message = member(decode(data, [], 324, CALLER), 'message')
    const call = member(member(message, 'calls'), '0')

    expect(target(member(call, 'data'))).toEqual({
      type: 'bytes',
      chainId: 1,
      address: TARGET,
    })
    expect(decode(data, [], 1, CALLER)).toEqual(undefined)
  })

  it('decodes Taiko DAO actions', () => {
    const actions = encodeAbiParameters(
      parseAbiParameters('(address, uint256, bytes)[]'),
      [[[TARGET, 0n, INNER_CALL]]],
    )
    const data = encodeFunctionData({
      abi: parseAbi(['function execute(bytes)']),
      args: [actions],
    })

    const action = member(member(decode(data, [], 1, CALLER), 'actions'), '0')

    expect(target(member(action, 'data'))).toEqual({
      type: 'bytes',
      chainId: 1,
      address: TARGET,
    })
  })

  it('keeps extra bytes after a decoded Taiko execute call', () => {
    const actions = encodeAbiParameters(
      parseAbiParameters('(address, uint256, bytes)[]'),
      [[[TARGET, 0n, INNER_CALL]]],
    )
    const data = encodeFunctionData({
      abi: parseAbi(['function execute(bytes)']),
      args: [actions],
    })

    const decoded = decode(concatHex([data, '0xdead']), [], 1, CALLER)

    expect(member(decoded, 'actions').type).toEqual('array')
    expect(decoded?.extra).toEqual('0xdead')
  })

  it('leaves unrelated execute bytes to the signatures', () => {
    const data = encodeFunctionData({
      abi: parseAbi(['function execute(bytes)']),
      args: ['0xdeadbeef'],
    })

    const decoded = decode(data, ['function execute(bytes data)'], 1, CALLER)

    expect(member(decoded, 'data').value).toEqual('0xdeadbeef')
  })

  it('decodes Taiko bridge message invocations', () => {
    const actions = encodeAbiParameters(
      parseAbiParameters('(address, uint256, bytes)[]'),
      [[[TARGET, 0n, INNER_CALL]]],
    )
    const data = encodeFunctionData({
      abi: parseAbi(['function onMessageInvocation(bytes)']),
      args: [concatHex(['0x000000000000002a', actions])],
    })

    const payload = member(decode(data, [], 167000, CALLER), 'data')

    expect(member(payload, 'executionId').value).toEqual('42')
    expect(
      target(member(member(member(payload, 'actions'), '0'), 'data')),
    ).toEqual({ type: 'bytes', chainId: 167000, address: TARGET })
  })

  it('decodes WhiteBIT packed transfers', () => {
    const amount = `0x${'00'.repeat(19)}64` as const
    const data = concatHex([
      '0xaf713566',
      '0x02',
      '0x000102',
      '0xff0102',
      TOKEN,
      TARGET,
      amount,
    ])

    const decoded = decode(data, [], 1, CALLER)

    expect(decoded?.extra).toEqual(undefined)
    expect(simplify(member(decoded, '0'))).toEqual([
      { name: 'token', value: TOKEN },
      { name: 'recipient', value: TARGET },
      { name: 'amount', value: '100', token: TOKEN },
    ])
    expect(simplify(member(decoded, '1'))).toEqual([
      { name: 'token', value: 'ETH' },
      { name: 'recipient', value: TARGET },
      { name: 'amount', value: '100', token: undefined },
    ])
  })

  it('marks ERC-20 amounts with their token', () => {
    const data = encodeFunctionData({
      abi: parseAbi(['function transfer(address, uint256)']),
      args: [TARGET, 1_000_000n],
    })

    const decoded = decode(
      data,
      ['function transfer(address to, uint256 value)'],
      1,
      TOKEN,
    )

    expect(member(decoded, 'value').value).toEqual('1000000')
    expect(member(decoded, 'value').token).toEqual(TOKEN)
  })

  it('does not mark an amount on a colliding non-token ABI', () => {
    const data = encodeFunctionData({
      abi: parseAbi(['function burn(uint256)']),
      args: [BigInt(`0x${'ab'.repeat(16)}${'00'.repeat(16)}`)],
    })

    const decoded = decode(
      data,
      ['function collate_propagate_storage(bytes16 key)'],
      1,
      TOKEN,
    )

    expect(decoded?.functionName).toEqual('collate_propagate_storage')
    expect(member(decoded, 'key').token).toEqual(undefined)
  })

  it('does not mark a colliding ABI with a numeric argument', () => {
    const data = concatHex([
      toFunctionSelector('function approve(address, uint256)'),
      encodeAbiParameters(parseAbiParameters('bytes16, uint128'), [
        `0x${'ab'.repeat(16)}`,
        5n,
      ]),
    ])

    const decoded = decode(
      data,
      ['function sign_szabo_bytecode(bytes16 key, uint128 amount)'],
      1,
      TOKEN,
    )

    expect(decoded?.functionName).toEqual('sign_szabo_bytecode')
    expect(member(decoded, 'amount').token).toEqual(undefined)
  })
})

function member(value: DecodedValue | undefined, name: string): DecodedValue {
  const found = value?.members?.find((x) => x.name === name)
  if (!found) throw new Error('Member not found', { cause: { name } })
  return found
}

function target(value: DecodedValue) {
  return { type: value.type, chainId: value.chainId, address: value.address }
}

function simplify(value: DecodedValue) {
  return (value.members ?? []).map((x) => ({
    name: x.name,
    value: x.value,
    ...(x.type === 'number' ? { token: x.token } : {}),
  }))
}
