import { type SyncStatus } from '~/types/sync-status'
import { GrayedOut } from './grayed-out'

interface Props {
  syncStatus: SyncStatus | undefined
  children: React.ReactNode
}
export function SyncStatusWrapper({ syncStatus, children }: Props) {
  if (!syncStatus) {
    return children
  }

  return <GrayedOut>{children}</GrayedOut>
}
