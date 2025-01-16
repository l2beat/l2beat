import { type SyncStatus } from '~/types/sync-status'
import { getNotSyncedContent } from './utils/get-not-synced-content'

interface Props {
  syncStatus: SyncStatus
}

export function NotSyncedBanner({ syncStatus }: Props) {
  return (
    <div className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium dark:bg-zinc-800">
      {getNotSyncedContent(syncStatus)}
    </div>
  )
}
