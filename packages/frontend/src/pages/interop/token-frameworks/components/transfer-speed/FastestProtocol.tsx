import { formatSeconds } from '@l2beat/shared-pure'
import { Skeleton } from '~/components/core/Skeleton'
import type { FrameworkDominanceEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export function FastestProtocol({
  framework,
  entry,
  isLoading,
}: {
  framework: InteropTokenFramework | undefined
  entry: FrameworkDominanceEntry | undefined
  isLoading: boolean
}) {
  return (
    <div className="mt-3 flex flex-col rounded-lg bg-surface-secondary px-4 py-3 md:px-6 md:py-4">
      <span className="font-medium text-paragraph-13 text-secondary leading-none">
        Fastest protocol
      </span>
      {isLoading ? (
        <Skeleton className="mt-0.5 h-12 w-full" />
      ) : entry && framework ? (
        <div className="flex items-center justify-between gap-2 md:items-end">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={framework.iconUrl}
              alt=""
              className="size-10 rounded-lg"
            />
            <div className="flex min-w-0 flex-col">
              <span className="font-bold text-heading-18 leading-none">
                {framework.label}
              </span>
              <span className="truncate font-medium text-label-value-14 text-secondary leading-none">
                {framework.name}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-3">
            <Stat
              label="Transfer time"
              value={formatSeconds(entry.averageDurationSeconds ?? 0)}
            />
            <Stat
              label="Transaction count"
              value={`${formatInteger(entry.transferCount)} txs`}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-10 items-center font-medium text-paragraph-16 text-secondary">
          No transfers in the selected direction.
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md bg-surface-primary px-3 py-1 md:px-4 md:py-2">
      <span className="whitespace-nowrap font-medium text-paragraph-13 text-secondary leading-none">
        {label}
      </span>
      <span className="font-bold text-heading-16 leading-none">{value}</span>
    </div>
  )
}
