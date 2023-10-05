import Router from '@koa/router'

import { DataUpdater, ReportUpdater } from '../core/assets'

export interface ApplicationModule {
  routers?: Router[]
  start?: () => Promise<void> | void
}

export interface TvlSubmodule {
  reportUpdaters?: ReportUpdater[]
  dataUpdaters?: DataUpdater[]
  start?: () => Promise<void> | void
}
