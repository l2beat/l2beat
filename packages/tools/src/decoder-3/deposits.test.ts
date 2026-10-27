import { expect } from 'earl'
import { readFileSync } from 'fs'
import type { Hex } from 'viem'
import type { DecodedValue } from './decode'
import {
  applyL1ToL2Alias,
  getCallContext,
  getL2Sender,
  isOpDeposit,
  onDepositChain,
} from './deposits'
import { decode } from './plugins'

const MULTICALL = '0xca11bde05977b3631167028862be2a173976ca11'
const L1PAO = '0x5a0aae59d09fccbddb6c6cceb07b7279367c3d2a'
const L1PAO_ALIAS = '0x6b1bae59d09fccbddb6c6cceb07b7279367c4e3b'
const L1_SPLITTER = '0x4300c0d3c0d3c0d3c0d3c0d3c0d3c0d3c0d30003'

describe(applyL1ToL2Alias.name, () => {
  it('adds the alias offset modulo 2^160', () => {
    expect(applyL1ToL2Alias(L1PAO)).toEqual(L1PAO_ALIAS)
    expect(
      applyL1ToL2Alias('0xffffffffffffffffffffffffffffffffffffffff'),
    ).toEqual('0x1111000000000000000000000000000000001110')
  })

  it('aliases only contract senders', () => {
    expect(getL2Sender(L1PAO, 'contract')).toEqual(L1PAO_ALIAS)
    expect(getL2Sender(L1PAO, 'eoa')).toEqual(L1PAO)
    expect(getL2Sender(L1PAO, 'delegated')).toEqual(L1PAO)
  })
})

describe(getCallContext.name, () => {
  const data = readFileSync(
    `${__dirname}/fixtures/unichain-l1splitter-accept.txt`,
    'utf8',
  ).trim() as Hex

  // Walks the tree the way DecodedView does, recording each deposit.
  function walk(
    value: DecodedValue,
    executor: Hex | undefined,
    found: { sender?: Hex; l2Sender?: Hex; data?: DecodedValue }[],
  ) {
    const decoded =
      value.type === 'bytes'
        ? (decode(value.bytes, [], value.chainId ?? 1, value.address) ?? value)
        : value
    const context = getCallContext(value, decoded, executor, () => 'contract')
    const shown = isOpDeposit(decoded) ? onDepositChain(decoded, 130) : decoded
    if (isOpDeposit(decoded)) {
      found.push({ ...context, data: shown.members?.[4] })
    }
    for (const member of shown.members ?? []) {
      walk(member, context.childExecutor, found)
    }
    return found
  }

  it('finds the L1PAO as the sender of the deposits it delegatecalls', () => {
    const deposits = walk(
      {
        type: 'bytes',
        bytes: data,
        value: data,
        chainId: 1,
        address: MULTICALL,
      },
      undefined,
      [],
    )
    expect(deposits.length).toEqual(3)
    for (const deposit of deposits) {
      expect(deposit.sender).toEqual(L1PAO)
      expect(deposit.l2Sender).toEqual(L1PAO_ALIAS)
      expect(deposit.data?.chainId).toEqual(130)
      expect(deposit.data?.address).toEqual(L1_SPLITTER)
    }
  })

  it('does not guess the sender of delegatecalled code', () => {
    const call: DecodedValue = {
      type: 'call',
      bytes: '0x12345678',
      value: '',
      address: MULTICALL,
    }
    expect(
      getCallContext(
        { ...call, type: 'bytes', delegatecall: true },
        call,
        L1PAO,
        () => 'contract',
      ),
    ).toEqual({ childExecutor: L1PAO })
    expect(
      getCallContext({ ...call, type: 'bytes' }, call, L1PAO, () => 'contract'),
    ).toEqual({ sender: L1PAO, childExecutor: MULTICALL })
  })
})

describe(onDepositChain.name, () => {
  it('moves only the target and data to the L2', () => {
    const member = (name: string): DecodedValue => ({
      name,
      type: 'number',
      value: '0',
      bytes: '0x',
      chainId: 1,
    })
    const deposit: DecodedValue = {
      type: 'call',
      value: '',
      bytes: '0x',
      chainId: 1,
      members: ['to', 'value', 'gasLimit', 'isCreation', 'data'].map(member),
    }
    expect(onDepositChain(deposit, 130).members?.map((x) => x.chainId)).toEqual(
      [130, 1, 1, 1, 130],
    )
  })
})
