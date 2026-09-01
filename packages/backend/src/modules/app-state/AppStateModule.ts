import type { ApplicationModule, TrpcContribution } from '../types'
import {
  type AppStateTrpcRouter,
  createAppStateTrpcRouter,
} from './trpc/router'

export type AppStateApplicationModule = ApplicationModule & {
  trpc: TrpcContribution<'appState', AppStateTrpcRouter>
}

export function createAppStateModule(): AppStateApplicationModule {
  return {
    trpc: {
      namespace: 'appState',
      trpcRouter: createAppStateTrpcRouter(),
    },
  }
}
