import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { PriceRecord, PriceRepository } from './PriceRepository'

describeDatabase(PriceRepository.name, (database) => {
  const repository = new PriceRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(PriceRepository.prototype.addMany.name, () => {
    it('adds new rows', async () => {
      const newRows = [
        {
          chain: 'chain',
          address: EthereumAddress.random(),
          priceUsd: 1,
          timestamp: UnixTime.ZERO,
        },
        {
          chain: 'chain',
          address: EthereumAddress.random(),
          priceUsd: 2,
          timestamp: UnixTime.ZERO,
        },
      ]
      await repository.addMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted(newRows)
    })

    it('empty array', async () => {
      await expect(repository.addMany([])).not.toBeRejected()
    })

    it('performs batch insert when more than 10k records', async () => {
      const records: PriceRecord[] = []
      for (let i = 5; i < 15_000; i++) {
        records.push({
          chain: 'chain',
          address: EthereumAddress.random(),
          timestamp: UnixTime.ZERO,
          priceUsd: 1,
        })
      }
      await expect(repository.addMany(records)).not.toBeRejected()
    })
  })

  describe(PriceRepository.prototype.deleteAfterExclusive.name, () => {
    it('deletes all records after the given timestamp', async () => {
      const address = EthereumAddress.random()

      const prices = [
        {
          chain: 'chain',
          address,
          priceUsd: 1,
          timestamp: new UnixTime(1),
        },
        {
          chain: 'chain',
          address,
          priceUsd: 1,
          timestamp: new UnixTime(2),
        },
        {
          chain: 'chain-2',
          address,
          priceUsd: 2,
          timestamp: new UnixTime(1),
        },
        {
          chain: 'chain',
          address: EthereumAddress.random(),
          priceUsd: 1,
          timestamp: new UnixTime(1),
        },
      ]
      await repository.addMany(prices)

      await repository.deleteAfterExclusive('chain', address, new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqual([prices[0], prices[2], prices[3]])
    })
  })

  it(PriceRepository.prototype.deleteAll.name, async () => {
    await repository.addMany([
      {
        chain: 'chain',
        address: EthereumAddress.random(),
        priceUsd: 1,
        timestamp: UnixTime.ZERO,
      },
    ])

    await repository.deleteAll()

    const results = await repository.getAll()

    expect(results).toEqual([])
  })
})
