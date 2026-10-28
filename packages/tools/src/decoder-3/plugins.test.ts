import { expect } from 'earl'
import { readFileSync } from 'fs'
import { describe } from 'mocha'
import { encodeFunctionData, parseAbi } from 'viem'
import type { DecodedValue } from './decode'
import { decode } from './plugins'

const SET_IMPLEMENTATION_ABI =
  'function setImplementation(uint32 _gameType, address _impl, bytes _args)'
const ABI = parseAbi([SET_IMPLEMENTATION_ABI])
const IMPLEMENTATION = '0xe1dffcbe4e22b813f26d2106d943c102e7cab87e'
const OTHER_IMPLEMENTATION = '0x1111111111111111111111111111111111111111'
const FACTORY = '0x10d7b35078d3baabb96dd45a9143b94be65b12cd'
const GAME_ARGS =
  '0xdead000000000000000000000000000000000000000000000000000000000000acc005dcd857b401e4732e6f7837135a22825cfaee018baf058227872540ac60efbd38b023d9dae257b4c29daee99a28e6e86778b499361294c134ea000000000000000000000000000000000000000000000000000000000000def13832bfbef03173e4c49a00ec0dd178817a02d1779ba6e03d8b90de867373db8cf1a58d2f7f006b3a'

const SUPER_PERMISSIONED_ARGS =
  '0x27cf508e4e3aa8d30b3226ac3b5ea0e8bcacaff986b392ca30ad7453c8d88b56eb5a04fd0e2175b7'

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

  it('decodes args by length for any implementation', () => {
    const calldata = encodeFunctionData({
      abi: ABI,
      functionName: 'setImplementation',
      args: [1, OTHER_IMPLEMENTATION, GAME_ARGS],
    })
    const decoded = decode(calldata, [SET_IMPLEMENTATION_ABI], 1, FACTORY)

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.type).toEqual('tuple')
    expect(args?.note).toEqual({
      text: 'OP permissioned game args, 164 B, as PERMISSIONED_CANNON expects',
    })
  })

  it('decodes SUPER_PERMISSIONED args', () => {
    const decoded = decode(
      encodeFunctionData({
        abi: ABI,
        functionName: 'setImplementation',
        args: [5, IMPLEMENTATION, SUPER_PERMISSIONED_ARGS],
      }),
      [],
      1,
      FACTORY,
    )

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.members?.map(({ name, value }) => ({ name, value }))).toEqual([
      {
        name: 'anchorStateRegistry',
        value: '0x27cf508e4e3aa8d30b3226ac3b5ea0e8bcacaff9',
      },
      { name: 'proposer', value: '0x86b392ca30ad7453c8d88b56eb5a04fd0e2175b7' },
    ])
    expect(args?.note).toEqual({
      text: 'OP super permissioned game args, 40 B, as SUPER_PERMISSIONED expects',
    })
  })

  it('warns when the layout is not the one the game type reads', () => {
    const decoded = decode(
      encodeFunctionData({
        abi: ABI,
        functionName: 'setImplementation',
        args: [1, IMPLEMENTATION, SUPER_PERMISSIONED_ARGS],
      }),
      [],
      1,
      FACTORY,
    )

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.type).toEqual('tuple')
    expect(args?.note).toEqual({
      text: 'OP super permissioned game args, 40 B, but PERMISSIONED_CANNON expects OP permissioned game args',
      warning: true,
    })
  })

  it('warns when the game type has no LibGameArgs layout', () => {
    const decoded = decode(
      encodeFunctionData({
        abi: ABI,
        functionName: 'setImplementation',
        args: [1337, IMPLEMENTATION, SUPER_PERMISSIONED_ARGS],
      }),
      [],
      1,
      FACTORY,
    )

    const args = decoded?.members?.find((member) => member.name === 'args')
    expect(args?.note).toEqual({
      text: 'OP super permissioned game args, 40 B, chosen by length: game type 1337 (KAILUA) has no LibGameArgs layout',
      warning: true,
    })
  })

  it('decodes the args nested in a Safe transaction batch', () => {
    const data = readFileSync(
      `${__dirname}/fixtures/unichain-proposer-rotation.txt`,
      'utf8',
    ).trim() as `0x${string}`
    let args: DecodedValue | undefined
    function walk(value: DecodedValue) {
      const decoded =
        value.type === 'bytes'
          ? (decode(value.bytes, [], value.chainId ?? 1, value.address) ??
            value)
          : value
      if (decoded.functionName === 'setImplementation') {
        expect(decoded.address).toEqual(
          '0x2f12d621a16e2d3285929c9996f478508951dfe4',
        )
        args = decoded.members?.find((member) => member.name === 'args')
      }
      for (const child of decoded.members ?? []) walk(child)
    }
    walk({
      type: 'bytes',
      value: data,
      bytes: data,
      chainId: 1,
      address: '0xca11bde05977b3631167028862be2a173976ca11',
    })

    expect(args?.bytes).toEqual(SUPER_PERMISSIONED_ARGS)
    expect(args?.members?.map((member) => member.name)).toEqual([
      'anchorStateRegistry',
      'proposer',
    ])
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

describe('multiSend plugin', () => {
  it('marks delegatecalled entries', () => {
    const target = '1111111111111111111111111111111111111111'
    const entry = (operation: string) =>
      `${operation}${target}${'00'.repeat(32)}${(4).toString(16).padStart(64, '0')}12345678`
    const transactions = `0x${entry('00')}${entry('01')}` as const
    const decoded = decode(
      encodeFunctionData({
        abi: parseAbi(['function multiSend(bytes transactions)']),
        functionName: 'multiSend',
        args: [transactions],
      }),
      [],
      1,
    )
    expect(
      decoded?.members?.map(
        (entry) => entry.members?.find((x) => x.name === 'data')?.delegatecall,
      ),
    ).toEqual([undefined, true])
  })
})
