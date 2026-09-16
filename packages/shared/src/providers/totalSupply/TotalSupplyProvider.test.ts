import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { RpcClient } from '../../clients'
import { encodeTotalSupply, TotalSupplyProvider } from './TotalSupplyProvider'

describe(TotalSupplyProvider.name, () => {
  const BLOCK = 100
  const CHAIN = 'ethereum'
  const TOKENS = [
    EthereumAddress.random(),
    EthereumAddress.random(),
    EthereumAddress.random(),
  ]

  describe(TotalSupplyProvider.prototype.getTotalSupplies.name, () => {
    it('uses multicall if possible', async () => {
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockResolvedValueOnce([
          {
            success: true,
            data: Bytes.fromNumber(123_456),
          },
          {
            success: true,
            data: Bytes.fromNumber(654_321),
          },
          {
            success: true,
            data: Bytes.fromHex('0x'),
          },
        ]),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [rpc, mockObject<RpcClient>({ chain: 'random' })],
        Logger.SILENT,
      )

      const result = await totalSupplyProvider.getTotalSupplies(
        TOKENS,
        BLOCK,
        CHAIN,
      )

      expect(rpc.multicall).toHaveBeenCalledExactlyOnceWith(
        [
          encodeTotalSupply(TOKENS[0]),
          encodeTotalSupply(TOKENS[1]),
          encodeTotalSupply(TOKENS[2]),
        ],
        BLOCK,
      )
      expect(result).toStrictEqual([123_456n, 654_321n, 0n])
    })

    it('performs single calls if multicall not deployed', async () => {
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => false,
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(123_456))
          .mockResolvedValueOnce(Bytes.fromNumber(654_321))
          .mockResolvedValueOnce(Bytes.fromHex('0x')),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [rpc, mockObject<RpcClient>({ chain: 'random' })],
        Logger.SILENT,
      )

      const result = await totalSupplyProvider.getTotalSupplies(
        TOKENS,
        BLOCK,
        CHAIN,
      )

      expect(rpc.call).toHaveBeenNthCalledWith(
        1,
        encodeTotalSupply(TOKENS[0]),
        BLOCK,
      )
      expect(rpc.call).toHaveBeenNthCalledWith(
        2,
        encodeTotalSupply(TOKENS[1]),
        BLOCK,
      )
      expect(rpc.call).toHaveBeenNthCalledWith(
        3,
        encodeTotalSupply(TOKENS[2]),
        BLOCK,
      )
      expect(result).toStrictEqual([123_456n, 654_321n, 0n])
    })

    it('throws when a totalSupply call reverts', async () => {
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockResolvedValueOnce([
          { success: true, data: Bytes.fromNumber(123_456) },
          { success: false, data: Bytes.fromHex('0x') },
          { success: true, data: Bytes.fromNumber(654_321) },
        ]),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider([rpc], Logger.SILENT)

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).rejects.toThrow('Failed to fetch totalSupply')
    })

    it('tries next RPC client if a single call fails', async () => {
      const failingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => false,
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(123_456))
          .mockRejectedValueOnce(new Error('RPC failure')),
        chain: CHAIN,
      })

      const workingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => false,
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(123))
          .mockResolvedValueOnce(Bytes.fromNumber(456))
          .mockResolvedValueOnce(Bytes.fromNumber(789)),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [failingRpc, workingRpc],
        Logger.SILENT,
      )

      const result = await totalSupplyProvider.getTotalSupplies(
        TOKENS,
        BLOCK,
        CHAIN,
      )

      expect(result).toStrictEqual([123n, 456n, 789n])
    })

    it('tries next RPC client if first one fails', async () => {
      const failingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockRejectedValueOnce(new Error('Connection error')),
        chain: CHAIN,
      })

      const workingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockResolvedValueOnce([
          {
            success: true,
            data: Bytes.fromNumber(123_456),
          },
          {
            success: true,
            data: Bytes.fromNumber(654_321),
          },
          {
            success: true,
            data: Bytes.fromNumber(789_012),
          },
        ]),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [failingRpc, workingRpc],
        Logger.SILENT,
      )

      const result = await totalSupplyProvider.getTotalSupplies(
        TOKENS,
        BLOCK,
        CHAIN,
      )

      expect(failingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(workingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([123_456n, 654_321n, 789_012n])
    })

    it('throws error if all RPC clients fail', async () => {
      const error = new Error('All RPCs failed')
      const rpc1 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockRejectedValueOnce(error),
        chain: CHAIN,
      })
      const rpc2 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: vi.fn().mockRejectedValueOnce(error),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [rpc1, rpc2],
        Logger.SILENT,
      )

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).rejects.toThrow()
    })

    it('throws error if no RPC client for chain', async () => {
      const totalSupplyProvider = new TotalSupplyProvider(
        [mockObject<RpcClient>({ chain: 'other-chain' })],
        Logger.SILENT,
      )

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).rejects.toThrow(`Missing RpcClient for ${CHAIN}`)
    })
  })
})
