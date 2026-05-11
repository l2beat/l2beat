export interface DaTrackingStatusRow {
  configId: string
  type: 'baseLayer' | 'ethereum' | 'celestia' | 'avail' | 'eigen-da'
  projectId: string
  daLayer: string
  since: number
  sinceUnit: 'block' | 'timestamp'
  latestTimestamp: number | undefined
  ageSeconds: number | undefined
  details: string
  status: 'missing' | 'stale' | 'fresh'
}
