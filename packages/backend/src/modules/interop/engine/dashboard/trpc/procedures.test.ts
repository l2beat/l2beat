import type { Database } from '@l2beat/database'
import { TRPCError } from '@trpc/server'
import { expect, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../trpc/init'
import { createChainsRouter } from './routers/chains'

describe('interop trpc auth', () => {
  it('rejects unauthenticated callers', async () => {
    const callerFactory = createCallerFactory(
      createChainsRouter({
        getExplorerUrl: () => undefined,
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db: mockObject<Database>({}),
      session: undefined,
    })

    let error: unknown
    try {
      await caller.metadata()
    } catch (caught) {
      error = caught
    }

    expect(error).toBeA(TRPCError)
    expect((error as TRPCError).code).toEqual('UNAUTHORIZED')
  })
})
