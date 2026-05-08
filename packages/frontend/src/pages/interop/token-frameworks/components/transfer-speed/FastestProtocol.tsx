import { formatSeconds } from '@l2beat/shared-pure'
import type { FrameworkDominanceEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export function FastestProtocol({
  framework,
  entry,
}: {
  framework: InteropTokenFramework
  entry: FrameworkDominanceEntry
}) {
  return (
    <div className="mt-2 flex items-center gap-3">
      <img src={framework.iconUrl} alt="" className="size-10 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-bold text-heading-18 leading-none">
          {framework.label}
        </span>
        <span className="truncate font-medium text-label-value-14 text-secondary leading-none">
          {framework.name}
        </span>
      </div>
      <Stat
        label="Transfer time"
        value={formatSeconds(entry.averageDurationSeconds ?? 0)}
      />
      <Stat
        label="Transaction count"
        value={`${formatInteger(entry.transferCount)} txs`}
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-md bg-surface-primary px-4 py-2">
      <span className="font-medium text-paragraph-13 text-secondary leading-none">
        {label}
      </span>
      <span className="font-bold text-heading-16 leading-none">{value}</span>
    </div>
  )
}
