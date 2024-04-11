import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { Tvl2Config } from '../../../config/Config'
import { PriceIndexer } from '../PriceIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { Tvl2Controller } from './Tvl2Controller'

describe(Tvl2Controller.name, () => {
  describe(Tvl2Controller.prototype.getProjectTvl.name, () => {
    it('returns the tvl of the project at the given timestamp', async () => {
      const amountConfig = mockObject<AmountConfigEntry>({
        project: ProjectId('test-project'),
        type: 'totalSupply',
        address: EthereumAddress.random(),
        chain: 'ethereum',
        source: 'canonical',
      })

      const priceConfig = mockObject<PriceConfigEntry>({
        chain: amountConfig.chain,
        address: amountConfig.address,
        decimals: 6,
      })

      const controller = new Tvl2Controller(
        mockObject<AmountRepository>({
          getByConfigIdsAndTimestamp: async (configIds, timestamp) => [
            {
              configId: configIds[0],
              amount: 123_000_000n,
              timestamp,
            },
          ],
        }),
        mockObject<PriceRepository>({
          getByTimestamp: async (timestamp) => [
            {
              address: amountConfig.address,
              chain: amountConfig.chain,
              priceUsd: 2,
              timestamp,
            },
          ],
        }),
        mockObject<PriceIndexer>(),
        [],
        mockObject<Tvl2Config>({
          amounts: [amountConfig],
          prices: [priceConfig],
        }),
      )

      const result = await controller.getProjectTvl(
        ProjectId('test-project'),
        new UnixTime(123),
      )

      expect(result).toEqual({
        canonical: 246,
        external: 0,
        native: 0,
      })
    })
  })
})
