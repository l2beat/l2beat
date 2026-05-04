export interface TrackedTxsStatusRow {
  configId: string
  feature: 'liveness' | 'l2costs'
  projectId: string
  subtype: string
  sinceTimestamp: number
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  formula: string
  status: 'missing' | 'stale' | 'fresh'
}
