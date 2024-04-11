import {
  AmountConfigEntry,
  EthereumAddress,
  PriceConfigEntry,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { Tvl2Config } from '../../../config/Config'
import { PriceIndexer } from '../PriceIndexer'
import { AmountRepository } from '../repositories/AmountRepository'
import { PriceRepository } from '../repositories/PriceRepository'
import { Tvl2Controller, Tvl2Project } from './Tvl2Controller'

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

  const projectConfig: Tvl2Project = {
    minTimestamp: new UnixTime(0),
    indexers: [{ safeHeight: 100 }],
    id: ProjectId('test-project'),
  }

  const amountConfig = mockObject<AmountConfigEntry>({
    project: projectConfig.id,
    type: 'totalSupply',
    address: EthereumAddress.random(),
    chain: 'ethereum',
  })
  const priceConfig = mockObject<PriceConfigEntry>({
    chain: amountConfig.chain,
    address: amountConfig.address,
    decimals: 6,
  })

  describe(Tvl2Controller.prototype.getTvlAt.name, () => {
    describe('calls getProjectTvl with the correct timestamp', () => {
      it('when the timestamp is before the safe height', async () => {
        const timestamp = new UnixTime(50)

        const controller = new Tvl2Controller(
          mockObject<AmountRepository>(),
          mockObject<PriceRepository>(),
          { safeHeight: 100 },
          [projectConfig],
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
        expect(mockGetProjectTvl).toHaveBeenOnlyCalledWith(
          projectConfig.id,
          timestamp,
        )
      })

      it('when the timestamp is after the safe height', async () => {
        const timestamp = new UnixTime(150)

        const controller = new Tvl2Controller(
          mockObject<AmountRepository>(),
          mockObject<PriceRepository>(),
          { safeHeight: 100 },
          [projectConfig],
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
        expect(mockGetProjectTvl).not.toHaveBeenCalled()
      })
    })
  })

  describe(Tvl2Controller.prototype.getTvl.name, () => {
    it('calls getTvlAt for each full day', async () => {
      const start = projectConfig.minTimestamp

      const safeHeight = start.add(3, 'days').toNumber()

      const controller = new Tvl2Controller(
        mockObject<AmountRepository>(),
        mockObject<PriceRepository>(),
        { safeHeight },
        [{ ...projectConfig, indexers: [{ safeHeight }] }],
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
