import { type NotSyncedStatus } from '~/types/sync-status'

interface Props {
  syncStatus: NotSyncedStatus
}

export function NotSyncedBanner({ syncStatus }: Props) {
  return (
    <div className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium dark:bg-zinc-800">
      {syncStatus.content}
    </div>
  )
}
