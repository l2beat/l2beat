import { formatSeconds } from '@l2beat/shared-pure'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function InteropTransferSpeedRow({
  slug,
  iconUrl,
  label,
  color,
  durationSeconds,
  transferCount,
}: {
  slug: string
  iconUrl: string
  label: string
  color: string
  durationSeconds: number | null
  transferCount: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <a
          href={`/interop/protocols/${slug}`}
          className="inline-flex w-fit items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-pure-black/5 dark:hover:bg-pure-white/10"
        >
          <img src={iconUrl} alt="" className="size-6 rounded-sm" />
          <span className="font-bold text-heading-16">{label}</span>
        </a>
        <span className="ml-auto font-bold text-label-value-18">
          {durationSeconds !== null ? formatSeconds(durationSeconds) : '—'}
        </span>
        <span className="w-16 text-right font-medium text-label-value-15 text-secondary">
          {durationSeconds !== null
            ? `${formatInteger(transferCount)} txs`
            : '—'}
        </span>
      </div>
      <SpeedBar duration={durationSeconds ?? 0} color={color} />
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
