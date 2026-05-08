import { formatSeconds } from '@l2beat/shared-pure'
import type { FrameworkDominanceEntry } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../../getInteropTokenFrameworksData'

export function FrameworkRow({
  framework,
  entry,
}: {
  framework: InteropTokenFramework
  entry: FrameworkDominanceEntry
}) {
  const duration = entry.averageDurationSeconds

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img src={framework.iconUrl} alt="" className="size-6 rounded-sm" />
        <span className="flex-1 font-bold text-heading-16">
          {framework.label}
        </span>
        <span className="font-bold text-label-value-18">
          {duration !== null ? formatSeconds(duration) : '—'}
        </span>
        <span className="w-16 text-right font-medium text-label-value-15 text-secondary">
          {duration !== null
            ? `${formatInteger(entry.transferCount)} txs`
            : '—'}
        </span>
      </div>
      <SpeedBar duration={duration ?? 0} color={framework.color} />
    </div>
  )
}

function SpeedBar({ duration, color }: { duration: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-secondary">
      {duration > 0 && (
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            animation: `transfer-speed-fill ${duration}s linear infinite both`,
          }}
        />
      )}
    </div>
  )
}
