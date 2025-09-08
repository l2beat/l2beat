import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type UpdateMessageRecord,
  UpdateMessageRepository,
} from './UpdateMessageRepository'

describeDatabase(UpdateMessageRepository.name, (db) => {
  const repository = db.updateMessage

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('can get all messages', async () => {
    const message1 = record()
    const message2 = record({ timestamp: 100 })

    await repository.upsert(message1)
    await repository.upsert(message2)

    const result = await repository.getAll()

    expect(result).toEqual([message2, message1])
  })

  it('can upsert messages', async () => {
    const message: UpdateMessageRecord = {
      projectId: 'project',
      timestamp: 0,
      message: 'Initial message',
    }
    await repository.upsert(message)

    const updated: UpdateMessageRecord = {
      ...message,
      message: 'Updated message',
    }
    await repository.upsert(updated)
    const all = await repository.getAll()

    expect(all).toEqual([updated])
  })

  it('can delete messages before timestamp', async () => {
    const oldMessage = record({
      projectId: 'projectA',
      timestamp: UnixTime(100),
    })
    const newMessage = record({
      projectId: 'projectB',
      timestamp: UnixTime(200),
    })

    await repository.upsertMany([oldMessage, newMessage])

    const deleted = await repository.deleteBefore(UnixTime(150))
    expect(deleted).toEqual(1)

    const remaining = await repository.getAll()
    expect(remaining).toEqual([newMessage])
  })
})

function record(params?: Partial<UpdateMessageRecord>): UpdateMessageRecord {
  return {
    projectId: 'project',
    timestamp: 0,
    message: 'Test message',
    ...params,
  }
}
