import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { MulticallClient } from '../../../peripherals/ethereum/MulticallClient'
import { EthereumBalanceProvider } from './EthereumBalanceProvider'

describe(EthereumBalanceProvider.name, () => {
  describe(EthereumBalanceProvider.prototype.fetchBalances.name, () => {
    it('performs a multicall for missing data', async () => {
      const blockNumber = 1234
      const multicallClient = mockObject<MulticallClient>({
        multicall: async () => [
          { success: true, data: Bytes.fromNumber(69).padStart(32) },
          { success: true, data: Bytes.fromNumber(420).padStart(32) },
        ],
      })

      const ethereumBalanceProvider = new EthereumBalanceProvider(
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
      expect(results).toEqual([
        {
          assetId: AssetId.DAI,
          holderAddress: holderA,
          balance: 69n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
        {
          assetId: AssetId.ETH,
          holderAddress: holderB,
          balance: 420n,
          timestamp,
          chainId: ChainId.ETHEREUM,
        },
      ])
    })
  })
})
