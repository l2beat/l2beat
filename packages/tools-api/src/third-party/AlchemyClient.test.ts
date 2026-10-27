import { expect, mockObject } from 'earl'
import { encodeAbiParameters } from 'viem'
import type { Chain } from '../config/types'
import { AlchemyClient } from './AlchemyClient'

describe('AlchemyClient.getSafeState', () => {
  const originalFetch = globalThis.fetch
  const address = '0xc2819dc788505aac350142a7a707bf9d03e3bd03'
  const chain = mockObject<Chain>({ alchemyId: 'eth-mainnet' })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('reads version and nonce at one pinned block without number precision loss', async () => {
    const calls: { to: string; block: string }[] = []
    globalThis.fetch = async (input, init) => {
      const body = (await new Request(input, init).json()) as
        | { id: number; method: 'eth_blockNumber' }
        | {
            id: number
            method: 'eth_call'
            params: [{ to: string; data: string }, string]
          }
      let result: string
      if (body.method === 'eth_blockNumber') {
        result = '0x7b'
      } else if (body.method === 'eth_call') {
        const [call, block] = body.params
        calls.push({ to: call.to, block })
        if (call.data === '0xaffed0e0') {
          result = encodeAbiParameters(
            [{ type: 'uint256' }],
            [9007199254740993n],
          )
        } else if (call.data === '0xffa1ad74') {
          result = encodeAbiParameters([{ type: 'string' }], ['1.3.0'])
        } else {
          throw new Error('Unexpected contract read')
        }
      } else {
        throw new Error('Unexpected RPC method')
      }
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', id: body.id, result }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }
    const result = await new AlchemyClient('test').getSafeState(address, chain)
    expect(result).toEqual({
      nonce: '9007199254740993',
      version: '1.3.0',
      blockNumber: '123',
    })
    expect(calls).toEqual([
      { to: address, block: '0x7b' },
      { to: address, block: '0x7b' },
    ])
  })
})

describe('AlchemyClient.getAccount', () => {
  const originalFetch = globalThis.fetch
  const address = '0x86b392ca30ad7453c8d88b56eb5a04fd0e2175b7'
  const chain = mockObject<Chain>({ alchemyId: 'eth-mainnet' })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  function mockRpc(code: string, nonce: string) {
    const methods: string[] = []
    globalThis.fetch = async (input, init) => {
      const body = (await new Request(input, init).json()) as {
        id: number
        method: string
      }
      methods.push(body.method)
      const result = body.method === 'eth_getCode' ? code : nonce
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', id: body.id, result }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }
    return methods
  }

  it('reads the nonce of an EOA', async () => {
    const methods = mockRpc('0x', '0x0')
    expect(await new AlchemyClient('test').getAccount(address, chain)).toEqual({
      kind: 'eoa',
      nonce: '0',
    })
    expect(methods).toEqual(['eth_getCode', 'eth_getTransactionCount'])
  })

  it('skips the nonce of a contract', async () => {
    const methods = mockRpc('0x6080604052', '0x1')
    expect(await new AlchemyClient('test').getAccount(address, chain)).toEqual({
      kind: 'contract',
    })
    expect(methods).toEqual(['eth_getCode'])
  })

  it('recognizes an EIP-7702 delegation', async () => {
    mockRpc('0xef010063c0c19a282a1b52b07dd5a65b58948a07dae32b', '0x4354')
    expect(await new AlchemyClient('test').getAccount(address, chain)).toEqual({
      kind: 'delegated',
      nonce: '17236',
      delegate: '0x63c0c19a282a1b52b07dd5a65b58948a07dae32b',
    })
  })
})

describe('AlchemyClient.readState', () => {
  const originalFetch = globalThis.fetch
  const address = '0x2f12d621a16e2d3285929c9996f478508951dfe4'
  const chain = mockObject<Chain>({ alchemyId: 'eth-mainnet' })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  function mockRpc(
    callResult: (data: string) => { result: string } | { error: object },
  ) {
    const blocks: string[] = []
    globalThis.fetch = async (input, init) => {
      const body = (await new Request(input, init).json()) as
        | { id: number; method: 'eth_blockNumber' }
        | {
            id: number
            method: 'eth_call'
            params: [{ data: string }, string]
          }
      const response =
        body.method === 'eth_blockNumber'
          ? { result: '0x7b' }
          : (blocks.push(body.params[1]), callResult(body.params[0].data))
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', id: body.id, ...response }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }
    return blocks
  }

  it('reads every call at one block and maps reverts to null', async () => {
    const impl = encodeAbiParameters(
      [{ type: 'address' }],
      ['0x5c3eb47cb0174aea522a2a9ae79487139a53d691'],
    )
    const blocks = mockRpc((data) =>
      data === '0x1b685b9e01'
        ? { result: impl }
        : { error: { code: 3, message: 'execution reverted', data: '0x' } },
    )
    const result = await new AlchemyClient('test').readState(
      address,
      ['0x1b685b9e01', '0x74cc86ac01'],
      chain,
    )
    expect(result).toEqual({ blockNumber: '123', results: [impl, null] })
    expect(blocks).toEqual(['0x7b', '0x7b'])
  })

  it('throws when the RPC fails for another reason', async () => {
    mockRpc(() => ({ error: { code: -32000, message: 'header not found' } }))
    await expect(
      new AlchemyClient('test').readState(address, ['0x1b685b9e01'], chain),
    ).toBeRejected()
  })
})
