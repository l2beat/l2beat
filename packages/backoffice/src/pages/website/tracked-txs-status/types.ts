export interface TrackedTxsStatusRow {
  projectId: string
  subtype: string
  sinceTimestamp: number
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  configsCount: number
  configsWithDataCount: number
  missingConfigsCount: number
  staleConfigsCount: number
  formulas: string[]
  status: 'missing' | 'stale' | 'fresh'
}
