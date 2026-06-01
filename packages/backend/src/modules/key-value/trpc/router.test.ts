import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../trpc/init'
import { createKeyValueTrpcRouter } from './router'

describe(createKeyValueTrpcRouter.name, () => {
  it('gets a value by key', async () => {
    const record = {
      key: 'interopAggregatesTimestampOverride' as const,
      value: 1_779_920_000,
      updatedAt: UnixTime(1_779_920_000),
      updatedBy: 'dev@l2beat.com',
    }
    const get = mockFn().resolvesTo(record)
    const caller = createCaller({ get })

    const result = await caller.get('interopAggregatesTimestampOverride')

    expect(get).toHaveBeenOnlyCalledWith('interopAggregatesTimestampOverride')
    expect(result).toEqual(record)
  })

  it('sets a value with the current user email', async () => {
    const set = mockFn().resolvesTo(undefined)
    const caller = createCaller({ set }, { email: 'user@l2beat.com' })

    await caller.set({
      key: 'interopAggregatesTimestampOverride',
      value: 1779920000,
    })

    expect(set).toHaveBeenOnlyCalledWith({
      key: 'interopAggregatesTimestampOverride',
      value: 1_779_920_000,
      updatedBy: 'user@l2beat.com',
    })
  })
})

function createCaller(
  keyValue: Partial<Database['keyValue']>,
  session = { email: 'dev@l2beat.com' },
) {
  const callerFactory = createCallerFactory(createKeyValueTrpcRouter())
  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>({
      keyValue: mockObject<Database['keyValue']>(keyValue),
    }),
    session,
  })
}
