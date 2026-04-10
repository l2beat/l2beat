import type { Database } from '@l2beat/database'
import { expect, mockObject } from 'earl'
import { createCallerFactory } from '../trpc'
import { createStatusRouter } from './status'

describe(createStatusRouter.name, () => {
  it('returns processor statuses', async () => {
    const statuses = [
      {
        chain: 'ethereum',
        block: 123,
        timestamp: 1_700_000_000,
      },
      {
        chain: 'arbitrum',
        block: 456,
        timestamp: 1_700_000_123,
      },
    ]

    const callerFactory = createCallerFactory(
      createStatusRouter({
        getProcessorStatuses: () => statuses,
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db: mockObject<Database>({}),
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.processors()

    expect(result).toEqual(statuses)
  })
})
