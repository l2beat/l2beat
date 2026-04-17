import type { Database } from '@l2beat/database'
import { TRPCError } from '@trpc/server'
import { expect } from 'earl'
import { appRouter } from './appRouter'
import { createCallerFactory } from './trpc'

function mockDb() {
  return {
    tokenFactInput: {
      getByName: async () => [],
      insertMany: async () => {},
      deleteAll: async () => 0,
    },
    interopTransfer: {
      getAll: async () => [],
    },
  } as unknown as Database
}

const createCaller = createCallerFactory(appRouter)

function makeCaller(writeEnabled: boolean) {
  return createCaller({ db: mockDb(), writeEnabled })
}

describe('appRouter write gating', () => {
  describe('when writeEnabled is false', () => {
    it('getConfig reports writeEnabled: false', async () => {
      const caller = makeCaller(false)
      expect(await caller.getConfig()).toEqual({ writeEnabled: false })
    })

    it('importFacts throws FORBIDDEN', async () => {
      const caller = makeCaller(false)
      await expect(caller.importFacts()).toBeRejectedWith(
        TRPCError,
        /disabled/i,
      )
    })

    it('clearFacts throws FORBIDDEN', async () => {
      const caller = makeCaller(false)
      await expect(caller.clearFacts()).toBeRejectedWith(TRPCError, /disabled/i)
    })
  })

  describe('when writeEnabled is true', () => {
    it('getConfig reports writeEnabled: true', async () => {
      const caller = makeCaller(true)
      expect(await caller.getConfig()).toEqual({ writeEnabled: true })
    })

    it('importFacts runs the import', async () => {
      const caller = makeCaller(true)
      const result = await caller.importFacts()
      expect(result).toEqual({ imported: 0, skipped: 0 })
    })

    it('clearFacts runs the delete', async () => {
      const caller = makeCaller(true)
      const result = await caller.clearFacts()
      expect(result).toEqual({ deleted: 0 })
    })
  })
})
