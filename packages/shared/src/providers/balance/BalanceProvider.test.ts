import { Logger } from '@l2beat/backend-tools'
import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
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
      const multicallClient = mockObject<MulticallV3Client>({
        encodeGetEthBalance: (holder: EthereumAddress) => ({
          to: EthereumAddress.ZERO,
          data: Bytes.fromHex(
            multicallInterface.encodeFunctionData('getEthBalance', [holder]),
          ),
        }),
      })
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicallClient: multicallClient,
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

      const balanceProvider = new BalanceProvider(
        [rpc, mockObject<RpcClient>({ chain: 'random' })], // test rpcs filtering
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(multicallClient.encodeGetEthBalance).toHaveBeenOnlyCalledWith(
        QUERIES[0].holder,
      )
      expect(rpc.multicall).toHaveBeenOnlyCalledWith(
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
      expect(result).toEqual([123_456n, 654_321n, 0n])
    })

    it('performs single calls if multicall not deployed', async () => {
      const rpc = mockObject<RpcClient>({
        isMulticallDeployed: () => false,
        getBalance: mockFn().resolvesToOnce(Bytes.fromNumber(123_456)),
        call: mockFn()
          .resolvesToOnce(Bytes.fromNumber(654_321))
          .rejectsWithOnce('error'),
        chain: CHAIN,
      })

      const balanceProvider = new BalanceProvider(
        [rpc, mockObject<RpcClient>({ chain: 'random' })], // test rpcs filtering
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(rpc.getBalance).toHaveBeenOnlyCalledWith(QUERIES[0].holder, BLOCK)
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
      expect(result).toEqual([123_456n, 654_321n, 0n])
    })

    it('tries next RPC client if first one fails', async () => {
      const failingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicallClient: mockObject<MulticallV3Client>({
          encodeGetEthBalance: () => ({
            to: EthereumAddress.ZERO,
            data: Bytes.fromHex('0x'),
          }),
        }),
        multicall: mockFn().rejectsWithOnce(new Error('RPC failure')),
        chain: CHAIN,
      })

      const workingRpc = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicallClient: mockObject<MulticallV3Client>({
          encodeGetEthBalance: (holder: EthereumAddress) => ({
            to: EthereumAddress.ZERO,
            data: Bytes.fromHex(
              multicallInterface.encodeFunctionData('getEthBalance', [holder]),
            ),
          }),
        }),
        multicall: mockFn().resolvesToOnce([
          { success: true, data: Bytes.fromNumber(123) },
          { success: true, data: Bytes.fromNumber(456) },
          { success: true, data: Bytes.fromNumber(789) },
        ]),
        chain: CHAIN,
      })

      const balanceProvider = new BalanceProvider(
        [failingRpc, workingRpc],
        Logger.SILENT,
      )

      const result = await balanceProvider.getBalances(QUERIES, BLOCK, CHAIN)

      expect(failingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(workingRpc.multicall).toHaveBeenCalledTimes(1)
      expect(result).toEqual([123n, 456n, 789n])
    })

    it('throws error if all RPC clients fail', async () => {
      const error = new Error('RPC failure')
      const failingRpc1 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicallClient: mockObject<MulticallV3Client>({
          encodeGetEthBalance: () => ({
            to: EthereumAddress.ZERO,
            data: Bytes.fromHex('0x'),
          }),
        }),
        multicall: mockFn().rejectsWithOnce(error),
        chain: CHAIN,
      })

      const failingRpc2 = mockObject<RpcClient>({
        isMulticallDeployed: () => true,
        multicallClient: mockObject<MulticallV3Client>({
          encodeGetEthBalance: () => ({
            to: EthereumAddress.ZERO,
            data: Bytes.fromHex('0x'),
          }),
        }),
        multicall: mockFn().rejectsWithOnce(error),
        chain: CHAIN,
      })

      const balanceProvider = new BalanceProvider(
        [failingRpc1, failingRpc2],
        Logger.SILENT,
      )

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).toBeRejected()

      expect(failingRpc1.multicall).toHaveBeenCalledTimes(1)
      expect(failingRpc2.multicall).toHaveBeenCalledTimes(1)
    })

    it('throws error if no RPC client for chain', async () => {
      const rpc = mockObject<RpcClient>({
        chain: 'other-chain',
      })

      const balanceProvider = new BalanceProvider([rpc], Logger.SILENT)

      await expect(
        balanceProvider.getBalances(QUERIES, BLOCK, CHAIN),
      ).toBeRejectedWith(`Missing RpcClient for ${CHAIN}`)
    })
  })
})
