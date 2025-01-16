export interface SyncStatus {
  isSynced: boolean
  syncedUntil: number
  type?: 'activity' | 'tvl'
  content?: string
}

export interface SyncStatusInfo {
  type: SyncStatus['type']
  content: string
}