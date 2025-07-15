import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../../test/database'
import type { NotificationRecord } from './entity'
import { NotificationsRepository } from './repository'

describeDatabase(NotificationsRepository.name, (db) => {
  const repository = db.notifications

  const START = UnixTime.now()
  const DATA: NotificationRecord[] = [
    {
      id: '1',
      channel: 'discord',
      type: 'anomaly',
      relatedEntityId: 'projectA',
      timestamp: START - 1 * UnixTime.HOUR,
    },
    {
      id: '2',
      channel: 'discord',
      type: 'anomaly',
      relatedEntityId: 'projectB',
      timestamp: START - 2 * UnixTime.HOUR,
    },
    {
      id: '3',
      channel: 'discord',
      type: 'anomaly',
      relatedEntityId: 'projectB',
      timestamp: START - 3 * UnixTime.HOUR,
    },
  ]

  beforeEach(async function () {
    this.timeout(10000)
    await repository.deleteAll()
    await repository.insertMany(DATA)
  })

  describe(NotificationsRepository.prototype.insertMany.name, () => {
    it('add new', async () => {
      const newRows: NotificationRecord[] = [
        {
          id: '4',
          channel: 'discord',
          type: 'anomaly',
          relatedEntityId: 'projectB',
          timestamp: START - 4 * UnixTime.HOUR,
        },
        {
          id: '5',
          channel: 'discord',
          type: 'anomaly',
          relatedEntityId: 'projectB',
          timestamp: START - 5 * UnixTime.HOUR,
        },
      ]

      await repository.insertMany(newRows)

      const results = await repository.getAll()
      expect(results).toEqualUnsorted([...DATA, ...newRows])
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).not.toBeRejected()
    })
  })

  describe(NotificationsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      expect(results).toEqualUnsorted(
        DATA.map((e) => ({
          ...e,
        })),
      )
    })
  })

  describe(NotificationsRepository.prototype.getByRelatedEntityId.name, () => {
    it('should return all rows for related entity', async () => {
      const results = await repository.getByRelatedEntityId('projectA')

      expect(results).toEqualUnsorted([DATA[0]!])
    })
  })

  describe(NotificationsRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toEqual([])
    })
  })
})
