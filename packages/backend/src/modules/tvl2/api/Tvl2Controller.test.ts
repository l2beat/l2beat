import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { ChildIndexer } from '@l2beat/uif'
import { expect, mockFn, mockObject } from 'earl'

import { Tvl2Config } from '../../../config/Config'
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
        sinceTimestamp: new UnixTime(100),
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
        [mockObject<ChildIndexer>({ safeHeight: 1000 })],
        [amountConfig.project],
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

  const projectId = ProjectId('test-project')

  const amountConfig = mockObject<AmountConfigEntry>({
    project: projectId,
    type: 'totalSupply',
    address: EthereumAddress.random(),
    chain: 'ethereum',
    sinceTimestamp: new UnixTime(100),
  })
  const priceConfig = mockObject<PriceConfigEntry>({
    chain: amountConfig.chain,
    address: amountConfig.address,
    decimals: 6,
  })

  describe(Tvl2Controller.prototype.getTvlAt.name, () => {
    describe('calls getProjectTvl with the correct timestamp', () => {
      it('when the timestamp is before the configuration since timestamp', async () => {
        const timestamp = new UnixTime(50)

        const controller = new Tvl2Controller(
          mockObject<AmountRepository>(),
          mockObject<PriceRepository>(),
          [mockObject<ChildIndexer>({ safeHeight: 1000 })],
          [projectId],
          mockObject<Tvl2Config>({
            amounts: [amountConfig],
            prices: [priceConfig],
          }),
        )
        const mockGetProjectTvl = mockFn(controller.getProjectTvl)
        controller.getProjectTvl = mockGetProjectTvl

        await controller.getTvlAt(timestamp)
        expect(mockGetProjectTvl).not.toHaveBeenCalled()
      })

      it('when the timestamp is after the configuration since timestamp', async () => {
        const timestamp = new UnixTime(150)

        const controller = new Tvl2Controller(
          mockObject<AmountRepository>(),
          mockObject<PriceRepository>(),
          [mockObject<ChildIndexer>({ safeHeight: 1000 })],
          [projectId],
          mockObject<Tvl2Config>({
            amounts: [amountConfig],
            prices: [priceConfig],
          }),
        )
        const mockGetProjectTvl = mockFn(
          async (_: ProjectId, __: UnixTime) => ({
            canonical: 0,
            external: 0,
            native: 0,
          }),
        )
        controller.getProjectTvl = mockGetProjectTvl

        await controller.getTvlAt(timestamp)
        expect(mockGetProjectTvl).toHaveBeenOnlyCalledWith(projectId, timestamp)
      })
    })
  })

  describe(Tvl2Controller.prototype.getTvl.name, () => {
    it('calls getTvlAt for each full day', async () => {
      const start = amountConfig.sinceTimestamp.toEndOf('day')
      const end = start.add(3, 'days')

      const controller = new Tvl2Controller(
        mockObject<AmountRepository>(),
        mockObject<PriceRepository>(),
        [mockObject<ChildIndexer>({ safeHeight: end.toNumber() })],
        [projectId],
        mockObject<Tvl2Config>({
          amounts: [amountConfig],
          prices: [priceConfig],
        }),
      )
      const mockGetTvlAt = mockFn(async (_: UnixTime) => ({
        timestamp: _.toNumber(),
        projects: {},
      }))
      controller.getTvlAt = mockGetTvlAt

      const result = await controller.getTvl()

      expect(mockGetTvlAt).toHaveBeenCalledTimes(4)
      expect(mockGetTvlAt).toHaveBeenNthCalledWith(1, start)
      expect(mockGetTvlAt).toHaveBeenNthCalledWith(2, start.add(1, 'days'))
      expect(mockGetTvlAt).toHaveBeenNthCalledWith(3, start.add(2, 'days'))
      expect(mockGetTvlAt).toHaveBeenNthCalledWith(4, start.add(3, 'days'))

      expect(result).toEqual({
        daily: [
          { timestamp: start.toNumber(), projects: {} },
          { timestamp: start.add(1, 'days').toNumber(), projects: {} },
          { timestamp: start.add(2, 'days').toNumber(), projects: {} },
          { timestamp: start.add(3, 'days').toNumber(), projects: {} },
        ],
      })
    })
  })
})
