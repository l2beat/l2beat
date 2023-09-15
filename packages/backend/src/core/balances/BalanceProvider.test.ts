import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { BigNumber } from 'ethers'

import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/multicall/MulticallClient'
import { BalanceProvider, ETHEREUM_BALANCE_ENCODING } from './BalanceProvider'

describe(BalanceProvider.name, () => {
  describe(BalanceProvider.prototype.fetchBalances.name, () => {
    it('performs a multicall for missing data', async () => {
      const multicallClient = mockObject<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(69).padStart(32) },
          { success: true, data: Bytes.fromNumber(420).padStart(32) },
        ],
      })

      const balanceProvider = new BalanceProvider(
        mockObject<EthereumClient>(),
        multicallClient,
        ChainId.ETHEREUM,
        undefined,
      )

      const timestamp = UnixTime.now()
      const holderA = EthereumAddress.random()
      const holderB = EthereumAddress.random()
      const results = await balanceProvider.fetchBalances(
        [
          { assetId: AssetId.DAI, holder: holderA },
          { assetId: AssetId.USDC, holder: holderB },
        ],
        timestamp,
        1234,
      )
      expect(results).toEqual([
        {
          assetId: AssetId.DAI,
          holderAddress: holderA,
          balance: 69n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.USDC,
          holderAddress: holderB,
          balance: 420n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('handles native assets with multicall', async () => {
      const multicallClient = mockObject<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(1).padStart(32) },
          { success: true, data: Bytes.fromNumber(2).padStart(32) },
          { success: true, data: Bytes.fromNumber(3).padStart(32) },
        ],
      })

      const ethereumClient = mockObject<EthereumClient>()

      const balanceProvider = new BalanceProvider(
        ethereumClient,
        multicallClient,
        ChainId.ETHEREUM,
        { ...ETHEREUM_BALANCE_ENCODING, sinceBlock: 0 },
      )

      const timestamp = UnixTime.now()
      const holder = EthereumAddress.random()
      const results = await balanceProvider.fetchBalances(
        [
          { assetId: AssetId.DAI, holder },
          { assetId: AssetId.ETH, holder },
          { assetId: AssetId.USDC, holder },
        ],
        timestamp,
        1234,
      )

      expect(results).toEqual([
        {
          assetId: AssetId.DAI,
          holderAddress: holder,
          balance: 1n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.ETH,
          holderAddress: holder,
          balance: 2n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.USDC,
          holderAddress: holder,
          balance: 3n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })

    it('handles native assets without multicall', async () => {
      const multicallClient = mockObject<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(1).padStart(32) },
          { success: true, data: Bytes.fromNumber(3).padStart(32) },
        ],
      })

      const ethereumClient = mockObject<EthereumClient>({
        getBalance: async () => BigNumber.from(2),
      })

      const balanceProvider = new BalanceProvider(
        ethereumClient,
        multicallClient,
        ChainId.ETHEREUM,
        undefined,
      )

      const timestamp = UnixTime.now()
      const holder = EthereumAddress.random()
      const results = await balanceProvider.fetchBalances(
        [
          { assetId: AssetId.DAI, holder },
          { assetId: AssetId.ETH, holder },
          { assetId: AssetId.USDC, holder },
        ],
        timestamp,
        1234,
      )

      expect(results).toEqual([
        {
          assetId: AssetId.DAI,
          holderAddress: holder,
          balance: 1n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.ETH,
          holderAddress: holder,
          balance: 2n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.USDC,
          holderAddress: holder,
          balance: 3n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })
  })
})
