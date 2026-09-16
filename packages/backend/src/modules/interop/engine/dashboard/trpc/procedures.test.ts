import type { Database } from '@l2beat/database'
import { mockObject } from '@l2beat/test-utils'
import { TRPCError } from '@trpc/server'
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '../../../../../trpc/init'
import { createChainsRouter } from './routers/chains'

describe('interop trpc auth', () => {
  it('rejects unauthenticated callers', async () => {
    const callerFactory = createCallerFactory(
      createChainsRouter({
        getExplorerUrl: () => undefined,
        chains: [],
        oneSidedChains: [],
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

    expect(error).toBeInstanceOf(TRPCError)
    expect((error as TRPCError).code).toStrictEqual('UNAUTHORIZED')
  })
})
