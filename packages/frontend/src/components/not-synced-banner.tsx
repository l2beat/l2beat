import { formatTimestamp } from '~/utils/dates'

export function NotSyncedBanner<
  T extends { syncStatus: { syncedUntil: number } },
>({ what, data }: { what: string; data: T }) {
  return (
    <div className="flex w-full items-center rounded-lg bg-gray-200 px-4 py-2 text-xs font-medium dark:bg-zinc-800">
      {what} has not been synced since:{' '}
      {formatTimestamp(data.syncStatus.syncedUntil, {
        mode: 'date',
        longMonthName: true,
      })}
    </div>
  )
}
