import {
  AssetId,
  Bytes,
  ChainId,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'
import { MulticallClient } from '../../peripherals/ethereum/MulticallClient'
import { BalanceProvider } from './BalanceProvider'

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

    it.skip('handles native assets with multicall')
    it.skip('handles native assets without multicall')
  })
})
