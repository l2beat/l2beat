import type { ApplicationModule, TrpcContribution } from '../types'
import {
  createKeyValueTrpcRouter,
  type KeyValueTrpcRouter,
} from './trpc/router'

export type KeyValueApplicationModule = ApplicationModule & {
  trpc: TrpcContribution<'keyValue', KeyValueTrpcRouter>
}

export function createKeyValueModule(): KeyValueApplicationModule {
  return {
    trpc: {
      namespace: 'keyValue',
      trpcRouter: createKeyValueTrpcRouter(),
    },
  }
}
