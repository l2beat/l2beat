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
