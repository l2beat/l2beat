import { expect, mockObject } from 'earl'
import { encodeAbiParameters } from 'viem'
import type { Chain } from '../config/types'
import { ChainRpcClient } from './ChainRpcClient'
import { RpcBudget, RpcBudgetExceededError } from './RpcBudget'

describe('ChainRpcClient.getSafeState', () => {
  const originalFetch = globalThis.fetch
  const address = '0xc2819dc788505aac350142a7a707bf9d03e3bd03'
  const chain = mockObject<Chain>({ chainId: 1 })

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
    const result = await new ChainRpcClient(
      { 1: 'https://rpc.test' },
      new RpcBudget({ burst: 3, callsPerMinute: 3 }),
    ).getSafeState(address, chain)
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

describe('ChainRpcClient call budget', () => {
  const originalFetch = globalThis.fetch
  const address = '0xc2819dc788505aac350142a7a707bf9d03e3bd03'
  const chain = mockObject<Chain>({ chainId: 1 })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('stops calling the RPC once the budget is spent and resumes as it refills', async () => {
    let sent = 0
    globalThis.fetch = async (input, init) => {
      sent++
      const body = (await new Request(input, init).json()) as { id: number }
      return new Response(
        JSON.stringify({ jsonrpc: '2.0', id: body.id, result: '0x' }),
        { headers: { 'Content-Type': 'application/json' } },
      )
    }
    let now = 0
    const client = new ChainRpcClient(
      { 1: 'https://rpc.test' },
      new RpcBudget({ burst: 2, callsPerMinute: 60, now: () => now }),
    )

    await client.hasNoCode(address, chain)
    await client.hasNoCode(address, chain)
    await expect(client.hasNoCode(address, chain)).toBeRejectedWith(
      RpcBudgetExceededError,
    )
    await expect(client.getSafeState(address, chain)).toBeRejectedWith(
      RpcBudgetExceededError,
    )
    expect(sent).toEqual(2)

    now += 1_000
    await client.hasNoCode(address, chain)
    await expect(client.hasNoCode(address, chain)).toBeRejectedWith(
      RpcBudgetExceededError,
    )
    expect(sent).toEqual(3)

    // An hour of quiet refills no further than the burst.
    now += 3_600_000
    await client.hasNoCode(address, chain)
    await client.hasNoCode(address, chain)
    await expect(client.hasNoCode(address, chain)).toBeRejectedWith(
      RpcBudgetExceededError,
    )
    expect(sent).toEqual(5)
  })
})
