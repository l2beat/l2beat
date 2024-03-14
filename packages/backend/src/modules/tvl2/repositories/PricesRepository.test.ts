import { Logger } from '@l2beat/backend-tools'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../../test/database'
import { PricesRecord, PricesRepository } from './PricesRepository'

describeDatabase(PricesRepository.name, (database) => {
  const repository = new PricesRepository(database, Logger.SILENT)

  afterEach(async () => {
    await repository.deleteAll()
  })

  describe(PricesRepository.prototype.addMany.name, () => {
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
      const records: PricesRecord[] = []
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

  describe(PricesRepository.prototype.deleteBeforeInclusive.name, () => {
    it('deletes all records before the given timestamp', async () => {
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

      await repository.deleteBeforeInclusive('chain', address, new UnixTime(1))

      const results = await repository.getAll()
      expect(results).toEqual(prices.slice(1))
    })
  })

  it(PricesRepository.prototype.deleteAll.name, async () => {
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
