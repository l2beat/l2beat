import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'
import type { ChainRecord } from '@l2beat/database'
import { expect } from 'earl'
import { numberToHex } from 'viem'
import { MissingRpcError } from './estimateValues'
import { ViemChainReader } from './ViemChainReader'

describe(ViemChainReader.name, () => {
  const call = {
    type: 'totalSupply',
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  } as const

  it('fails a chain without an RPC', async () => {
    const reader = new ViemChainReader([chain(null)])

    await expect(reader.read('base', [call], [])).toBeRejectedWith(
      MissingRpcError,
    )
  })

  it('fails an unreachable chain without exposing its RPC URL', async () => {
    const reader = new ViemChainReader([
      chain([{ type: 'rpc', url: 'http://127.0.0.1:1/secret-key' }]),
    ])

    const error = await reader.read('base', [call], []).catch((e: unknown) => e)

    expect(error).toBeA(Error)
    expect((error as Error).message).toEqual('RPC request failed')
  })

  it('reads calls again when their Multicall3 aggregate fails', async () => {
    const url = await rpcServer((request) => {
      if (request.method === 'eth_getCode') return { result: '0x60806040' }
      const to = (request.params?.[0] as { to: string }).to.toLowerCase()
      if (to === MULTICALL3) return { error: 'out of gas' }
      return { result: numberToHex(123n, { size: 32 }) }
    })
    const reader = new ViemChainReader([chain([{ type: 'rpc', url }])])
    const warnings: string[] = []

    expect(await reader.read('base', [call], warnings)).toEqual([123n])
    expect(warnings).toEqual([])
  })

  it('reports calls the RPC fails, not tokens without a contract', async () => {
    const noContract = '0x2222222222222222222222222222222222222222'
    const url = await rpcServer((request) => {
      if (request.method === 'eth_getCode') return { result: '0x' }
      const to = (request.params?.[0] as { to: string }).to.toLowerCase()
      if (to === noContract) return { result: '0x' }
      return { error: 'header not found' }
    })
    const reader = new ViemChainReader([chain([{ type: 'rpc', url }])])
    const warnings: string[] = []

    const results = await reader.read(
      'base',
      [call, { type: 'totalSupply', token: noContract }],
      warnings,
    )

    expect(results).toEqual([undefined, undefined])
    expect(warnings).toEqual(['Reading base: 1 of 2 calls failed'])
  })
})

const MULTICALL3 = '0xca11bde05977b3631167028862be2a173976ca11'

interface RpcRequest {
  id: number
  method: string
  params?: unknown[]
}

// A JSON-RPC endpoint on localhost that answers single and batched requests.
type RpcAnswer = { result: unknown } | { error: string }

async function rpcServer(answer: (request: RpcRequest) => RpcAnswer) {
  const respond = (request: RpcRequest) => {
    const answered = answer(request)
    return 'error' in answered
      ? {
          jsonrpc: '2.0',
          id: request.id,
          error: { code: -32000, message: answered.error },
        }
      : { jsonrpc: '2.0', id: request.id, result: answered.result }
  }
  const server = createServer(async (req, res) => {
    let body = ''
    for await (const chunk of req) body += chunk
    const parsed = JSON.parse(body) as RpcRequest | RpcRequest[]
    res.setHeader('content-type', 'application/json')
    res.end(
      JSON.stringify(
        Array.isArray(parsed) ? parsed.map(respond) : respond(parsed),
      ),
    )
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  after(() => server.close())
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}

function chain(apis: ChainRecord['apis']): ChainRecord {
  return { name: 'base', chainId: 8453, explorerUrl: null, aliases: null, apis }
}
