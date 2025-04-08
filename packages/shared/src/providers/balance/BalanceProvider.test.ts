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

      expect(result).toEqual([123_456n, 654_321n, 0n])
    })
  })
})
