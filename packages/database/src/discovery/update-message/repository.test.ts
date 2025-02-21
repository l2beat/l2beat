import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import type { UpdateMessageRecord } from './entity'
import { UpdateMessageRepository } from './repository'

describeDatabase(UpdateMessageRepository.name, (db) => {
  const repository = db.updateMessage

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it('can get all messages', async () => {
    const message1 = record()
    const message2 = record({
      chain: 'arbitrum',
      blockNumber: 100,
    })

    await repository.upsert(message1)
    await repository.upsert(message2)

    const result = await repository.getAll()

    expect(result).toEqual([message1, message2])
  })

  it('can upsert messages', async () => {
    const message: UpdateMessageRecord = {
      projectName: 'project',
      chain: 'ethereum',
      blockNumber: 1,
      timestamp: new UnixTime(0),
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
      projectName: 'projectA',
      timestamp: new UnixTime(100),
    })
    const newMessage = record({
      projectName: 'projectB',
      timestamp: new UnixTime(200),
    })

    await repository.upsertMany([oldMessage, newMessage])

    const deleted = await repository.deleteBefore(new UnixTime(150))
    expect(deleted).toEqual(1)

    const remaining = await repository.getAll()
    expect(remaining).toEqual([newMessage])
  })
})

function record(params?: Partial<UpdateMessageRecord>): UpdateMessageRecord {
  return {
    projectName: 'project',
    chain: 'ethereum',
    blockNumber: 1,
    timestamp: new UnixTime(0),
    message: 'Test message',
    ...params,
  }
}
