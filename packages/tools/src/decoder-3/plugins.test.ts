import { expect } from 'earl'
import { describe } from 'mocha'
import { encodeFunctionData, parseAbi } from 'viem'
import { decode } from './plugins'

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
