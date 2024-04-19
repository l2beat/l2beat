export interface ValueWithDisplayValue {
  value: number
  displayValue: string
}

export type SyncStatus = {
  isSynced: boolean
  displaySyncedUntil: string
}
