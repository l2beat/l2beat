export interface DaTrackingStatusRow {
  configId: string
  type: 'baseLayer' | 'ethereum'
  projectId: string
  daLayer: string
  sinceBlock: number
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  details: string
  status: 'missing' | 'stale' | 'fresh'
}
