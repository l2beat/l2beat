import { DataUpdater, ReportUpdater } from '../assets'

export interface TvlModule {
  chain: string
  reportUpdaters?: ReportUpdater[]
  dataUpdaters?: DataUpdater[]
  start?: () => Promise<void> | void
}
