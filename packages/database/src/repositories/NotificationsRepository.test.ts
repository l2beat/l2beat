import { UnixTime } from '@l2beat/shared-pure'
import { beforeEach, describe, expect, it } from 'vitest'
import { describeDatabase } from '../test/database'
import {
  type NotificationRecord,
  NotificationsRepository,
} from './NotificationsRepository'

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

  beforeEach(async () => {
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
      const expected = [...DATA, ...newRows]
      expect(results).toHaveLength(expected.length)
      expect(results).toStrictEqual(expect.arrayContaining(expected))
    })

    it('empty array', async () => {
      await expect(repository.insertMany([])).resolves.not.toThrow()
    })
  })

  describe(NotificationsRepository.prototype.getAll.name, () => {
    it('should return all rows', async () => {
      const results = await repository.getAll()

      const expected = DATA.map((e) => ({
        ...e,
      }))
      expect(results).toHaveLength(expected.length)
      expect(results).toStrictEqual(expect.arrayContaining(expected))
    })
  })

  describe(NotificationsRepository.prototype.getByRelatedEntityId.name, () => {
    it('should return all rows for related entity', async () => {
      const results = await repository.getByRelatedEntityId('projectA')

      expect(results).toHaveLength(1)
      expect(results).toStrictEqual(expect.arrayContaining([DATA[0]!]))
    })
  })

  describe(NotificationsRepository.prototype.deleteAll.name, () => {
    it('should delete all rows', async () => {
      await repository.deleteAll()

      const results = await repository.getAll()

      expect(results).toStrictEqual([])
    })
  })
})
