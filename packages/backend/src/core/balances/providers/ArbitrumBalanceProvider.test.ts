import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber } from 'ethers'

import { ArbitrumMulticallClient } from '../../../peripherals/arbitrum/multicall/ArbitrumMulticall'
import { EthereumClient } from '../../../peripherals/ethereum/EthereumClient'
import { ArbitrumBalanceProvider } from './ArbitrumBalanceProvider'

describe(ArbitrumBalanceProvider.name, () => {
  describe(ArbitrumBalanceProvider.prototype.fetchBalances.name, () => {
    describe('if multicall can be used', () => {
      it('performs a multicall balance queries', async () => {
        const multicallAddress = EthereumAddress.random()
        const blockNumber = 1234

        const arbitrumClient = mockObject<EthereumClient>({
          getBalance: async () => BigNumber.from(420),
          call: async () => Bytes.fromNumber(69).padStart(32),
        })

        const multicallClient = mockObject<ArbitrumMulticallClient>({
          getChainId: () => ChainId.ARBITRUM,
          canBeUsed: () => true,
          multicall: async () => [
            { success: true, data: Bytes.fromNumber(69).padStart(32) },
            { success: true, data: Bytes.fromNumber(420).padStart(32) },
          ],
          getAddress: () => multicallAddress,
        })

        const ethereumBalanceProvider = new ArbitrumBalanceProvider(
          arbitrumClient,
          multicallClient,
        )

        const timestamp = UnixTime.now()
        const holderA = EthereumAddress.random()
        const holderB = EthereumAddress.random()
        const results = await ethereumBalanceProvider.fetchBalances(
          [
            { assetId: AssetId.DAI, holder: holderA },
            { assetId: AssetId.ETH, holder: holderB },
          ],
          timestamp,
          blockNumber,
        )

        expect(multicallClient.canBeUsed).toHaveBeenCalledTimes(1)
        expect(multicallClient.multicall).toHaveBeenCalledTimes(1)
        expect(arbitrumClient.call).not.toHaveBeenCalled()

        expect(results).toEqual([
          {
            assetId: AssetId.DAI,
            holderAddress: holderA,
            balance: 69n,
            timestamp,
            chainId: ChainId.ARBITRUM,
          },
          {
            assetId: AssetId.ETH,
            holderAddress: holderB,
            balance: 420n,
            timestamp,
            chainId: ChainId.ARBITRUM,
          },
        ])
      })
    })

    describe('if multicall cannot be used', () => {
      it('performs a plain calls balance queries', async () => {
        const multicallAddress = EthereumAddress.random()
        const blockNumber = 1234

        const arbitrumClient = mockObject<EthereumClient>({
          getBalance: async () => BigNumber.from(420),
          call: async () => Bytes.fromNumber(69).padStart(32),
        })

        const multicallClient = mockObject<ArbitrumMulticallClient>({
          getChainId: () => ChainId.ARBITRUM,
          canBeUsed: () => false,
          multicall: async () => [
            { success: true, data: Bytes.fromNumber(69).padStart(32) },
            { success: true, data: Bytes.fromNumber(420).padStart(32) },
          ],
          getAddress: () => multicallAddress,
        })

        const ethereumBalanceProvider = new ArbitrumBalanceProvider(
          arbitrumClient,
          multicallClient,
        )

        const timestamp = UnixTime.now()
        const holderA = EthereumAddress.random()
        const holderB = EthereumAddress.random()
        const results = await ethereumBalanceProvider.fetchBalances(
          [
            { assetId: AssetId.DAI, holder: holderA },
            { assetId: AssetId.ETH, holder: holderB },
          ],
          timestamp,
          blockNumber,
        )

        expect(multicallClient.canBeUsed).toHaveBeenCalledTimes(1)
        expect(multicallClient.multicall).not.toHaveBeenCalled()
        expect(arbitrumClient.call).toHaveBeenCalledTimes(1) // For ERC20 balanceOf call
        expect(arbitrumClient.getBalance).toHaveBeenCalledTimes(1) // For ETH coin

        expect(results).toEqual([
          {
            assetId: AssetId.DAI,
            holderAddress: holderA,
            balance: 69n,
            timestamp,
            chainId: ChainId.ARBITRUM,
          },
          {
            assetId: AssetId.ETH,
            holderAddress: holderB,
            balance: 420n,
            timestamp,
            chainId: ChainId.ARBITRUM,
          },
        ])
      })
    })
  })
})
