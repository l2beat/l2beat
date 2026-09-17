import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '../../../trpc/init'
import { createAppStateTrpcRouter } from './router'

describe(createAppStateTrpcRouter.name, () => {
  it('gets a value by key', async () => {
    const record = {
      key: 'interopAggregatesTimestampOverride' as const,
      value: 1_779_920_000,
      updatedAt: UnixTime(1_779_920_000),
      updatedBy: 'dev@l2beat.com',
    }
    const findByKey = vi.fn().mockResolvedValue(record)
    const caller = createCaller({ findByKey })

    const result = await caller.findByKey('interopAggregatesTimestampOverride')

    expect(findByKey).toHaveBeenCalledExactlyOnceWith(
      'interopAggregatesTimestampOverride',
    )
    expect(result).toEqual(record)
  })

  it('sets a value with the current user email', async () => {
    const insert = vi.fn().mockResolvedValue(undefined)
    const caller = createCaller({ insert }, { email: 'user@l2beat.com' })

    await caller.insert({
      key: 'interopAggregatesTimestampOverride',
      value: 1779920000,
    })

    expect(insert).toHaveBeenCalledExactlyOnceWith({
      key: 'interopAggregatesTimestampOverride',
      value: 1_779_920_000,
      updatedBy: 'user@l2beat.com',
    })
  })

  it('unsets a value by key', async () => {
    const deleteByKey = vi.fn().mockResolvedValue(1)
    const caller = createCaller({ deleteByKey })

    await caller.deleteByKey('interopAggregatesTimestampOverride')

    expect(deleteByKey).toHaveBeenCalledExactlyOnceWith(
      'interopAggregatesTimestampOverride',
    )
  })
})

function createCaller(
  appState: Partial<Database['appState']>,
  session = { email: 'dev@l2beat.com' },
) {
  const callerFactory = createCallerFactory(createAppStateTrpcRouter())
  return callerFactory({
    headers: new Headers(),
    db: {
      appState: appState as unknown as Database['appState'],
    } as unknown as Database,
    session,
  })
}
