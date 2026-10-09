import { expect } from 'earl'
import { BATCH_REJECTED, isBatchRejected, RpcBatcher } from './RpcBatcher'

describe(RpcBatcher.name, () => {
  // Methodology: an RPC that takes at most 2 calls per batch, 8 calls at the
  // default size; each rejection must halve the rejected size and send the
  // rejected calls again at it, with the results in the asked order
  it('halves a rejected batch until the RPC takes it', async () => {
    const rpc = new FakeRpc(2)

    const results = await rpc.run(new RpcBatcher(), CALLS)

    expect(results).toEqual(CALLS)
    expect(rpc.sent).toEqual([8, 4, 4, 2, 2, 2, 2])
  })

  // Methodology: an RPC that rejects every batch
  it('calls one by one once the size is down to 1', async () => {
    const rpc = new FakeRpc(1)

    const results = await rpc.run(new RpcBatcher(), CALLS.slice(0, 4))

    expect(results).toEqual(CALLS.slice(0, 4))
    expect(rpc.sent).toEqual([4, 2, 2, ...Array(4).fill('single')])
  })

  // Methodology: a clock moved by hand; the learned size must be used for the
  // next 5 minutes, after which the default is tried again
  it('keeps a learned size for 5 minutes', async () => {
    const rpc = new FakeRpc(2)
    let now = 0
    const batcher = new RpcBatcher({ now: () => now })

    await rpc.run(batcher, CALLS.slice(0, 4))
    now = 5 * 60_000 - 1
    await rpc.run(batcher, CALLS.slice(0, 4))
    now = 5 * 60_000
    await rpc.run(batcher, CALLS.slice(0, 4))

    expect(rpc.sent).toEqual([4, 2, 2, 2, 2, 4, 2, 2])
  })

  // Methodology: a configured size the RPC rejects; nothing may be sent one
  // by one or in smaller batches
  it('throws when the RPC rejects a batch of the configured size', async () => {
    const rpc = new FakeRpc(2)

    await expect(
      rpc.run(new RpcBatcher({ maxBatchSize: 4 }), CALLS.slice(0, 4)),
    ).toBeRejectedWith(
      'RPC rejected a batch of 4 eth_call calls, within the configured maxBatchSize of 4',
    )
    expect(rpc.sent).toEqual([4])
  })
})

describe(isBatchRejected.name, () => {
  // Methodology: responses as real RPCs send them for a batch over the limit
  const REJECTIONS: Record<string, [number, unknown]> = {
    'HTTP 413': [413, undefined],
    // Cloudflare, Flashbots
    'one error in place of the array': [
      200,
      rpcError('too many RPC calls in batch request'),
    ],
    'HTTP 400 with a batch error': [400, rpcError('batch too large')],
    // dRPC's free plan
    'every call fails with a batch error': [
      200,
      [
        rpcError('Batch of more than 3 requests are not allowed'),
        rpcError('Batch of more than 3 requests are not allowed'),
      ],
    ],
    // publicnode
    'an array of one batch error': [200, [rpcError('batch too large')]],
  }

  // Methodology: failures of the request or of single calls, which a retry
  // may fix or which belong to the caller
  const OTHER_FAILURES: Record<string, [number, unknown]> = {
    'HTTP 401': [401, undefined],
    'HTTP 403': [403, undefined],
    'HTTP 429': [429, rpcError('Rate limit exceeded')],
    'HTTP 503': [503, undefined],
    'a rate limit in place of the array': [200, rpcError('Rate limit hit')],
    'an internal error in place of the array': [
      200,
      rpcError('Internal error'),
    ],
    'one call failing with a batch message': [
      200,
      [{ id: 1, result: '0x1' }, rpcError('Batch not finalized')],
    ],
    'every call failing, one with a batch message': [
      200,
      [rpcError('Batch not finalized'), rpcError('header not found')],
    ],
    'every call failing for its own reason': [
      200,
      [rpcError('header not found'), rpcError('header not found')],
    ],
  }

  for (const [name, [status, body]] of Object.entries(REJECTIONS)) {
    it(`counts as a rejection: ${name}`, () => {
      expect(isBatchRejected(status, body)).toEqual(true)
    })
  }

  for (const [name, [status, body]] of Object.entries(OTHER_FAILURES)) {
    it(`does not count as a rejection: ${name}`, () => {
      expect(isBatchRejected(status, body)).toEqual(false)
    })
  }
})

const CALLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

/** Rejects batches above its limit, echoes the params of the calls it takes */
class FakeRpc {
  sent: (number | 'single')[] = []

  constructor(private readonly limit: number) {}

  run(batcher: RpcBatcher, calls: string[]) {
    return batcher.run(
      'eth_call',
      calls,
      async (chunk) => {
        this.sent.push(chunk.length)
        return chunk.length > this.limit ? BATCH_REJECTED : chunk
      },
      async (call) => {
        this.sent.push('single')
        return call
      },
    )
  }
}

function rpcError(message: string) {
  return { jsonrpc: '2.0', id: null, error: { code: -32600, message } }
}
