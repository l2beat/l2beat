import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../trpc'
import { createFinancialsRouter } from './financials'

describe(createFinancialsRouter.name, () => {
  it('marks all transfers as unprocessed', async () => {
    const markAllAsUnprocessed = mockFn().resolvesTo(42)
    const interopTransfer = mockObject<Database['interopTransfer']>({
      markAllAsUnprocessed,
    })
    const db = mockObject<Database>({
      interopTransfer,
    })

    const callerFactory = createCallerFactory(createFinancialsRouter())
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.refresh()

    expect(markAllAsUnprocessed).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ updatedTransfers: 42 })
  })
})
