import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
        multicall: mockFn().resolvesToOnce([
          {
            success: true,
            data: Bytes.fromNumber(123_456),
          },
          {
            success: true,
            data: Bytes.fromNumber(654_321),
          },
          {
            success: false,
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

      expect(rpc.multicall).toHaveBeenOnlyCalledWith(
        [
          encodeTotalSupply(TOKENS[0]),
          encodeTotalSupply(TOKENS[1]),
          encodeTotalSupply(TOKENS[2]),
        ],
        BLOCK,
      )
      expect(result).toEqual([123_456n, 654_321n, 0n])
    })

    it('performs single calls if multicall not deployed', async () => {
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => false,
        call: mockFn()
          .resolvesToOnce(Bytes.fromNumber(123_456))
          .resolvesToOnce(Bytes.fromNumber(654_321))
          .rejectsWithOnce('error'),
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
      expect(result).toEqual([123_456n, 654_321n, 0n])
    })

    it('tries next RPC client if first one fails', async () => {
      const failingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: mockFn().rejectsWithOnce(new Error('Connection error')),
        chain: CHAIN,
      })

      const workingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: mockFn().resolvesToOnce([
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
      expect(result).toEqual([123_456n, 654_321n, 789_012n])
    })

    it('throws error if all RPC clients fail', async () => {
      const error = new Error('All RPCs failed')
      const rpc1 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: mockFn().rejectsWithOnce(error),
        chain: CHAIN,
      })
      const rpc2 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicall: mockFn().rejectsWithOnce(error),
        chain: CHAIN,
      })

      const totalSupplyProvider = new TotalSupplyProvider(
        [rpc1, rpc2],
        Logger.SILENT,
      )

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).toBeRejected()
    })

    it('throws error if no RPC client for chain', async () => {
      const totalSupplyProvider = new TotalSupplyProvider(
        [mockObject<RpcClient>({ chain: 'other-chain' })],
        Logger.SILENT,
      )

      await expect(
        totalSupplyProvider.getTotalSupplies(TOKENS, BLOCK, CHAIN),
      ).toBeRejectedWith(`Missing RpcClient for ${CHAIN}`)
    })
  })
})
