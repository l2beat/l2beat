import Router from '@koa/router'

import { AssetUpdater } from '../core/assets'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
}

export interface TvlSubmodule {
  updaters?: AssetUpdater[]
  start?: () => Promise<void> | void
}
