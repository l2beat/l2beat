import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { RpcClient } from '../../clients'
import {
  type MulticallV3Client,
  multicallInterface,
} from '../../clients/rpc/multicall/MulticallV3Client'
import { BalanceProvider, encodeErc20Balance } from './BalanceProvider'

describe(BalanceProvider.name, () => {
  const BLOCK = 100
  const CHAIN = 'ethereum'
  const QUERIES = [
    {
      token: 'native' as const,
      holder: EthereumAddress.random(),
    },
    {
      token: EthereumAddress.random(),
      holder: EthereumAddress.random(),
    },
    {
      token: EthereumAddress.random(),
      holder: EthereumAddress.random(),
    },
  ]

  describe(BalanceProvider.prototype.getBalances.name, () => {
    it('uses multicall if possible', async () => {
      const multicallClient = {
        encodeGetEthBalance: vi.fn((holder: EthereumAddress) => ({
          to: EthereumAddress.ZERO,
          input: Bytes.fromHex(
            multicallInterface.encodeFunctionData('getEthBalance', [holder]),
          ),
        })),
      } as unknown as MulticallV3Client
      const rpc = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: multicallClient,
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
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider(
        [rpc, { chain: 'random' } as unknown as RpcClient], // test rpcs filtering
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(
        multicallClient.encodeGetEthBalance,
      ).toHaveBeenCalledExactlyOnceWith(QUERIES[0].holder)
      expect(rpc.multicall).toHaveBeenCalledExactlyOnceWith(
        [
          multicallClient.encodeGetEthBalance(QUERIES[0].holder),
          encodeErc20Balance(
            QUERIES[1].token as EthereumAddress,
            QUERIES[1].holder,
          ),
          encodeErc20Balance(
            QUERIES[2].token as EthereumAddress,
            QUERIES[2].holder,
          ),
        ],
        BLOCK,
      )
      expect(result).toStrictEqual([123_456n, 654_321n, 0n])
    })

    it('performs single calls if multicall not deployed', async () => {
      const rpc = {
        isMulticallDeployed: vi.fn(() => false),
        getBalance: vi.fn().mockResolvedValueOnce(Bytes.fromNumber(123_456)),
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(654_321))
          .mockResolvedValueOnce(Bytes.fromHex('0x')),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider(
        [rpc, { chain: 'random' } as unknown as RpcClient], // test rpcs filtering
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(rpc.getBalance).toHaveBeenCalledExactlyOnceWith(
        QUERIES[0].holder,
        BLOCK,
      )
      expect(rpc.call).toHaveBeenCalledTimes(2)
      expect(rpc.call).toHaveBeenNthCalledWith(
        1,
        encodeErc20Balance(
          QUERIES[1].token as EthereumAddress,
          QUERIES[1].holder,
        ),
        BLOCK,
      )
      expect(rpc.call).toHaveBeenNthCalledWith(
        2,
        encodeErc20Balance(
          QUERIES[2].token as EthereumAddress,
          QUERIES[2].holder,
        ),
        BLOCK,
      )
      expect(result).toStrictEqual([123_456n, 654_321n, 0n])
    })

    it('throws when multicall returns empty data for a native balance', async () => {
      const multicallClient = {
        encodeGetEthBalance: vi.fn(() => ({
          to: EthereumAddress.ZERO,
          input: Bytes.fromHex('0x'),
        })),
      } as unknown as MulticallV3Client
      const rpc = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: multicallClient,
        multicall: vi.fn().mockResolvedValueOnce([
          { success: true, data: Bytes.fromHex('0x') },
          { success: true, data: Bytes.fromNumber(654_321) },
          { success: true, data: Bytes.fromNumber(123_456) },
        ]),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider([rpc], Logger.SILENT)

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).rejects.toThrow('Failed to fetch balance')
    })

    it('throws when an ERC20 balance call reverts', async () => {
      const multicallClient = {
        encodeGetEthBalance: vi.fn(() => ({
          to: EthereumAddress.ZERO,
          input: Bytes.fromHex('0x'),
        })),
      } as unknown as MulticallV3Client
      const rpc = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: multicallClient,
        multicall: vi.fn().mockResolvedValueOnce([
          { success: true, data: Bytes.fromNumber(123_456) },
          { success: false, data: Bytes.fromHex('0x') },
          { success: true, data: Bytes.fromNumber(654_321) },
        ]),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider([rpc], Logger.SILENT)

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).rejects.toThrow('Failed to fetch balance')
    })

    it('tries next RPC client if a single call fails', async () => {
      const failingRpc = {
        isMulticallDeployed: vi.fn(() => false),
        getBalance: vi.fn().mockRejectedValueOnce(new Error('RPC failure')),
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(654_321))
          .mockResolvedValueOnce(Bytes.fromNumber(123_456)),
        chain: CHAIN,
      } as unknown as RpcClient

      const workingRpc = {
        isMulticallDeployed: vi.fn(() => false),
        getBalance: vi.fn().mockResolvedValueOnce(Bytes.fromNumber(123)),
        call: vi
          .fn()
          .mockResolvedValueOnce(Bytes.fromNumber(456))
          .mockResolvedValueOnce(Bytes.fromNumber(789)),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider(
        [failingRpc, workingRpc],
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(result).toStrictEqual([123n, 456n, 789n])
    })

    it('tries next RPC client if first one fails', async () => {
      const failingRpc = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: {
          encodeGetEthBalance: vi.fn(() => ({
            to: EthereumAddress.ZERO,
            input: Bytes.fromHex('0x'),
          })),
        } as unknown as MulticallV3Client,
        multicall: vi.fn().mockRejectedValueOnce(new Error('RPC failure')),
        chain: CHAIN,
      } as unknown as RpcClient

      const workingRpc = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: {
          encodeGetEthBalance: vi.fn((holder: EthereumAddress) => ({
            to: EthereumAddress.ZERO,
            input: Bytes.fromHex(
              multicallInterface.encodeFunctionData('getEthBalance', [holder]),
            ),
          })),
        } as unknown as MulticallV3Client,
        multicall: vi.fn().mockResolvedValueOnce([
          { success: true, data: Bytes.fromNumber(123) },
          { success: true, data: Bytes.fromNumber(456) },
          { success: true, data: Bytes.fromNumber(789) },
        ]),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider(
        [failingRpc, workingRpc],
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(failingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(workingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(result).toStrictEqual([123n, 456n, 789n])
    })

    it('throws error if all RPC clients fail', async () => {
      const error = new Error('RPC failure')
      const failingRpc1 = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: {
          encodeGetEthBalance: vi.fn(() => ({
            to: EthereumAddress.ZERO,
            input: Bytes.fromHex('0x'),
          })),
        } as unknown as MulticallV3Client,
        multicall: vi.fn().mockRejectedValueOnce(error),
        chain: CHAIN,
      } as unknown as RpcClient

      const failingRpc2 = {
        isMulticallDeployed: vi.fn(() => true),
        multicallClient: {
          encodeGetEthBalance: vi.fn(() => ({
            to: EthereumAddress.ZERO,
            input: Bytes.fromHex('0x'),
          })),
        } as unknown as MulticallV3Client,
        multicall: vi.fn().mockRejectedValueOnce(error),
        chain: CHAIN,
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider(
        [failingRpc1, failingRpc2],
        Logger.SILENT,
      )

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).rejects.toThrow()

      expect(failingRpc1.multicall).toHaveBeenCalledTimes(1)
      expect(failingRpc2.multicall).toHaveBeenCalledTimes(1)
    })

    it('throws error if no RPC client for chain', async () => {
      const rpc = {
        chain: 'other-chain',
      } as unknown as RpcClient

      const balanceProvider = new BalanceProvider([rpc], Logger.SILENT)

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).rejects.toThrow(`Missing RpcClient for ${CHAIN}`)
    })
  })
})
