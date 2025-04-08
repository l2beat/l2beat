import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { RpcClient } from '../../clients'
import {
  type MulticallV3Client,
  multicallInterface,
} from '../../clients/rpc/multicall/MulticallV3Client'
import { BalanceProvider, encodeErc20Balance } from './BalanceProvider'

describe(BalanceProvider.name, () => {
  describe(BalanceProvider.prototype.getBalances.name, () => {
    it('uses multicall if possible', async () => {
      const queries = [
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

      const blockNumber = 100
      const chain = 'ethereum'

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
        multicall: async () => [
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
        ],
        chain: chain,
      })

      const balanceProvider = new BalanceProvider([
        rpc,
        mockObject<RpcClient>({ chain: 'random' }),
      ])

      const result = await balanceProvider.getBalances(
        queries,
        blockNumber,
        chain,
      )

      expect(multicallClient.encodeGetEthBalance).toHaveBeenOnlyCalledWith(
        queries[0].holder,
      )
      expect(rpc.multicall).toHaveBeenOnlyCalledWith(
        [
          multicallClient.encodeGetEthBalance(queries[0].holder),
          encodeErc20Balance(
            queries[1].token as EthereumAddress,
            queries[1].holder,
          ),
          encodeErc20Balance(
            queries[2].token as EthereumAddress,
            queries[2].holder,
          ),
        ],
        blockNumber,
      )
      expect(result).toEqual([123_456n, 654_321n, 0n])
    })
  })
})
