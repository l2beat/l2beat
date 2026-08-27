import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { BlockClient, RpcClient } from '../../clients'
import { BlockProvider } from './BlockProvider'

describe(BlockProvider.name, () => {
  describe(BlockProvider.prototype.getBlockWithTransactions.name, () => {
    it('returns block', async () => {
      const rpc = mockObject<RpcClient>({
        getBlockWithTransactions: async () => block(1),
      })
      const provider = new BlockProvider('chain', [rpc])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(result).toEqual(block(1))
    })

    it('calls other client when there are errors', async () => {
      const rpc_one = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getBlockWithTransactions: async () => block(1),
      })

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      const result = await provider.getBlockWithTransactions(1)

      expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)

      expect(result).toEqual(block(1))
    })

    it('throws when ran out of fallbacks', async () => {
      const rpc_one = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_two = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error()),
      })
      const rpc_three = mockObject<RpcClient>({
        getBlockWithTransactions: mockFn().rejectsWith(new Error('ERROR')),
      })

      const provider = new BlockProvider('chain', [rpc_one, rpc_two, rpc_three])

      await expect(() => provider.getBlockWithTransactions(1)).toBeRejectedWith(
        'ERROR',
      )

      expect(rpc_one.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_two.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
      expect(rpc_three.getBlockWithTransactions).toHaveBeenOnlyCalledWith(1)
    })
  })

  describe(BlockProvider.prototype.getBlockHeader.name, () => {
    it('returns header from client', async () => {
      const client = mockObject<BlockClient>({
        getBlockHeader: async (x) => header(x === 'latest' ? 1000 : x),
      })
      const provider = new BlockProvider('chain', [client])

      expect(await provider.getBlockHeader(5)).toEqual(header(5))
      expect(await provider.getBlockHeader('latest')).toEqual(header(1000))
    })

    it('rejects a header of a different block', async () => {
      const client = mockObject<BlockClient>({
        getBlockHeader: async () => header(7),
      })
      const provider = new BlockProvider('chain', [client])

      await expect(provider.getBlockHeader(5)).toBeRejectedWith(
        'expected block number 5, got 7',
      )
    })
  })

  describe(BlockProvider.prototype.getBlockNumberAtOrBefore.name, () => {
    it('finds the closest block number to given timestamp', async () => {
      const getBlockHeader = mockFn(async (x: number | 'latest') =>
        header(x === 'latest' ? 1000 : x),
      )
      const client = mockObject<BlockClient>({ getBlockHeader })
      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(getBlockHeader).toHaveBeenCalledWith('latest')
      // the latest header is reused as the upper bound, not fetched again
      expect(getBlockHeader.calls.map((c) => c.args[0])).not.toInclude(1000)
    })

    it('returns the latest block when timestamp is not earlier', async () => {
      const getBlockHeader = mockFn(async (x: number | 'latest') =>
        header(x === 'latest' ? 1000 : x),
      )
      const client = mockObject<BlockClient>({ getBlockHeader })
      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(1000 * 100 + 5),
      )

      expect(blockNumber).toEqual(1000)
      expect(getBlockHeader).toHaveBeenOnlyCalledWith('latest')
    })

    it('respects the start lower bound', async () => {
      const requested: (number | 'latest')[] = []
      const client = mockObject<BlockClient>({
        getBlockHeader: async (x) => {
          requested.push(x)
          return header(x === 'latest' ? 1000 : x)
        },
      })
      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
        700,
      )

      expect(blockNumber).toEqual(800)
      const numbers = requested.filter(
        (x): x is number => typeof x === 'number',
      )
      expect(Math.min(...numbers)).toBeGreaterThanOrEqual(700)
    })

    it('ignores a start above the latest block', async () => {
      const client = mockObject<BlockClient>({
        getBlockHeader: async (x) => header(x === 'latest' ? 1000 : x),
      })
      const provider = new BlockProvider('chain', [client])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
        1500,
      )

      expect(blockNumber).toEqual(800)
    })

    it('reuses known headers to shrink a later, nearby search', async () => {
      const getBlockHeader = mockFn(async (x: number | 'latest') =>
        header(x === 'latest' ? 1000 : x),
      )
      const client = mockObject<BlockClient>({ getBlockHeader })
      const provider = new BlockProvider('chain', [client])

      await provider.getBlockNumberAtOrBefore(UnixTime(500 * 100))
      const firstCalls = getBlockHeader.calls.length

      getBlockHeader.calls.length = 0
      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(505 * 100),
      )

      expect(blockNumber).toEqual(505)
      // latest + a handful of probes bracketed by cached headers, never block 1
      const numbers = getBlockHeader.calls
        .map((c) => c.args[0])
        .filter((x): x is number => typeof x === 'number')
      expect(Math.min(...numbers)).toBeGreaterThan(1)
      expect(getBlockHeader.calls.length).toBeLessThan(firstCalls)
    })

    it('does not cache headers within the reorg window of the tip', async () => {
      // 1s blocks, latest = 100_000
      const oneSecondBlocks = (x: number | 'latest') => {
        const number = x === 'latest' ? 100_000 : x
        return { number, hash: `0x${number}`, timestamp: number }
      }
      const getBlockHeader = mockFn(async (x: number | 'latest') =>
        oneSecondBlocks(x),
      )
      const client = mockObject<BlockClient>({ getBlockHeader })
      const provider = new BlockProvider('chain', [client])

      const requested = () => getBlockHeader.calls.map((c) => c.args[0])

      // ~10s behind the tip: the probe is too fresh to remember, so an
      // identical search fetches it again
      await provider.getBlockNumberAtOrBefore(UnixTime(99_990))
      expect(requested()).toInclude(99_990)
      getBlockHeader.calls.length = 0
      await provider.getBlockNumberAtOrBefore(UnixTime(99_990))
      expect(requested()).toInclude(99_990)

      // ~14h behind the tip: probes are remembered, the repeat needs only latest
      getBlockHeader.calls.length = 0
      await provider.getBlockNumberAtOrBefore(UnixTime(50_000))
      expect(requested()).toInclude(50_000)
      getBlockHeader.calls.length = 0
      await provider.getBlockNumberAtOrBefore(UnixTime(50_000))
      expect(requested()).toEqual(['latest'])
    })

    it('handles a sequence of non-consecutive timestamps', async () => {
      const client = mockObject<BlockClient>({
        getBlockHeader: async (x) => header(x === 'latest' ? 1000 : x),
      })
      const provider = new BlockProvider('chain', [client])

      for (const target of [800, 300, 600, 950, 100]) {
        expect(
          await provider.getBlockNumberAtOrBefore(UnixTime(target * 100)),
        ).toEqual(target)
      }
    })

    it('calls other client when there are errors', async () => {
      const failing = mockFn().rejectsWith(new Error('error'))
      const working = mockFn(async (x: number | 'latest') =>
        header(x === 'latest' ? 1000 : x),
      )
      const provider = new BlockProvider('chain', [
        mockObject<BlockClient>({ getBlockHeader: failing }),
        mockObject<BlockClient>({ getBlockHeader: working }),
      ])

      const blockNumber = await provider.getBlockNumberAtOrBefore(
        UnixTime(800 * 100),
      )

      expect(blockNumber).toEqual(800)
      expect(failing).toHaveBeenCalledTimes(1)
      expect(working).toHaveBeenCalledWith('latest')
    })

    it('throws error when run out of fallbacks', async () => {
      const failing = [1, 2, 3].map((i) =>
        mockFn().rejectsWith(new Error(i.toString())),
      )
      const provider = new BlockProvider(
        'chain',
        failing.map((getBlockHeader) =>
          mockObject<BlockClient>({ getBlockHeader }),
        ),
      )

      await expect(
        async () => await provider.getBlockNumberAtOrBefore(UnixTime(800)),
      ).toBeRejectedWith('3')

      for (const getBlockHeader of failing) {
        expect(getBlockHeader).toHaveBeenCalledTimes(1)
      }
    })

    it('evicts the oldest headers past the cap', async () => {
      const getBlockHeader = mockFn(async (x: number | 'latest') =>
        header(x === 'latest' ? 100_000 : x),
      )
      const client = mockObject<BlockClient>({ getBlockHeader })
      const provider = new BlockProvider('chain', [client], 8)

      for (let i = 1; i <= 40; i++) {
        await provider.getBlockNumberAtOrBefore(UnixTime(i * 1000 * 100))
      }

      // still correct after many evictions
      expect(
        await provider.getBlockNumberAtOrBefore(UnixTime(5000 * 100)),
      ).toEqual(5000)
    })
  })
})

function block(x: number) {
  return {
    number: x,
    transactions: [],
    hash: '0x' + x.toString(),
    logsBloom: `0x${'0'.repeat(512)}`,
    timestamp: x * 100,
  }
}

function header(x: number) {
  return {
    number: x,
    hash: '0x' + x.toString(),
    timestamp: x * 100,
  }
}
